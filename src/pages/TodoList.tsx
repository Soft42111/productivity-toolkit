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

  const STORAGE_KEY = "todos_local";

  // Load todos from localStorage
  const loadLocalTodos = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save todos to localStorage
  const saveLocalTodos = (todosToSave: Todo[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todosToSave));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  };

  // Auth listener - no redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load todos on mount and when user changes
  useEffect(() => {
    if (loading) return;

    if (user) {
      // Fetch from Supabase if authenticated
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
    } else {
      // Load from localStorage if not authenticated
      setTodos(loadLocalTodos());
    }
  }, [user, loading, toast]);

  const addTodo = async () => {
    if (!inputValue.trim()) return;

    if (user) {
      // Supabase flow
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
    } else {
      // localStorage flow
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: inputValue,
        completed: false,
        user_id: "local",
      };
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      saveLocalTodos(updatedTodos);
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

    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    if (user) {
      // Supabase flow
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
        return;
      }
    } else {
      // localStorage flow
      saveLocalTodos(updatedTodos);
    }

    setTodos(updatedTodos);
  };

  const deleteTodo = async (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    if (user) {
      // Supabase flow
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        toast({
          title: "Error deleting todo",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } else {
      // localStorage flow
      saveLocalTodos(updatedTodos);
    }

    setTodos(updatedTodos);
    toast({
      title: "Todo deleted",
      description: "Your task has been removed.",
    });
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

    const updatedTodos = todos.filter((todo) => !todo.completed);

    if (user) {
      // Supabase flow
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
        return;
      }
    } else {
      // localStorage flow
      saveLocalTodos(updatedTodos);
    }

    setTodos(updatedTodos);
    toast({
      title: "Completed todos cleared",
      description: "All completed tasks have been removed.",
    });
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
            {user ? (
              <Button variant="outline" onClick={handleSignOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")} size="sm">
                Sign In
              </Button>
            )}
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
