import { Card } from "@/components/ui/card";
import { Calculator, ListTodo, Keyboard, Timer, Ruler, Key, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import ShootingStars from "@/components/ShootingStars";

const Index = () => {
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
      description: "Organize tasks with search and localStorage persistence",
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
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <ShootingStars />
      <div className="max-w-6xl mx-auto px-6 py-12 flex-1 relative z-10">
        <div className="flex justify-end mb-4 animate-fade-in">
          <ThemeToggle />
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
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                  Open Tool
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <p className="text-sm text-muted-foreground">
              More tools coming soon! Stay tuned for updates.
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
