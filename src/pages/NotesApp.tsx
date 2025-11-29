import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import AuthPrompt from "@/components/AuthPrompt";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, FileText } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

const NotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    if (!title.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      created_at: new Date().toISOString(),
      user_id: "local"
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    toast({ title: "Note created", description: "Your note has been saved." });
  };

  const updateNote = () => {
    if (!selectedNote) return;

    setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, title, content } : n));
    toast({ title: "Note updated", description: "Your changes have been saved." });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle("");
      setContent("");
    }
    toast({ title: "Note deleted", description: "Your note has been removed." });
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const newNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <AuthPrompt appName="Notes" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Notes
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-4 md:col-span-1 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Notes</h2>
              <Button size="sm" onClick={newNote}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
            <div className="space-y-2">
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${
                    selectedNote?.id === note.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{note.title}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:col-span-2 shadow-lg">
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="text-lg font-semibold"
              />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="min-h-[400px] resize-none"
              />
              <Button
                onClick={selectedNote ? updateNote : createNote}
                disabled={!title.trim()}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {selectedNote ? "Update Note" : "Create Note"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotesApp;
