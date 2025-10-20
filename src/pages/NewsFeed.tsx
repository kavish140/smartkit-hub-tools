import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Newspaper, ExternalLink, RefreshCw, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

const NewsFeed = () => {
  useToolTracking("News Feed");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("us");
  const [apiKey, setApiKey] = useState("");

  const categories = [
    { value: "general", label: "General" },
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports", label: "Sports" },
    { value: "science", label: "Science" },
    { value: "health", label: "Health" },
  ];

  const countries = [
    { value: "us", label: "United States" },
    { value: "gb", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "in", label: "India" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
  ];

  const fetchNews = async () => {
    if (!apiKey.trim()) {
      // Show demo data
      const demoArticles: NewsArticle[] = [
        {
          title: "Breaking: Technology Advances Continue",
          description: "Latest developments in AI and machine learning are transforming industries worldwide. Experts predict significant changes in the coming years.",
          url: "#",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Demo News", url: "#" }
        },
        {
          title: "Global Markets Show Strong Performance",
          description: "Stock markets around the world reach new highs as investor confidence grows. Economic indicators remain positive.",
          url: "#",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "Demo Business", url: "#" }
        },
        {
          title: "Climate Summit Brings World Leaders Together",
          description: "International cooperation on climate change reaches new levels with major commitments from key nations.",
          url: "#",
          image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "Demo World", url: "#" }
        },
        {
          title: "Sports Championship Results Surprise Fans",
          description: "Unexpected outcomes in major sporting events keep audiences on the edge of their seats worldwide.",
          url: "#",
          image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: "Demo Sports", url: "#" }
        },
        {
          title: "Medical Breakthrough Offers New Hope",
          description: "Researchers announce significant progress in treatment options for previously difficult conditions.",
          url: "#",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          source: { name: "Demo Health", url: "#" }
        },
      ];
      
      setArticles(demoArticles);
      toast({
        title: "Demo Mode",
        description: "Showing sample articles. Add your GNews API key for real news.",
        variant: "default",
      });
      return;
    }

    setLoading(true);
    try {
      // Using GNews API - requires free API key from https://gnews.io/
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
      
      toast({
        title: "News Loaded",
        description: `Fetched ${data.articles?.length || 0} articles`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news. Check your API key or try demo mode.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">News Feed</CardTitle>
              <CardDescription>Get the latest news from various sources worldwide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="GNews API Key (optional - leave blank for demo)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0"
                onClick={fetchNews}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Newspaper className="h-4 w-4 mr-2" />
                    Load News
                  </>
                )}
              </Button>

              {articles.length > 0 && (
                <div className="space-y-4 max-h-[700px] overflow-y-auto">
                  {articles.map((article, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        {article.image && (
                          <div className="md:w-48 md:flex-shrink-0">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-48 md:h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400";
                              }}
                            />
                          </div>
                        )}
                        <CardContent className="p-6 flex-1">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-bold leading-tight flex-1">
                              {article.title}
                            </h3>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {article.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{article.source.name}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {articles.length === 0 && !loading && (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No articles loaded yet</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Load News" to fetch the latest articles
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <p className="font-medium mb-1">📰 Get Your Free API Key</p>
                <p className="text-xs mb-2">
                  For real-time news, get a free API key from{" "}
                  <a 
                    href="https://gnews.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    GNews.io
                  </a>
                  {" "}(100 requests/day free). Leave blank to use demo mode with sample articles.
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

export default NewsFeed;
