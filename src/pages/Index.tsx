import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import InteractiveParticles from "@/components/InteractiveParticles";
import CodeTabs from "@/components/CodeTabs";
import RobotHero from "@/components/RobotHero";
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from '@supabase/supabase-js';
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
  LogIn,
  Pin,
  PinOff,
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
  Cloud,
  TrendingUp,
  Mic,
  Link2,
  Book,
  Bell,
  Compass,
  Calendar
} from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [pinnedApps, setPinnedApps] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession) {
        fetchPinnedApps();
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession) {
        fetchPinnedApps();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to pin apps", variant: "destructive" });
      return;
    }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const allApps = [
    { title: "Islamic Studies", description: "Sunnah, Hadith & Quran with references", icon: Book, path: "/islamic-studies", gradient: "from-emerald-500 to-teal-500", isBest: true },
    { title: "Islamic Calendar", description: "Hijri dates and important events", icon: Calendar, path: "/islamic-calendar", gradient: "from-amber-500 to-orange-500", isBest: true },
    { title: "Qibla Compass", description: "Find prayer direction to Kaaba", icon: Compass, path: "/qibla-compass", gradient: "from-teal-500 to-cyan-500", isBest: true },
    { title: "Islamic Reminders", description: "Prayer times & Quran notifications", icon: Bell, path: "/islamic-reminders", gradient: "from-violet-500 to-purple-500", isBest: true },
    { title: "Chat with Gemini", description: "AI-powered conversational assistant", icon: Bot, path: "/chat-gemini", gradient: "from-purple-500 to-pink-500", isBest: true },
    { title: "Weather Dashboard", description: "Real-time weather data", icon: Cloud, path: "/weather", gradient: "from-blue-500 to-cyan-500", isBest: true },
    { title: "Currency Converter", description: "Live exchange rates", icon: TrendingUp, path: "/currency", gradient: "from-green-500 to-emerald-500", isBest: true },
    { title: "Notes App", description: "Markdown-powered note taking", icon: StickyNote, path: "/notes", gradient: "from-yellow-500 to-orange-500", isBest: true },
    { title: "Habit Tracker", description: "Build and track daily habits", icon: Target, path: "/habit-tracker", gradient: "from-green-500 to-teal-500", isBest: true },
    { title: "Expense Tracker", description: "Track spending by category", icon: DollarSign, path: "/expenses", gradient: "from-blue-500 to-cyan-500", isBest: true },
    { title: "Voice Recorder", description: "Record and download audio", icon: Mic, path: "/voice-recorder", gradient: "from-red-500 to-rose-500", isBest: true },
    { title: "Link Shortener", description: "Create short URLs", icon: Link2, path: "/link-shortener", gradient: "from-indigo-500 to-violet-500", isBest: true },
    { title: "Pomodoro Timer", description: "Focus with timed work sessions", icon: Clock, path: "/pomodoro", gradient: "from-red-500 to-pink-500", isBest: false },
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
    { title: "Quote Generator", description: "Generate random quotes", icon: Quote, path: "/quotes", gradient: "from-indigo-500 to-purple-500", isBest: false },
    { title: "Countdown Timer", description: "Set countdown timers", icon: Timer, path: "/countdown", gradient: "from-orange-500 to-yellow-500", isBest: false },
    { title: "User Profile", description: "Manage your profile", icon: UserCircle, path: "/profile", gradient: "from-gray-500 to-slate-500", isBest: false },
  ];

  const bestApps = allApps.filter(app => app.isBest);
  const pinnedAppsList = allApps.filter(app => pinnedApps.includes(app.path));
  const otherApps = allApps.filter(app => !app.isBest);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <InteractiveParticles />
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-foreground tracking-tight">
            Power Tools
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={handleSignOut} size="sm" className="h-8">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth")} size="sm" className="h-8">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 items-center">
          <RobotHero />
          <CodeTabs />
        </div>

        {pinnedAppsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider mb-4">
              Pinned
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {pinnedAppsList.map((app, index) => {
                const Icon = app.icon;
                const isPinned = pinnedApps.includes(app.path);
                return (
                  <Link key={index} to={app.path} className="group">
                    <Card className="aspect-square border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] relative overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <Icon className="w-12 h-12 text-foreground mb-2" />
                        <h3 className="text-xs font-medium text-foreground text-center leading-tight">{app.title}</h3>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pin className="h-3 w-3 text-foreground" />
                      </Button>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider mb-4">
            Featured
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-fr">
            {bestApps.map((app, index) => {
              const Icon = app.icon;
              const isPinned = pinnedApps.includes(app.path);
              const isLarge = index === 0 || index === 5;
              return (
                <Link 
                  key={index} 
                  to={app.path} 
                  className={`group ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <Card className={`${isLarge ? 'aspect-[2/1] md:aspect-square' : 'aspect-square'} border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] relative overflow-hidden`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <Icon className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12'} text-foreground mb-2`} />
                      <h3 className={`${isLarge ? 'text-sm' : 'text-xs'} font-medium text-foreground text-center leading-tight`}>{app.title}</h3>
                      {isLarge && <p className="text-[10px] text-muted-foreground text-center mt-1">{app.description}</p>}
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isPinned ? <Pin className="h-3 w-3 text-foreground" /> : <PinOff className="h-3 w-3 text-muted-foreground" />}
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider mb-4">
            All Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherApps.map((app, index) => {
              const Icon = app.icon;
              const isPinned = pinnedApps.includes(app.path);
              return (
                <Link key={index} to={app.path} className="group">
                  <Card className="aspect-square border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <Icon className="w-12 h-12 text-foreground mb-2" />
                      <h3 className="text-xs font-medium text-foreground text-center leading-tight">{app.title}</h3>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isPinned ? <Pin className="h-3 w-3 text-foreground" /> : <PinOff className="h-3 w-3 text-muted-foreground" />}
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
