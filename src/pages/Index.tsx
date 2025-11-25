import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import InteractiveDots from "@/components/InteractiveDots";
import CodeTabs from "@/components/CodeTabs";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [gradientOffset, setGradientOffset] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load pinned apps from localStorage
    const pinnedFromStorage = localStorage.getItem('pinnedApps');
    if (pinnedFromStorage) {
      setPinnedApps(JSON.parse(pinnedFromStorage));
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Animate gradient based on scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = window.scrollY / maxScroll;
      setGradientOffset(scrollProgress * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fetchPinnedApps = async () => {
    // No longer needed - using localStorage
  };

  const togglePin = async (path: string) => {
    const pinnedFromStorage = localStorage.getItem('pinnedApps');
    const currentPinned = pinnedFromStorage ? JSON.parse(pinnedFromStorage) : [];
    
    const isPinned = currentPinned.includes(path);

    if (isPinned) {
      const newPinned = currentPinned.filter((p: string) => p !== path);
      localStorage.setItem('pinnedApps', JSON.stringify(newPinned));
      setPinnedApps(newPinned);
      toast({ title: "Unpinned" });
    } else {
      const newPinned = [...currentPinned, path];
      localStorage.setItem('pinnedApps', JSON.stringify(newPinned));
      setPinnedApps(newPinned);
      toast({ title: "Pinned to favorites" });
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

  // Filter apps based on search query
  const filterApps = (apps: typeof allApps) => {
    if (!searchQuery) return apps;
    return apps.filter(app => 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPinnedApps = filterApps(pinnedAppsList);
  const filteredBestApps = filterApps(bestApps);
  const filteredOtherApps = filterApps(otherApps);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <InteractiveDots />
      
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${50 + gradientOffset * 0.3}% ${30 + gradientOffset * 0.5}%, hsl(var(--primary) / 0.15), transparent 50%), 
                       radial-gradient(circle at ${20 - gradientOffset * 0.2}% ${70 + gradientOffset * 0.3}%, hsl(var(--accent) / 0.1), transparent 50%)`,
          transition: "background 0.3s ease-out",
        }}
      />
      
      {/* Hero Section - What is this? */}
      <div className="relative z-10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-semibold text-foreground">
                Power Tools
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <button onClick={() => scrollToSection("featured")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Featured
                </button>
                <button onClick={() => scrollToSection("all-tools")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </button>
                <Link to="/founder-note" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Founder's Note
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <Button variant="ghost" onClick={handleSignOut} size="sm">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 flex-1 w-full relative z-10">
        {/* Introduction */}
        <div className="mb-24 text-center max-w-4xl mx-auto space-y-8 relative">
          <div 
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none"
            style={{ transform: `translate(-50%, ${scrollY * 0.3}px)` }}
          />
          
          {/* Badge */}
          <div className="inline-block animate-fade-in">
            <Badge className="px-4 py-1.5 bg-gradient-to-r from-accent/20 to-primary/20 text-accent border-accent/30 hover:scale-105 transition-transform">
              <Sparkles className="h-3 w-3 mr-1.5 inline" />
              40+ Productivity Tools
            </Badge>
          </div>
          
          <h2 
            className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight relative animate-fade-in"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            Essential tools for
            <span className="block text-gradient bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mt-2">
              modern workflows
            </span>
          </h2>
          <p 
            className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto relative animate-fade-in"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            Streamline your daily tasks with our curated collection of productivity tools. No installation required—everything works instantly in your browser.
            Fast, simple, and always accessible.
          </p>
          
          {/* Statistics Section */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 animate-fade-in">
            <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl lg:text-4xl font-bold text-gradient bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">40+</div>
              <div className="text-sm text-muted-foreground mt-1">Tools Available</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl lg:text-4xl font-bold text-gradient bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Free Forever</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl lg:text-4xl font-bold text-gradient bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">0</div>
              <div className="text-sm text-muted-foreground mt-1">Installs Needed</div>
            </div>
          </div>
          
          {/* Search - How do I find what I need? */}
          <div 
            className="max-w-md mx-auto pt-8 relative animate-fade-in"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-4 rounded-2xl border-2 border-border bg-background/60 backdrop-blur-sm text-sm shadow-lg transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent focus-visible:shadow-xl"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="mb-24" id="preview">
          <div className="max-w-3xl mx-auto">
            <CodeTabs />
          </div>
        </div>

        {/* Pinned Apps - Quick Access */}
        {filteredPinnedApps.length > 0 && (
          <div className="mb-20" id="pinned">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
                  Quick Access
                </h3>
              </div>
              <p className="text-base text-muted-foreground">
                Your most-used tools, always at hand
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredPinnedApps.map((app, index) => {
                const Icon = app.icon;
                const isPinned = pinnedApps.includes(app.path);
                return (
                  <Link 
                    key={index} 
                    to={app.path} 
                    className="group"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <Card className="aspect-square border-2 border-border/50 glass transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 relative overflow-hidden animate-fade-in backdrop-blur-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                        <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-foreground mb-3 transition-all duration-300 group-hover:scale-125 group-hover:text-accent drop-shadow-lg" />
                        <h3 className="text-xs font-semibold text-center leading-tight text-foreground group-hover:text-accent transition-colors">{app.title}</h3>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <Pin className="h-3 w-3 text-accent" />
                      </Button>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Apps - Best Tools */}
        <div className="mb-20" id="featured">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
                Featured Tools
              </h3>
            </div>
            <p className="text-base text-muted-foreground">
              Our most powerful and popular utilities
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
            {filteredBestApps.map((app, index) => {
              const Icon = app.icon;
              const isPinned = pinnedApps.includes(app.path);
              const isLarge = index === 0 || index === 5;
              return (
                <Link 
                  key={index} 
                  to={app.path} 
                  className={`group ${isLarge ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Card className={`${isLarge ? 'aspect-square' : 'aspect-square'} border-2 border-border/50 glass transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 relative overflow-hidden animate-fade-in backdrop-blur-xl`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                      <Icon className={`${isLarge ? 'w-16 h-16 lg:w-20 lg:h-20' : 'w-10 h-10 lg:w-12 lg:h-12'} text-foreground mb-3 transition-all duration-300 group-hover:scale-125 group-hover:text-accent drop-shadow-lg`} />
                      <h3 className={`${isLarge ? 'text-sm lg:text-base' : 'text-xs'} font-semibold text-center leading-tight text-foreground group-hover:text-accent transition-colors`}>{app.title}</h3>
                      {isLarge && <p className="text-[10px] lg:text-xs text-muted-foreground text-center mt-2 px-2">{app.description}</p>}
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      {isPinned ? <Pin className="h-3 w-3 text-accent" /> : <PinOff className="h-3 w-3 text-muted-foreground" />}
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Apps - Complete Collection */}
        <div id="all-tools">
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              All Tools
            </h3>
            <p className="text-base text-muted-foreground">
              The complete toolkit for every need
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredOtherApps.map((app, index) => {
              const Icon = app.icon;
              const isPinned = pinnedApps.includes(app.path);
              return (
                <Link 
                  key={index} 
                  to={app.path} 
                  className="group"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Card className="aspect-square border border-border/50 glass transition-all duration-300 hover:border-accent/50 hover:scale-[1.03] hover:shadow-xl relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                      <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-foreground mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-accent" />
                      <h3 className="text-xs font-medium text-center leading-tight text-foreground group-hover:text-accent transition-colors">{app.title}</h3>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => { e.preventDefault(); togglePin(app.path); }} 
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isPinned ? <Pin className="h-3 w-3 text-accent" /> : <PinOff className="h-3 w-3 text-muted-foreground" />}
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
