import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Quote, RefreshCw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "May you live every day of your life.", author: "Jonathan Swift" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" }
];

const QuoteGenerator = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const { toast } = useToast();

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`);
    toast({ title: "Copied!", description: "Quote copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-8 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Quote className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quote Generator
            </h1>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-muted rounded-lg min-h-[200px] flex flex-col justify-center">
              <Quote className="h-12 w-12 text-primary/30 mb-4" />
              <p className="text-2xl font-serif mb-4 leading-relaxed">
                {currentQuote.text}
              </p>
              <p className="text-lg text-muted-foreground font-semibold">
                — {currentQuote.author}
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={generateQuote} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                New Quote
              </Button>
              <Button onClick={copyQuote} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy Quote
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default QuoteGenerator;
