import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || !targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsActive(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, targetDate]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setTargetDate("");
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
            <Clock className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Countdown Timer
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="target">Target Date & Time</Label>
              <Input
                id="target"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 p-6 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</p>
                <p className="text-sm text-muted-foreground mt-2">Days</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</p>
                <p className="text-sm text-muted-foreground mt-2">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</p>
                <p className="text-sm text-muted-foreground mt-2">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</p>
                <p className="text-sm text-muted-foreground mt-2">Seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={isActive ? pause : start} disabled={!targetDate} className="flex-1">
                {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default CountdownTimer;
