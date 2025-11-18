import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Activity } from "lucide-react";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    
    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(1)));
      
      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal weight");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BMI Calculator
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>

            <Button onClick={calculateBMI} className="w-full" disabled={!weight || !height}>
              Calculate BMI
            </Button>

            {bmi !== null && (
              <div className="p-6 bg-muted rounded-lg text-center space-y-2">
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <p className="text-5xl font-bold text-primary">{bmi}</p>
                <p className="text-lg font-semibold">{category}</p>
                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <p>Underweight: BMI &lt; 18.5</p>
                  <p>Normal: 18.5 ≤ BMI &lt; 25</p>
                  <p>Overweight: 25 ≤ BMI &lt; 30</p>
                  <p>Obese: BMI ≥ 30</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BMICalculator;
