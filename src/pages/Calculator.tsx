import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumber(e.key);
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        const op = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key;
        handleOperation(op);
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        handleClear();
      } else if (e.key === ".") {
        handleDecimal();
      } else if (e.key === "Backspace") {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay("0");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, newNumber]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const result = calculate();
      setDisplay(result);
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = () => {
    const prev = parseFloat(previousValue || "0");
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
      case "^":
        result = Math.pow(prev, current);
        break;
      case "√":
        result = Math.sqrt(current);
        return result.toString();
      default:
        return display;
    }

    return result.toString();
  };

  const handleScientific = (func: string) => {
    const current = parseFloat(display);
    let result = 0;

    switch (func) {
      case "sin":
        result = Math.sin((current * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((current * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((current * Math.PI) / 180);
        break;
      case "√":
        result = Math.sqrt(current);
        break;
      case "x²":
        result = current * current;
        break;
      case "x³":
        result = current * current * current;
        break;
      case "1/x":
        result = 1 / current;
        break;
      case "log":
        result = Math.log10(current);
        break;
      case "ln":
        result = Math.log(current);
        break;
      case "π":
        setDisplay(Math.PI.toString());
        setNewNumber(true);
        return;
      case "e":
        setDisplay(Math.E.toString());
        setNewNumber(true);
        return;
      default:
        return;
    }

    setDisplay(result.toString());
    setNewNumber(true);
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate();
      setDisplay(result);
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setNewNumber(false);
    }
  };

  const scientificButtons = [
    ["sin", "cos", "tan", "√"],
    ["x²", "x³", "^", "1/x"],
    ["log", "ln", "π", "e"],
  ];

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <div className="max-w-md mx-auto flex-1">
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
          <h1 className="text-2xl font-bold text-foreground mb-6">Scientific Calculator</h1>
          <p className="text-sm text-muted-foreground mb-4">Use your keyboard for quick input!</p>

          <div className="bg-secondary rounded-lg p-6 mb-6">
            <div className="text-right">
              {previousValue && operation && (
                <div className="text-sm text-muted-foreground mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-4xl font-bold text-foreground break-all">
                {display}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Scientific Functions</h3>
            <div className="grid gap-2">
              {scientificButtons.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {row.map((btn) => (
                    <Button
                      key={btn}
                      variant="outline"
                      className="h-12 text-sm font-semibold transition-all hover:scale-105 border-primary/30"
                      onClick={() => {
                        if (btn === "^") {
                          handleOperation(btn);
                        } else {
                          handleScientific(btn);
                        }
                      }}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 mb-4">
            {buttons.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-3">
                {row.map((btn) => (
                  <Button
                    key={btn}
                    variant={["+", "-", "×", "÷", "="].includes(btn) ? "default" : "secondary"}
                    className="h-16 text-xl font-semibold transition-all hover:scale-105"
                    onClick={() => {
                      if (btn === "=") handleEquals();
                      else if (["+", "-", "×", "÷"].includes(btn)) handleOperation(btn);
                      else if (btn === ".") handleDecimal();
                      else handleNumber(btn);
                    }}
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Calculator;
