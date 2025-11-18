import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# Hello World\\n\\nStart typing your **markdown** here!");
  const { toast } = useToast();

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({ title: "Copied!", description: "Markdown copied to clipboard." });
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Markdown Editor
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editor</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyMarkdown}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadMarkdown}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[600px] font-mono resize-none"
              placeholder="Type your markdown here..."
            />
          </Card>

          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none min-h-[600px]">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarkdownEditor;
