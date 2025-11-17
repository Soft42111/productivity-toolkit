import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ShootingStars from "@/components/ShootingStars";
import Footer from "@/components/Footer";
import type { User } from '@supabase/supabase-js';
import { 
  Calculator, 
  ListTodo, 
  Keyboard, 
  Timer, 
  Ruler, 
  Key,
  Sparkles,
  Zap,
  LogOut,
  LogIn
} from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const tools = [
    {
      title: "Calculator",
      description: "Scientific calculator with algebraic and trigonometric functions",
      icon: Calculator,
      path: "/calculator",
      gradient: "from-primary to-accent",
    },
    {
      title: "Todo List",
      description: "Organize tasks with cloud sync and search",
      icon: ListTodo,
      path: "/todo",
      gradient: "from-accent to-primary",
    },
    {
      title: "Typing Speed Test",
      description: "Test your typing speed with real-time WPM, accuracy, and error tracking",
      icon: Keyboard,
      path: "/typing-test",
      gradient: "from-primary via-accent to-primary",
    },
    {
      title: "Typing Practice",
      description: "Practice your typing skills without the pressure of metrics",
      icon: Zap,
      path: "/typing-practice",
      gradient: "from-accent via-primary to-accent",
    },
    {
      title: "Stopwatch",
      description: "Track time with lap functionality for precise measurements",
      icon: Timer,
      path: "/stopwatch",
      gradient: "from-primary to-accent",
    },
    {
      title: "Unit Converter",
      description: "Convert between length, weight, temperature, and volume units",
      icon: Ruler,
      path: "/unit-converter",
      gradient: "from-accent to-primary",
    },
    {
      title: "Password Generator",
      description: "Generate secure passwords with customizable strength options",
      icon: Key,
      path: "/password-generator",
      gradient: "from-primary via-accent to-primary",
    },
    {
      title: "Chat with Gemini AI",
      description: "Conversational AI chatbot powered by Google Gemini 2.5 Flash",
      icon: Sparkles,
      path: "/chat-gemini",
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <ShootingStars />
      <div className="max-w-6xl mx-auto px-6 py-12 flex-1 relative z-10">
        <div className="flex justify-end items-center gap-4 mb-4 animate-fade-in">
          <ThemeToggle />
          {user ? (
            <Button variant="outline" onClick={handleSignOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")} size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
        
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8 flex justify-center">
            <img 
              src="/cover.png" 
              alt="Productivity Dashboard Preview" 
              className="rounded-2xl shadow-[var(--shadow-hover)] max-w-3xl w-full border-2 border-primary/20 hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Productivity <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Toolkit</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one suite of essential tools for everyday tasks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="p-8 h-full transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-105 animate-scale-in">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {tool.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
