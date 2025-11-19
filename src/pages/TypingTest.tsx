import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

// fallback list for local generation
const fallbackWords = [
  "time","person","year","way","day","thing","man","world","life","hand",
  "part","child","eye","woman","place","work","week","case","point","government",
  "company","number","group","problem","fact","home","water","room","mother","area",
  "money","story","service","team","phone","idea","computer","language","power","mind",
  "book","night","school","state","family","example","study","system","program","question",
];

const TypingTest = () => {
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [correctWords, setCorrectWords] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isComplete]);

  const resetTest = () => {
    setWords([]);
    setTypedWords([]);
    setCurrentInput("");
    setCorrectWords([]);
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
    inputRef.current?.focus();
    // fetch initial batch
    fetchWordsBatch(20).then(batch => setWords(batch));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComplete) return;

    if (!startTime) setStartTime(Date.now());

    if (e.key === 'Backspace') {
      // allow editing current input
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!currentInput) return;

      const idx = typedWords.length;
      const target = words[idx] || '';
      const isCorrect = currentInput.trim() === target;
      setCorrectWords(prev => [...prev, isCorrect]);
      setTypedWords(prev => [...prev, currentInput.trim()]);
      if (!isCorrect) setErrors(prev => prev + 1);
      setCurrentInput('');

      // fetch more when approaching end (after 15 typed)
      if (typedWords.length + 1 >= 15 && words.length - (typedWords.length + 1) <= 5) {
        fetchWordsBatch(20).then(batch => setWords(prev => [...prev, ...batch]));
      }

      if (typedWords.length + 1 >= words.length) setIsComplete(true);
    }
  };

  const fetchWordsBatch = async (count: number): Promise<string[]> => {
    try {
      const prompt = `Provide exactly ${count} single English words as a JSON array. Return only valid JSON array, no extra commentary.`;
      const { data, error } = await (supabase as any).functions.invoke('gemini-chat', { body: { prompt, history: [] } });
      if (!error && data?.text) {
        const jsonMatch = data.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) return parsed.map((w: any) => String(w));
        }
      }
    } catch (err) {
      console.warn('AI fetch failed, falling back to local words', err);
    }
    const out: string[] = [];
    for (let i = 0; i < count; i++) out.push(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
    return out;
  };

  const calculateStats = () => {
    const timeInMinutes = Math.max(elapsedTime / 60, 1/60); // avoid div by zero
    const correctCount = correctWords.filter(Boolean).length;
    const wpm = Math.round(correctCount / timeInMinutes) || 0;
    const charsTyped = typedWords.join(' ').length;
    const cpm = Math.round(charsTyped / timeInMinutes) || 0;
    const accuracy = typedWords.length ? Math.round((correctCount / typedWords.length) * 100) : 100;
    return { wpm, cpm, accuracy };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 animate-fade-in flex flex-col">
      <div className="max-w-5xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <Card className="p-8 shadow-[var(--shadow-soft)] bg-card/95 backdrop-blur-sm border-2 border-primary/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Typing Speed Test
            </h1>
            <Button variant="outline" size="icon" onClick={resetTest} className="border-primary/30">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!isComplete && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-4 bg-primary/10 border-primary/30">
                <div className="text-sm text-muted-foreground mb-1">Time</div>
                <div className="text-3xl font-bold text-primary">{elapsedTime.toFixed(1)}s</div>
              </Card>
              <Card className="p-4 bg-accent/10 border-accent/30">
                <div className="text-sm text-muted-foreground mb-1">WPM</div>
                <div className="text-3xl font-bold text-accent">{stats.wpm}</div>
              </Card>
              <Card className="p-4 bg-secondary">
                <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-foreground">{stats.accuracy}%</div>
              </Card>
            </div>
          )}

          <Card className="p-8 bg-secondary/50 mb-6 border-2 border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="text-2xl leading-relaxed font-mono tracking-wide relative z-10">
              <div className="flex flex-wrap gap-2">
                {words.map((w, i) => {
                  const typed = typedWords[i];
                  const isCurrent = i === typedWords.length;
                  const className = typed
                    ? typed === w
                      ? 'text-accent'
                      : 'text-destructive'
                    : isCurrent
                      ? 'underline text-foreground'
                      : 'text-muted-foreground/60';

                  return (
                    <span key={i} className={`px-1 ${className}`}>
                      {w}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isComplete ? "Test completed!" : "Type the current word and press space..."}
                className="w-full px-6 py-4 text-lg font-mono rounded-lg border-2 border-primary/30 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                disabled={isComplete}
                autoComplete="off"
                spellCheck="false"
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => {
                  // manual commit
                  const syntheticEvent: any = { key: ' ' };
                  handleKeyDown(syntheticEvent as any);
                }} disabled={!currentInput}>Next</Button>
                <Button variant="outline" onClick={resetTest}>Reset</Button>
              </div>
            </div>

            {isComplete && (
              <Card className="p-8 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Test Complete! 🎉
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-2">WPM</div>
                      <div className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]">
                        {stats.wpm}
                      </div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                      <div className="text-sm text-muted-foreground mb-2">CPM</div>
                      <div className="text-3xl font-bold text-accent drop-shadow-[0_0_10px_hsl(var(--accent)/0.5)]">
                        {stats.cpm}
                      </div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-2">Accuracy</div>
                      <div className="text-3xl font-bold text-foreground">{stats.accuracy}%</div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-destructive/20">
                      <div className="text-sm text-muted-foreground mb-2">Errors</div>
                      <div className="text-3xl font-bold text-destructive">{errors}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-background/30 rounded-lg border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Time Taken</div>
                    <div className="text-2xl font-bold text-foreground">{elapsedTime.toFixed(2)}s</div>
                  </div>

                  <Button 
                    onClick={resetTest} 
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-lg px-8 py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Restart Test
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

export default TypingTest;
