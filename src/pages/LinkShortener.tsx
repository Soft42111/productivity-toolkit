import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy, ExternalLink } from "lucide-react";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const LinkShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      toast({ title: "Enter a URL", variant: "destructive" });
      return;
    }

    // Validate URL
    try {
      new URL(longUrl);
    } catch {
      toast({ title: "Invalid URL format", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Using TinyURL API
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      const data = await response.text();
      setShortUrl(data);
      toast({ title: "URL shortened successfully!" });
    } catch (error) {
      toast({ title: "Failed to shorten URL", variant: "destructive" });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10 p-6">
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Link2 className="w-8 h-8 text-primary" />
              Link Shortener
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Long URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-url..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && shortenUrl()}
                  className="text-lg"
                />
              </div>

              <Button onClick={shortenUrl} disabled={loading} className="w-full" size="lg">
                {loading ? "Shortening..." : "Shorten URL"}
              </Button>
            </div>

            {shortUrl && (
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 animate-fade-in">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Short URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={shortUrl}
                        readOnly
                        className="text-lg font-mono"
                      />
                      <Button onClick={copyToClipboard} size="icon">
                        <Copy className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => window.open(shortUrl, "_blank")}
                        size="icon"
                        variant="outline"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkShortener;
