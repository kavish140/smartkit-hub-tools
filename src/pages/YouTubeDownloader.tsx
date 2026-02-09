import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Video, Search, ExternalLink, Clock, Eye, ThumbsUp, Download, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/hooks/useToolTracking";

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  author: string;
  description: string;
  videoId: string;
}

interface DownloadFormat {
  quality: string;
  format: string;
  url: string;
}

const YouTubeDownloader = () => {
  useToolTracking("YouTube Downloader");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("720");
  const [selectedFormat, setSelectedFormat] = useState("mp4");

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getVideoInfo = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL or video ID",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Using YouTube oEmbed API for video info (no API key needed!)
      const oembedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      if (!oembedResponse.ok) {
        throw new Error("Video not found or unavailable");
      }

      const oembedData = await oembedResponse.json();

      setVideoInfo({
        title: oembedData.title || "YouTube Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: "N/A",
        views: "N/A",
        likes: "N/A",
        author: oembedData.author_name || "Unknown",
        description: `Video by ${oembedData.author_name}`,
        videoId: videoId
      });

      toast({
        title: "Video Found!",
        description: "Video information loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch video information. Please check the URL.",
        variant: "destructive",
      });
      setVideoInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setDownloading(true);

    try {
      // Since we're on GitHub Pages (static hosting), we can't use a backend API
      // Instead, we'll use a proven third-party API that works from the browser

      // Option 1: Use a CORS-enabled YouTube download API
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;

      // Try to use a free API service that allows CORS
      // Using loader.to API (works from browser)
      const apiUrl = `https://loader.to/ajax/download.php?format=${selectedFormat}&url=${encodeURIComponent(youtubeUrl)}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.downloadUrl) {
            // Download directly
            window.open(data.downloadUrl, '_blank');
            toast({
              title: "Download Started!",
              description: "Your video is downloading...",
            });
            setDownloading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('API method failed, trying alternative...');
      }

      // Fallback: Use SS YouTube trick (most reliable for GitHub Pages)
      const ssUrl = `https://ssyoutube.com/watch?v=${videoInfo.videoId}`;
      window.open(ssUrl, '_blank');

      toast({
        title: "Opening Download Page",
        description: "Select your quality and download. This opens in a new tab.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Please use one of the backup methods below.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
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

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">YouTube Downloader</CardTitle>
              <CardDescription>Enter a YouTube URL to download videos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter YouTube URL or Video ID"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && getVideoInfo()}
                  className="flex-1"
                />
                <Button 
                  className="bg-gradient-primary border-0"
                  onClick={getVideoInfo}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Loading..." : "Get Info"}
                </Button>
              </div>

              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <strong>Supported formats:</strong> Full URL, Short URL, or Video ID
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Examples: youtube.com/watch?v=dQw4w9WgXcQ | youtu.be/dQw4w9WgXcQ | dQw4w9WgXcQ
                </p>
              </div>

              {videoInfo && (
                <div className="space-y-4 animate-fade-in">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoInfo.videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {videoInfo.duration}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold">{videoInfo.title}</h2>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {videoInfo.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {videoInfo.likes} likes
                      </div>
                    </div>

                    <div className="font-medium">{videoInfo.author}</div>

                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <p className="text-sm whitespace-pre-wrap">{videoInfo.description}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${videoInfo.videoId}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`https://www.youtube.com/embed/${videoInfo.videoId}`, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Open Embed Player
                      </Button>
                    </div>

                    {/* Simple Download Section */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">Download Video</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Resolution</label>
                            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="144">144p</SelectItem>
                                <SelectItem value="360">360p</SelectItem>
                                <SelectItem value="480">480p</SelectItem>
                                <SelectItem value="720">720p</SelectItem>
                                <SelectItem value="1080">1080p</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Format</label>
                            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mp4">Video</SelectItem>
                                <SelectItem value="mp3">Audio Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white w-full h-12 text-base"
                            onClick={handleDownload}
                            disabled={downloading}
                          >
                            <Download className="h-5 w-5 mr-2" />
                            {downloading ? "Please wait..." : "Download"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {!videoInfo && !loading && (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No video loaded</p>
                  <p className="text-sm text-muted-foreground">
                    Enter a YouTube URL to view video information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YouTubeDownloader;
