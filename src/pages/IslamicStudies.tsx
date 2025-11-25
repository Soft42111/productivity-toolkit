import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Book, BookOpen, FileText, Shuffle } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IslamicStudies() {
  const [sunnahResponse, setSunnahResponse] = useState("");
  const [hadithResponse, setHadithResponse] = useState("");
  const [quranResponse, setQuranResponse] = useState("");
  
  const [loadingSunnah, setLoadingSunnah] = useState(false);
  const [loadingHadith, setLoadingHadith] = useState(false);
  const [loadingQuran, setLoadingQuran] = useState(false);

  const sunnahTopics = [
    "kindness and compassion",
    "prayer and worship",
    "charity and helping others",
    "patience and perseverance",
    "honesty and truthfulness",
    "family relations",
    "seeking knowledge",
    "good manners",
    "remembrance of Allah",
    "justice and fairness"
  ];

  const hadithTopics = [
    "faith and belief",
    "the importance of prayer",
    "excellence in character",
    "seeking knowledge",
    "being good to parents",
    "charity",
    "patience in hardship",
    "truthfulness",
    "brotherhood in Islam",
    "fasting"
  ];

  const quranTopics = [
    "mercy of Allah",
    "patience and gratitude",
    "guidance and wisdom",
    "the importance of prayer",
    "charity and helping others",
    "justice",
    "knowledge",
    "faith and trust in Allah",
    "family and relationships",
    "forgiveness"
  ];

  const getRandomTopic = (topics: string[]) => {
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const fetchIslamicContent = async (type: "sunnah" | "hadith" | "quran") => {
    let query = "";
    let setLoading: (loading: boolean) => void;
    let setResponse: (response: string) => void;

    if (type === "sunnah") {
      query = getRandomTopic(sunnahTopics);
      setLoading = setLoadingSunnah;
      setResponse = setSunnahResponse;
    } else if (type === "hadith") {
      query = getRandomTopic(hadithTopics);
      setLoading = setLoadingHadith;
      setResponse = setHadithResponse;
    } else {
      query = getRandomTopic(quranTopics);
      setLoading = setLoadingQuran;
      setResponse = setQuranResponse;
    }

    setLoading(true);
    setResponse("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/islamic-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: type,
          query: `Give me exactly ONE ${type} about ${query}. Format the response with bold text for the main title/reference. Keep it concise - just one ${type} with its reference.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }

      const data = await response.json();
      
      // Format the response to make references bold
      let formattedText = data.text;
      
      // Make references bold (patterns like "Sahih Bukhari", "Surah", etc.)
      formattedText = formattedText.replace(/(Sahih\s+(?:Bukhari|Muslim|Abu\s+Dawud|Tirmidhi|An-Nasa'i|Ibn\s+Majah)[^,\n]*)/gi, "**$1**");
      formattedText = formattedText.replace(/(Surah\s+[A-Za-z-]+(?:\s+\([^)]+\))?[^,\n]*)/gi, "**$1**");
      formattedText = formattedText.replace(/(Book\s+\d+[^,\n]*)/gi, "**$1**");
      formattedText = formattedText.replace(/(Hadith\s+\d+[^,\n]*)/gi, "**$1**");
      formattedText = formattedText.replace(/(Verse\s+\d+[^,\n]*)/gi, "**$1**");
      formattedText = formattedText.replace(/(\d+:\d+(?:-\d+)?)/g, "**$1**");
      
      setResponse(formattedText);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(`Failed to fetch ${type}`);
      setResponse(`Error loading ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Split by bold markers and render
    const parts = text.split(/\*\*(.+?)\*\*/g);
    
    return (
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
        {parts.map((part, index) => {
          // Even indices are normal text, odd indices are bold
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-foreground bg-muted px-1 py-0.5 rounded">{part}</strong>;
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <HomeButton />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Islamic Studies</h1>
            <p className="text-muted-foreground">Discover random Sunnah, Hadith, and Quran verses with references</p>
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
                  Click the button to discover a random Sunnah practice with authentic references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => fetchIslamicContent("sunnah")} 
                  disabled={loadingSunnah}
                  className="w-full"
                  size="lg"
                >
                  {loadingSunnah ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-5 w-5" />
                      Get Random Sunnah
                    </>
                  )}
                </Button>

                {sunnahResponse && (
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    {renderFormattedText(sunnahResponse)}
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
                  Click the button to discover a random Hadith with translation and references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => fetchIslamicContent("hadith")} 
                  disabled={loadingHadith}
                  className="w-full"
                  size="lg"
                >
                  {loadingHadith ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-5 w-5" />
                      Get Random Hadith
                    </>
                  )}
                </Button>

                {hadithResponse && (
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    {renderFormattedText(hadithResponse)}
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
                  Click the button to discover a random Quran verse with translation and references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => fetchIslamicContent("quran")} 
                  disabled={loadingQuran}
                  className="w-full"
                  size="lg"
                >
                  {loadingQuran ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-5 w-5" />
                      Get Random Quran Verse
                    </>
                  )}
                </Button>

                {quranResponse && (
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    {renderFormattedText(quranResponse)}
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