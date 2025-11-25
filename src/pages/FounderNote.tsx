import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const FounderNote = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Science Exhibition Plan & Approach",
      content: `My name is Saad Hassan. I worked as a digital marketer doing community management. I always saw problems which required immediate attention; most of them were being solved, but a few were there as "I'm fine." I thought if they can't solve it, then I should be fast and quick to do it. This app was one of the real-life issues I saw which was stalling productivity. On the special occasion of the science exhibition, I got the chance to showcase my skills.`
    },
    {
      title: "Project's Main Reason",
      content: `I saw that everybody was too busy working on their phone and changing tabs for basic tasks. So, I got an idea: why don't we use an app which can perform day-to-day tasks? So, I made "Productivity Toolkit" (get-productive-vercel-app). This was not just an app but a chance to prove myself.`
    },
    {
      title: "Project Beta v1",
      content: `In the beta version, it only had a calculator, typing practice, and to-do list. Everything was stored locally on localStorage().`
    },
    {
      title: "My Journey of Adding Apps",
      content: `I used technologies mainly consisting of TS-based libraries and CSS frameworks like Tailwind. I generated a dozen apps; the best apps are: Calculator, Talk with AI, Typing Test, Weather Dashboard, Notes App, Currency Converter, Voice Recorder, Link Shortener, Quote Generator, and an app which translates Quran Ayah and Hadith in English. All apps powered by AI to ensure problems don't occur.`
    },
    {
      title: "Integrating Gemini",
      content: `After attending the exhibition, I got an idea which ignited me that I can integrate AI into this app. I made a lot of apps with it and regulated AI to help new users. I created an account on aistudio.google which allowed me to get free API keys allowing me to use the gemini-flash-2.5 model for my project. This basically works when we send a fetch() request through JavaScript and we put the API key in the .env file.`
    },
    {
      title: "Adding Backend & Hosting",
      content: `Adding backend to store progress and store all data and adding a sign-up with Google API. In all this journey, I took help from different AIs. I stored my app code on GitHub and made changes from there. I hosted the web-app on a public free domain and a free managed hosting.`
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Founder's Note
          </h1>
          <p className="text-muted-foreground text-lg">
            Click the content to progress through my journey
          </p>
        </div>

        <div
          onClick={nextSlide}
          className="glass border border-border/50 rounded-2xl p-8 md:p-12 cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-xl group"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-accent to-primary">
                {slides[currentSlide].title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
            
            <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
              {slides[currentSlide].content}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-12 bg-accent"
                        : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm group-hover:text-accent transition-colors">
                <span>Click to continue</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Built with passion by Saad Hassan
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderNote;
