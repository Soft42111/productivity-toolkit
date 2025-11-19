import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  ListTodo, 
  Keyboard, 
  Timer, 
  Ruler, 
  Key,
  Sparkles,
  Zap,
  StickyNote,
  DollarSign,
  Clock,
  Target,
  FileText,
  Palette,
  Code,
  QrCode,
  Quote,
  Dices,
  Scale,
  Cake,
  FileType,
  Bot,
  UserCircle,
  Pin,
  PinOff
} from "lucide-react";
import type { User } from '@supabase/supabase-js';

const PinnedApps = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pinnedApps, setPinnedApps] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
      else fetchPinnedApps();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPinnedApps = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("pinned_apps")
      .select("app_path")
      .eq("user_id", user.id);
    
    if (!error && data) {
      setPinnedApps(data.map(p => p.app_path));
    }
  };

  const togglePin = async (path: string) => {
    if (!user) return;

    const isPinned = pinnedApps.includes(path);

    if (isPinned) {
      const { error } = await supabase
        .from("pinned_apps")
        .delete()
        .eq("app_path", path)
        .eq("user_id", user.id);

      if (!error) {
        setPinnedApps(pinnedApps.filter(p => p !== path));
        toast({ title: "Unpinned" });
      }
    } else {
      const { error } = await supabase
        .from("pinned_apps")
        .insert([{ app_path: path, user_id: user.id }]);

      if (!error) {
        setPinnedApps([...pinnedApps, path]);
        toast({ title: "Pinned to favorites" });
      }
    }
  };

  const allApps = [
    { title: "Chat with Gemini", description: "AI-powered conversational assistant", icon: Bot, path: "/chat-gemini", gradient: "from-purple-500 to-pink-500", isBest: true },
    { title: "Notes App", description: "Markdown-powered note taking", icon: StickyNote, path: "/notes", gradient: "from-yellow-500 to-orange-500", isBest: true },
    { title: "Habit Tracker", description: "Build and track daily habits", icon: Target, path: "/habit-tracker", gradient: "from-green-500 to-teal-500", isBest: true },
    { title: "Expense Tracker", description: "Track spending by category", icon: DollarSign, path: "/expenses", gradient: "from-blue-500 to-cyan-500", isBest: true },
    { title: "Pomodoro Timer", description: "Focus with timed work sessions", icon: Clock, path: "/pomodoro", gradient: "from-red-500 to-pink-500", isBest: true },
    { title: "Calculator", description: "Basic arithmetic calculator", icon: Calculator, path: "/calculator", gradient: "from-primary to-accent", isBest: false },
    { title: "Todo List", description: "Task management with cloud sync", icon: ListTodo, path: "/todo", gradient: "from-accent to-primary", isBest: false },
    { title: "Typing Test", description: "Test WPM and accuracy", icon: Keyboard, path: "/typing-test", gradient: "from-primary via-accent to-primary", isBest: false },
    { title: "Typing Practice", description: "Improve typing skills", icon: Zap, path: "/typing-practice", gradient: "from-accent via-primary to-accent", isBest: false },
    { title: "Stopwatch", description: "Time tracker with laps", icon: Timer, path: "/stopwatch", gradient: "from-primary to-accent", isBest: false },
    { title: "Unit Converter", description: "Convert units instantly", icon: Ruler, path: "/unit-converter", gradient: "from-accent to-primary", isBest: false },
    { title: "Password Generator", description: "Generate secure passwords", icon: Key, path: "/password-generator", gradient: "from-primary via-accent to-primary", isBest: false },
    { title: "QR Code Generator", description: "Create QR codes instantly", icon: QrCode, path: "/qr-generator", gradient: "from-blue-500 to-purple-500", isBest: false },
    { title: "Markdown Editor", description: "Real-time markdown preview", icon: FileText, path: "/markdown", gradient: "from-green-500 to-blue-500", isBest: false },
    { title: "Color Picker", description: "Pick and convert colors", icon: Palette, path: "/color-picker", gradient: "from-pink-500 to-purple-500", isBest: false },
    { title: "JSON Formatter", description: "Format and validate JSON", icon: Code, path: "/json-formatter", gradient: "from-orange-500 to-red-500", isBest: false },
    { title: "Base64 Tool", description: "Encode/decode Base64", icon: FileType, path: "/base64", gradient: "from-cyan-500 to-blue-500", isBest: false },
    { title: "Random Generator", description: "Generate random values", icon: Dices, path: "/random", gradient: "from-purple-500 to-pink-500", isBest: false },
    { title: "BMI Calculator", description: "Calculate body mass index", icon: Scale, path: "/bmi", gradient: "from-green-500 to-teal-500", isBest: false },
    { title: "Age Calculator", description: "Calculate exact age", icon: Cake, path: "/age-calculator", gradient: "from-pink-500 to-red-500", isBest: false },
    { title: "Word Counter", description: "Count words and characters", icon: FileText, path: "/word-counter", gradient: "from-blue-500 to-indigo-500", isBest: false },
    { title: "Quote Generator", description: "Get inspired with AI-generated quotes", icon: Quote, path: "/quotes", gradient: "from-indigo-500 to-purple-500", isBest: false },
    { title: "Countdown Timer", description: "Set countdown timers", icon: Timer, path: "/countdown", gradient: "from-orange-500 to-yellow-500", isBest: false },
    { title: "User Profile", description: "Manage your profile", icon: UserCircle, path: "/profile", gradient: "from-gray-500 to-slate-500", isBest: false },
  ];

  const pinnedAppsList = allApps.filter(app => pinnedApps.includes(app.path));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Pinned Apps
          </h1>
          <p className="text-muted-foreground">
            {pinnedAppsList.length} app{pinnedAppsList.length !== 1 ? 's' : ''} pinned
          </p>
        </div>

        {pinnedAppsList.length === 0 ? (
          <Card className="p-12 text-center shadow-lg">
            <Pin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No Pinned Apps Yet</h2>
            <p className="text-muted-foreground mb-6">
              Go to the home page and pin your favorite apps to see them here!
            </p>
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedAppsList.map((app, index) => {
              const Icon = app.icon;
              const isPinned = pinnedApps.includes(app.path);
              return (
                <Card key={index} className="group relative overflow-hidden border-border/50 backdrop-blur-sm bg-card/50 h-full hover:shadow-lg transition-shadow">
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="p-6 relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4 flex-1">
                      <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => togglePin(app.path)}
                        className="h-8 w-8"
                      >
                        {isPinned ? <Pin className="h-4 w-4 text-primary" /> : <PinOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Link to={app.path} className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer">
                        {app.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </Link>
                    <Button asChild className="w-full mt-4">
                      <Link to={app.path}>Open</Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PinnedApps;
