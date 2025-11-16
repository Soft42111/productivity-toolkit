import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <div className="max-w-2xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <Card className="p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold text-foreground mb-8 text-center">
            Stopwatch
          </h1>

          <div className="text-center mb-8">
            <div className="text-7xl font-bold font-mono text-primary mb-8">
              {formatTime(time)}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleStartPause}
                size="lg"
                className="w-32 gap-2"
                variant={isRunning ? "outline" : "default"}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={handleLap}
                size="lg"
                variant="secondary"
                disabled={!isRunning}
                className="w-32 gap-2"
              >
                <Flag className="h-5 w-5" />
                Lap
              </Button>

              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="w-32 gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>

          {laps.length > 0 && (
            <Card className="p-4 bg-secondary max-h-64 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-foreground">Laps</h3>
              <div className="space-y-2">
                {laps.map((lap, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded bg-background"
                  >
                    <span className="text-muted-foreground">
                      Lap {laps.length - index}
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatTime(lap)}
                    </span>
                  </div>
                )).reverse()}
              </div>
            </Card>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Stopwatch;
