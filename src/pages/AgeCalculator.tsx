import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState<{years: number, months: number, days: number} | null>(null);

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    setAge({ years, months, days });
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
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Age Calculator
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <Button onClick={calculateAge} className="w-full" disabled={!birthDate}>
              Calculate Age
            </Button>

            {age && (
              <div className="p-6 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-4xl font-bold text-primary">{age.years}</p>
                    <p className="text-sm text-muted-foreground">Years</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary">{age.months}</p>
                    <p className="text-sm text-muted-foreground">Months</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary">{age.days}</p>
                    <p className="text-sm text-muted-foreground">Days</p>
                  </div>
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

export default AgeCalculator;
