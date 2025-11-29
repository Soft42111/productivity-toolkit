import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Copy, Trash2, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import AuthPrompt from "@/components/AuthPrompt";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
}

const CodeSnippetManager = () => {
  const { toast } = useToast();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("codeSnippets");
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("codeSnippets", JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = () => {
    if (!title.trim() || !code.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and code",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      setSnippets(snippets.map(s => 
        s.id === editingId ? { ...s, title, code, language } : s
      ));
      setEditingId(null);
      toast({ title: "Updated!", description: "Snippet updated successfully" });
    } else {
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        title,
        code,
        language,
      };
      setSnippets([newSnippet, ...snippets]);
      toast({ title: "Added!", description: "Snippet saved successfully" });
    }

    setTitle("");
    setCode("");
    setLanguage("javascript");
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    toast({ title: "Deleted!", description: "Snippet removed" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  const editSnippet = (snippet: Snippet) => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setEditingId(snippet.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AuthPrompt appName="Code Snippets" />
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Code Snippet Manager
          </h1>
          <p className="text-muted-foreground">Save and organize your code snippets</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {editingId ? "Edit Snippet" : "Add New Snippet"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Array sorting function"
                />
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>

              <Button onClick={addSnippet} className="w-full">
                {editingId ? "Update Snippet" : "Save Snippet"}
              </Button>
              {editingId && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setCode("");
                    setLanguage("javascript");
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Your Snippets ({snippets.length})
            </h2>
            {snippets.length === 0 ? (
              <Card className="p-8 text-center">
                <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No snippets yet. Add your first one!</p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {snippets.map((snippet) => (
                  <Card key={snippet.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{snippet.title}</h3>
                        <span className="text-xs text-muted-foreground bg-accent/20 px-2 py-1 rounded">
                          {snippet.language}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editSnippet(snippet)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(snippet.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSnippet(snippet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CodeSnippetManager;
