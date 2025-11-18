import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Shuffle, Dices, Coins } from "lucide-react";

const RandomGenerator = () => {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [coinResult, setCoinResult] = useState<string>("");

  const generateNumber = () => {
    const minNum = parseInt(min) || 1;
    const maxNum = parseInt(max) || 100;
    const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    setRandomNumber(random);
  };

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1;
    setDiceResult(result);
  };

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    setCoinResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Random Generators
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <Shuffle className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold">Random Number</h2>
              <div className="flex gap-2 w-full">
                <Input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Min"
                  className="w-20"
                />
                <span className="flex items-center">-</span>
                <Input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Max"
                  className="w-20"
                />
              </div>
              {randomNumber !== null && (
                <div className="text-5xl font-bold text-primary">
                  {randomNumber}
                </div>
              )}
              <Button onClick={generateNumber} className="w-full">
                Generate
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <Dices className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold">Roll Dice</h2>
              {diceResult && (
                <div className="text-5xl font-bold text-primary">
                  {diceResult}
                </div>
              )}
              <Button onClick={rollDice} className="w-full mt-auto">
                Roll
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <Coins className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold">Flip Coin</h2>
              {coinResult && (
                <div className="text-3xl font-bold text-primary">
                  {coinResult}
                </div>
              )}
              <Button onClick={flipCoin} className="w-full mt-auto">
                Flip
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RandomGenerator;
