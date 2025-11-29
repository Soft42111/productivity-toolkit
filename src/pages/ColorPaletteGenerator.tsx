import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, RefreshCw, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const ColorPaletteGenerator = () => {
  const { toast } = useToast();
  const [palette, setPalette] = useState<string[]>([]);

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };

  const generatePalette = () => {
    const newPalette = Array.from({ length: 5 }, () => generateRandomColor());
    setPalette(newPalette);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`,
    });
  };

  const copyAllColors = () => {
    navigator.clipboard.writeText(palette.join(", "));
    toast({
      title: "Copied!",
      description: "All colors copied to clipboard",
    });
  };

  // Generate initial palette
  useState(() => {
    generatePalette();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Color Palette Generator
          </h1>
          <p className="text-muted-foreground">Generate harmonious color schemes</p>
        </div>

        <Card className="p-6 max-w-4xl mx-auto">
          <div className="flex gap-4 mb-6">
            <Button onClick={generatePalette} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Palette
            </Button>
            <Button onClick={copyAllColors} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {palette.map((color, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => copyColor(color)}
              >
                <div
                  className="h-40 w-full"
                  style={{ backgroundColor: color }}
                />
                <div className="p-4 text-center">
                  <p className="font-mono text-sm font-medium">{color}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-primary" />
              <span className="font-medium">Pro Tip:</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Click on any color card to copy its hex code. Use these colors in your designs, websites, or any creative projects!
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ColorPaletteGenerator;
