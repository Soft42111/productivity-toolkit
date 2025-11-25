import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";

// local fallback word list in case AI generation isn't available
const fallbackWords = [
  "time","person","year","way","day","thing","man","world","life","hand",
  "part","child","eye","woman","place","work","week","case","point","government",
  "company","number","group","problem","fact","home","water","room","mother","area",
  "money","story","service","team","phone","idea","computer","language","power","mind",
  "book","night","school","state","family","example","study","system","program","question",
];

const TypingPractice = () => {
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resetTest();
  }, []);

  const resetTest = () => {
    setWords([]);
    setTypedWords([]);
    setCurrentWordInput("");
    setIsComplete(false);
    inputRef.current?.focus();
    // fetch initial batch
    fetchWordsBatch(20).then(batch => setWords(batch));
  };

  const fetchWordsBatch = async (count: number) : Promise<string[]> => {
    // try AI via Supabase function, otherwise fallback locally
    try {
      const prompt = `Provide exactly ${count} single English words as a JSON array. Return only valid JSON array, no extra commentary. Example: ["apple","orange",... ]`;
      const { data, error } = await (supabase as any).functions.invoke("gemini-chat", {
        body: { prompt, history: [] },
      });

      if (!error && data?.text) {
        const jsonMatch = data.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) return parsed.map((w: any) => String(w));
        }
      }
    } catch (err) {
      console.warn("AI fetch failed, falling back to local words", err);
    }

    // fallback: random sample from local list
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      out.push(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
    }
    return out;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setCurrentWordInput(value);
  };

  const commitWord = async () => {
    if (!currentWordInput) return;
    const nextTyped = [...typedWords, currentWordInput];
    setTypedWords(nextTyped);
    setCurrentWordInput("");

    // when 15 words have been typed (relative to current pool), fetch 20 more and append
    if (nextTyped.length >= 15 && words.length - nextTyped.length <= 5) {
      const batch = await fetchWordsBatch(20);
      setWords(prev => [...prev, ...batch]);
    }

    // mark complete if we've typed all available words (rare since we append)
    if (nextTyped.length >= words.length) setIsComplete(true);
  };

  // no-op: character-level styling removed in favor of word-based practice

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <HomeButton />
      <div className="max-w-4xl mx-auto flex-1">
        <div className="flex justify-end items-center mb-6">
          <ThemeToggle />
        </div>

        <Card className="p-6 shadow-[var(--shadow-soft)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Typing Practice</h1>
            <Button variant="outline" size="icon" onClick={resetTest}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Card className="p-6 bg-secondary mb-4">
            <div className="flex flex-wrap gap-2 text-lg font-mono">
              {words.map((w, i) => {
                const typed = typedWords[i];
                const isCurrent = i === typedWords.length;
                const className = typed
                  ? typed === w
                    ? 'text-accent'
                    : 'text-destructive'
                  : isCurrent
                    ? 'underline text-foreground'
                    : 'text-muted-foreground';

                return (
                  <span key={i} className={`px-1 ${className}`}>
                    {w}
                  </span>
                );
              })}
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <Textarea
                ref={inputRef}
                value={currentWordInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    commitWord();
                  }
                }}
                placeholder="Type the highlighted word and press space..."
                className="min-h-[80px] text-lg font-mono resize-none"
                disabled={isComplete}
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={commitWord} disabled={!currentWordInput}>Next Word</Button>
                <Button variant="outline" onClick={resetTest}>Reset</Button>
              </div>
            </div>

            {isComplete && (
              <Card className="p-6 bg-accent/10 border-accent">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Practice Complete! 🎉</h2>
                  <p className="text-muted-foreground">Great job! You've completed this practice session.</p>
                  <Button onClick={resetTest} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try Another
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TypingPractice;
