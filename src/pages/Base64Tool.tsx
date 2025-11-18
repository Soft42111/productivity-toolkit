import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock } from "lucide-react";

const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (e) {
      toast({ title: "Error", description: "Failed to encode text", variant: "destructive" });
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
    } catch (e) {
      toast({ title: "Error", description: "Invalid Base64 string", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Base64 Encoder/Decoder
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode/decode"
                className="min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={encode} disabled={!input}>
                <Lock className="mr-2 h-4 w-4" />
                Encode
              </Button>
              <Button onClick={decode} variant="outline" disabled={!input}>
                <Unlock className="mr-2 h-4 w-4" />
                Decode
              </Button>
            </div>

            {output && (
              <div>
                <label className="block text-sm font-medium mb-2">Output</label>
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[150px] bg-muted"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Base64Tool;
