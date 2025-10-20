import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Link, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const LinkShortener = () => {
  useToolTracking("Link Shortener");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ long: string; short: string; date: string }[]>([]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(longUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Using TinyURL API (free, no API key needed)
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      
      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }
      
      const shortened = await response.text();
      setShortUrl(shortened);
      
      // Add to history
      const newEntry = {
        long: longUrl,
        short: shortened,
        date: new Date().toLocaleString()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      
      toast({
        title: "Success!",
        description: "URL shortened successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Link Shortener</CardTitle>
              <CardDescription>Shorten long URLs into compact, shareable links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Long URL</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/very/long/url/that/needs/shortening"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a valid URL starting with http:// or https://
                  </p>
                </div>

                <Button 
                  className="w-full bg-gradient-primary border-0" 
                  onClick={shortenUrl}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Shorten URL
                    </>
                  )}
                </Button>
              </div>

              {shortUrl && (
                <div className="bg-gradient-primary p-6 rounded-lg text-white animate-fade-in">
                  <div className="text-sm opacity-90 mb-2">Your shortened URL</div>
                  <div className="bg-white/10 p-4 rounded-md mb-4">
                    <a 
                      href={shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xl font-mono break-all hover:underline"
                    >
                      {shortUrl}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => copyToClipboard(shortUrl)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => openUrl(shortUrl)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Recent Links</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map((item, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                              <p className="text-sm text-muted-foreground truncate" title={item.long}>
                                {item.long}
                              </p>
                              <p className="font-mono text-sm text-primary font-medium mt-1">
                                {item.short}
                              </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(item.short)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openUrl(item.short)}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-900">
                <p className="font-medium mb-1">✅ Free URL Shortening!</p>
                <p className="text-xs">
                  This tool uses TinyURL's free API. No API key required. Shortened links never expire
                  and can be shared anywhere. Perfect for social media, emails, and SMS.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LinkShortener;
