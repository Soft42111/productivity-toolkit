import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do.",
  "In the world of technology, innovation drives progress and creativity fuels imagination. Every line of code is a step towards the future.",
  "Practice makes perfect, and typing speed improves with consistent effort. Keep pushing your limits and track your progress daily.",
  "Web development combines creativity with logic. Every website tells a story through design and functionality.",
  "Consistent practice leads to mastery. Small improvements compound over time to create remarkable results.",
];

const TypingPractice = () => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resetTest();
  }, []);

  const resetTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setInput("");
    setIsComplete(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value === text) {
      setIsComplete(true);
    }
  };

  const getCharClass = (index: number) => {
    if (index >= input.length) return "text-muted-foreground";
    return input[index] === text[index] ? "text-accent" : "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <div className="max-w-4xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
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
            <p className="text-lg leading-relaxed font-mono">
              {text.split("").map((char, index) => (
                <span key={index} className={getCharClass(index)}>
                  {char}
                </span>
              ))}
            </p>
          </Card>

          <div className="space-y-4">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="min-h-[150px] text-lg font-mono resize-none"
              disabled={isComplete}
            />

            {isComplete && (
              <Card className="p-6 bg-accent/10 border-accent">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Practice Complete! 🎉
                  </h2>
                  <p className="text-muted-foreground">
                    Great job! You've completed this practice session.
                  </p>
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
