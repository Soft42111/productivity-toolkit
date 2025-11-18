import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (!isBreak) {
              setIsBreak(true);
              setMinutes(5);
            } else {
              setIsBreak(false);
              setMinutes(25);
            }
            new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ8PXqvl7Z1VGw==').play();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const startBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setMinutes(5);
    setSeconds(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-8 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pomodoro Timer
          </h1>

          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isBreak ? "Break Time" : "Focus Time"}
              </p>
              <div className="text-8xl font-bold tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" onClick={toggle}>
                {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button size="lg" variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
              {!isBreak && (
                <Button size="lg" variant="outline" onClick={startBreak}>
                  <Coffee className="mr-2 h-5 w-5" />
                  Break
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground max-w-md">
              <p>The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks.</p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PomodoroTimer;
