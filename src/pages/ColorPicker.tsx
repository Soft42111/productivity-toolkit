import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColorPicker = () => {
  const [color, setColor] = useState("#3b82f6");
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${format} copied to clipboard.` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Color Picker
          </h1>

          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-32 h-32 rounded-lg cursor-pointer border-4 border-border"
              />
            </div>

            <div
              className="h-24 rounded-lg"
              style={{ backgroundColor: color }}
            />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-16 text-muted-foreground">HEX:</span>
                <Input value={color.toUpperCase()} readOnly className="flex-1 font-mono" />
                <Button size="icon" variant="outline" onClick={() => copyToClipboard(color.toUpperCase(), "HEX")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {rgb && (
                <div className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">RGB:</span>
                  <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="flex-1 font-mono" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {hsl && (
                <div className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">HSL:</span>
                  <Input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className="flex-1 font-mono" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ColorPicker;
