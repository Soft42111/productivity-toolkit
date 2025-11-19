import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Quote, RefreshCw, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Quote {
  text: string;
  author: string;
}

const QuoteGenerator = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [usedQuotes, setUsedQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    generateQuote();
  }, []);

  const generateQuote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          prompt: `Generate one random inspiring quote from a famous person. The quote should be unique and not one of these: ${usedQuotes.slice(-5).join(", ") || "none yet"}. 
          
          Format your response EXACTLY as JSON with no additional text:
          {"text": "the quote here", "author": "author name"}`,
          history: []
        },
      });

      if (error) throw error;

      try {
        // Extract JSON from the response
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid response format");
        
        const quote = JSON.parse(jsonMatch[0]) as Quote;
        setCurrentQuote(quote);
        
        // Add to used quotes to avoid repetition
        if (!usedQuotes.includes(quote.text)) {
          setUsedQuotes([...usedQuotes, quote.text]);
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        toast({
          title: "Error",
          description: "Failed to parse quote. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error generating quote:", error);
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = () => {
    if (!currentQuote) return;
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
              AI Quote Generator
            </h1>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="p-8 bg-muted rounded-lg min-h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating a unique quote...</p>
                </div>
              </div>
            ) : currentQuote ? (
              <div className="p-8 bg-muted rounded-lg min-h-[200px] flex flex-col justify-center">
                <Quote className="h-12 w-12 text-primary/30 mb-4" />
                <p className="text-2xl font-serif mb-4 leading-relaxed">
                  {currentQuote.text}
                </p>
                <p className="text-lg text-muted-foreground font-semibold">
                  — {currentQuote.author}
                </p>
              </div>
            ) : null}

            <div className="flex gap-4">
              <Button onClick={generateQuote} disabled={loading} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "New Quote"}
              </Button>
              {currentQuote && (
                <Button onClick={copyQuote} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Quote
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              <p>✨ Powered by AI - Each quote is uniquely generated and non-repeating!</p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default QuoteGenerator;
