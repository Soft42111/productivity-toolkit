import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const GradientGenerator = () => {
  const { toast } = useToast();
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#8b5cf6");
  const [angle, setAngle] = useState(135);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  const cssCode = `background: ${gradient};`;

  const randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };

  const randomizeGradient = () => {
    setColor1(randomColor());
    setColor2(randomColor());
    setAngle(Math.floor(Math.random() * 360));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    toast({
      title: "Copied!",
      description: "CSS code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Gradient Generator
          </h1>
          <p className="text-muted-foreground">Create beautiful CSS gradients</p>
        </div>

        <Card className="p-6 max-w-2xl mx-auto">
          <div
            className="w-full h-64 rounded-lg mb-6 shadow-lg"
            style={{ background: gradient }}
          />

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color1">Color 1</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="color1"
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="color2">Color 2</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="color2"
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="angle">Angle: {angle}°</Label>
              <input
                id="angle"
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <code className="text-sm">{cssCode}</code>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyToClipboard} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy CSS
            </Button>
            <Button onClick={randomizeGradient} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default GradientGenerator;
