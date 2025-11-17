import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "@/components/NavLink";
import { Search, Trash2, Plus, LogOut, Loader2, X } from "lucide-react";
import type { User, Session } from '@supabase/supabase-js';
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch todos from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching todos",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTodos(data || []);
      }
    };

    fetchTodos();
  }, [user, toast]);

  const addTodo = async () => {
    if (!inputValue.trim() || !user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: inputValue, user_id: user.id, completed: false }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding todo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTodos([data, ...todos]);
      setInputValue("");
      toast({
        title: "Todo added",
        description: "Your task has been added successfully.",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Your task has been removed.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    if (completedIds.length === 0) return;

    const { error } = await supabase
      .from("todos")
      .delete()
      .in("id", completedIds);

    if (error) {
      toast({
        title: "Error clearing completed todos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTodos(todos.filter((todo) => !todo.completed));
      toast({
        title: "Completed todos cleared",
        description: "All completed tasks have been removed.",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Todo List
          </h1>

          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new task..."
                  className="pr-10"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={addTodo} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {filteredTodos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? "No tasks found matching your search"
                    : "No tasks yet. Add one above!"}
                </p>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="flex-shrink-0"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {todos.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <span>
                  {todos.filter((t) => !t.completed).length} active •{" "}
                  {todos.filter((t) => t.completed).length} completed
                </span>
                {todos.some((t) => t.completed) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompleted}
                  >
                    Clear completed
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TodoList;
