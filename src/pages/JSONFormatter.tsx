import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Copy, Code } from "lucide-react";

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "JSON copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JSON Formatter
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Input JSON</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "John", "age": 30}'
                className="min-h-[200px] font-mono"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={formatJSON} className="flex-1">
                <Code className="mr-2 h-4 w-4" />
                Format (Pretty Print)
              </Button>
              <Button onClick={minifyJSON} variant="outline" className="flex-1">
                Minify
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-mono">{error}</p>
              </div>
            )}

            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Output</label>
                  <Button size="sm" variant="outline" onClick={copyOutput}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[300px] font-mono bg-muted"
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

export default JSONFormatter;
