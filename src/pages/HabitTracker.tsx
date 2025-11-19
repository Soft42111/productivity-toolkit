import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Target } from "lucide-react";
import type { User } from '@supabase/supabase-js';

interface Habit {
  id: string;
  name: string;
  completed_today: boolean;
  streak: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const HabitTracker = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
      else fetchHabits();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchHabits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) setHabits(data);
  };

  const addHabit = async () => {
    if (!user || !newHabit.trim()) return;

    const { data, error } = await supabase
      .from("habits")
      .insert([{ name: newHabit, user_id: user.id, completed_today: false, streak: 0 }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setHabits([...habits, data]);
      setNewHabit("");
      toast({ title: "Habit added!" });
    }
  };

  const toggleHabit = async (id: string, completed: boolean) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newStreak = completed ? habit.streak + 1 : 0;

    const { error } = await supabase
      .from("habits")
      .update({ completed_today: completed, streak: newStreak })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setHabits(habits.map(h => h.id === id ? { ...h, completed_today: completed, streak: newStreak } : h));
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setHabits(habits.filter(h => h.id !== id));
      toast({ title: "Habit deleted" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Habit Tracker
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add a new habit..."
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
              <Button onClick={addHabit} disabled={!newHabit.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={habit.completed_today}
                      onCheckedChange={(checked) => toggleHabit(habit.id, checked as boolean)}
                    />
                    <div>
                      <p className={`font-semibold ${habit.completed_today ? "line-through text-muted-foreground" : ""}`}>
                        {habit.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        🔥 {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => deleteHabit(habit.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default HabitTracker;
