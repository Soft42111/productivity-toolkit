import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const FounderNote = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "The Spark: Science Exhibition Plan & Vision",
      content: `My name is Saad Hassan, and I've worked as a digital marketer specializing in community management. Throughout my career, I've observed countless problems requiring immediate attention—most were being addressed, but several were dismissed with a simple "I'm fine." I realized that if existing solutions weren't adequate, I needed to act swiftly and decisively. This app emerged from a real productivity challenge I witnessed firsthand. The science exhibition presented the perfect opportunity to showcase my vision and technical abilities.`
    },
    {
      title: "The Problem: Context Switching Kills Productivity",
      content: `I noticed everyone constantly switching between phone tabs for basic tasks—a massive productivity drain. This observation sparked an idea: Why not create a unified app that consolidates everyday tools into one seamless experience? Thus, "Productivity Toolkit" was born. This wasn't merely an app; it was my opportunity to demonstrate that meaningful solutions can come from observing everyday frustrations and acting on them decisively.`
    },
    {
      title: "Beta v1: The Foundation",
      content: `The initial beta version featured three core tools: a calculator, typing practice, and a to-do list. All data was stored locally using browser localStorage, prioritizing simplicity and privacy. This minimal viable product validated the concept and laid the groundwork for exponential growth.`
    },
    {
      title: "Scaling Up: The App Expansion Journey",
      content: `I built the platform using modern TypeScript-based libraries and Tailwind CSS for rapid, responsive design. The toolkit has expanded to include dozens of productivity apps. Flagship features include: Calculator, AI Chat Assistant, Typing Speed Test, Real-time Weather Dashboard, Notes App, Currency Converter, Voice Recorder, Link Shortener, Quote Generator, and an Islamic Studies app featuring Quran translation and Hadith in English. Every tool is AI-enhanced to ensure reliability and intelligent error handling.`
    },
    {
      title: "The AI Revolution: Integrating Gemini",
      content: `After the exhibition, inspiration struck—I could elevate this platform by integrating cutting-edge AI capabilities. I created an account with Google AI Studio to access free API keys for the Gemini Flash 2.5 model. The integration works seamlessly: JavaScript fetch requests connect to the AI service, with API keys securely stored in environment variables. This architecture enables intelligent features across the entire platform while maintaining security and performance.`
    },
    {
      title: "Going Full Stack: Backend & Global Deployment",
      content: `The platform evolved to include a robust backend infrastructure for persistent data storage and user progress tracking, complete with Google OAuth authentication. Throughout this journey, I leveraged various AI tools to accelerate development. The codebase lives on GitHub, enabling version control and collaborative potential. The web app is now deployed on a public domain with managed hosting, making these productivity tools accessible to users worldwide—completely free.`
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent animate-pulse" />
      </div>

      <Link to="/" className="fixed top-6 left-6 z-50">
        <Button variant="ghost" size="icon">
          <Home className="h-5 w-5" />
        </Button>
      </Link>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <Badge className="mb-4 px-4 py-1 bg-gradient-to-r from-accent to-primary text-white border-0">
              Origin Story
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent mb-4 animate-fade-in">
            Founder's Note
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Click anywhere on the card to journey through the creation story
          </p>
        </div>

        <div
          onClick={nextSlide}
          className="glass border-2 border-border/50 rounded-2xl p-8 md:p-12 cursor-pointer transition-all duration-500 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:scale-[1.02] group backdrop-blur-xl bg-card/50"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-fade-in">
                {slides[currentSlide].title}
              </h2>
              <span className="text-sm font-semibold text-accent/80 bg-accent/10 px-3 py-1 rounded-full">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
            
            <p className="text-base md:text-lg leading-relaxed text-foreground/90 font-normal tracking-wide">
              {slides[currentSlide].content}
            </p>

            <div className="flex items-center justify-between pt-6 border-t-2 border-accent/20">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "w-16 bg-gradient-to-r from-accent to-primary shadow-lg shadow-accent/50"
                        : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium group-hover:text-accent transition-all duration-300">
                <span className="hidden sm:inline">Click to continue</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center space-y-3 animate-fade-in">
          <p className="text-lg font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Built with passion, precision, and purpose
          </p>
          <p className="text-sm text-muted-foreground">
            — Saad Hassan, Founder & Developer
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderNote;
