import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Book, BookOpen, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export default function IslamicStudies() {
  const [sunnahQuery, setSunnahQuery] = useState("");
  const [hadithQuery, setHadithQuery] = useState("");
  const [quranQuery, setQuranQuery] = useState("");
  
  const [sunnahResponse, setSunnahResponse] = useState("");
  const [hadithResponse, setHadithResponse] = useState("");
  const [quranResponse, setQuranResponse] = useState("");
  
  const [loadingSunnah, setLoadingSunnah] = useState(false);
  const [loadingHadith, setLoadingHadith] = useState(false);
  const [loadingQuran, setLoadingQuran] = useState(false);

  const searchSunnah = async () => {
    if (!sunnahQuery.trim()) {
      toast.error("Please enter a topic to search");
      return;
    }

    setLoadingSunnah(true);
    setSunnahResponse("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: "sunnah",
          query: sunnahQuery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search Sunnah");
      }

      const data = await response.json();
      setSunnahResponse(data.text);
    } catch (error) {
      console.error("Error searching Sunnah:", error);
      toast.error("Failed to search Sunnah");
    } finally {
      setLoadingSunnah(false);
    }
  };

  const searchHadith = async () => {
    if (!hadithQuery.trim()) {
      toast.error("Please enter a topic to search");
      return;
    }

    setLoadingHadith(true);
    setHadithResponse("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: "hadith",
          query: hadithQuery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search Hadith");
      }

      const data = await response.json();
      setHadithResponse(data.text);
    } catch (error) {
      console.error("Error searching Hadith:", error);
      toast.error("Failed to search Hadith");
    } finally {
      setLoadingHadith(false);
    }
  };

  const searchQuran = async () => {
    if (!quranQuery.trim()) {
      toast.error("Please enter a verse or topic to search");
      return;
    }

    setLoadingQuran(true);
    setQuranResponse("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: "quran",
          query: quranQuery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search Quran");
      }

      const data = await response.json();
      setQuranResponse(data.text);
    } catch (error) {
      console.error("Error searching Quran:", error);
      toast.error("Failed to search Quran");
    } finally {
      setLoadingQuran(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Islamic Studies</h1>
            <p className="text-muted-foreground">Explore Sunnah, Hadith, and Quran translations with references</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/islamic-reminders">
              <Button variant="outline">
                Prayer Reminders
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <Tabs defaultValue="sunnah" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sunnah" className="gap-2">
              <Book className="w-4 h-4" />
              Sunnah
            </TabsTrigger>
            <TabsTrigger value="hadith" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Hadith
            </TabsTrigger>
            <TabsTrigger value="quran" className="gap-2">
              <FileText className="w-4 h-4" />
              Quran
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sunnah">
            <Card>
              <CardHeader>
                <CardTitle>Sunnah of Prophet Muhammad (PBUH)</CardTitle>
                <CardDescription>
                  Search for Sunnah practices with authentic references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter a topic (e.g., prayer, charity, fasting)..."
                    value={sunnahQuery}
                    onChange={(e) => setSunnahQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={searchSunnah} 
                    disabled={loadingSunnah}
                    className="w-full"
                  >
                    {loadingSunnah ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search Sunnah"
                    )}
                  </Button>
                </div>

                {sunnahResponse && (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {sunnahResponse}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hadith">
            <Card>
              <CardHeader>
                <CardTitle>Hadith Translation</CardTitle>
                <CardDescription>
                  Search for Hadith with translations and references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter a topic or Hadith number (e.g., kindness, Bukhari 1)..."
                    value={hadithQuery}
                    onChange={(e) => setHadithQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={searchHadith} 
                    disabled={loadingHadith}
                    className="w-full"
                  >
                    {loadingHadith ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search Hadith"
                    )}
                  </Button>
                </div>

                {hadithResponse && (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {hadithResponse}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quran">
            <Card>
              <CardHeader>
                <CardTitle>Quran Translation</CardTitle>
                <CardDescription>
                  Search for Quran verses with translations and references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter a verse reference (e.g., Surah Al-Fatiha, 2:255) or topic..."
                    value={quranQuery}
                    onChange={(e) => setQuranQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={searchQuran} 
                    disabled={loadingQuran}
                    className="w-full"
                  >
                    {loadingQuran ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search Quran"
                    )}
                  </Button>
                </div>

                {quranResponse && (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {quranResponse}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}