import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog and runs through the meadow with great speed and agility",
  "Programming is the art of telling another human what one wants the computer to do in a clear way",
  "Innovation drives progress and creativity fuels imagination in the ever evolving world of technology",
  "Practice makes perfect and typing speed improves with consistent effort and dedication over time",
  "Web development combines creativity with logic to build amazing experiences for users worldwide",
];

const TypingTest = () => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState<boolean[]>([]);
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
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setInput("");
    setCurrentIndex(0);
    setCorrectChars([]);
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComplete) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        const newCorrectChars = [...correctChars];
        newCorrectChars.pop();
        setCorrectChars(newCorrectChars);
        setCurrentIndex(currentIndex - 1);
        setInput(input.slice(0, -1));
      }
      return;
    }

    if (e.key.length === 1) {
      const isCorrect = e.key === text[currentIndex];
      const newCorrectChars = [...correctChars, isCorrect];
      setCorrectChars(newCorrectChars);
      setInput(input + e.key);
      setCurrentIndex(currentIndex + 1);

      if (!isCorrect) {
        setErrors(errors + 1);
      }

      if (currentIndex + 1 === text.length) {
        setIsComplete(true);
      }
    }
  };

  const calculateStats = () => {
    const timeInMinutes = elapsedTime / 60;
    const wpm = Math.round((input.length / 5) / timeInMinutes) || 0;
    const cpm = Math.round(input.length / timeInMinutes) || 0;
    const accuracy = Math.round((correctChars.filter(Boolean).length / correctChars.length) * 100) || 100;
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
            <p className="text-2xl leading-relaxed font-mono tracking-wide relative z-10">
              {text.split("").map((char, index) => {
                let className = "transition-all duration-200 ";
                
                if (index < currentIndex) {
                  className += correctChars[index]
                    ? "text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]"
                    : "text-destructive drop-shadow-[0_0_8px_hsl(var(--destructive)/0.5)]";
                } else if (index === currentIndex) {
                  className += "text-foreground animate-pulse border-b-4 border-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.8)]";
                } else {
                  className += "text-muted-foreground/60";
                }

                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                );
              })}
            </p>
          </Card>

          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onKeyDown={handleKeyDown}
              placeholder={isComplete ? "Test completed!" : "Start typing..."}
              className="w-full px-6 py-4 text-lg font-mono rounded-lg border-2 border-primary/30 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              disabled={isComplete}
              autoComplete="off"
              spellCheck="false"
            />

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
