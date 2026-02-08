import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Video, Search, ExternalLink, Clock, Eye, ThumbsUp, Download, Smartphone } from "lucide-react";
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

const YouTubeDownloader = () => {
  useToolTracking("YouTube Downloader");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);

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

    // Demo mode - show sample video info
    // Note: Actual YouTube API requires API key from Google Cloud Console
    setTimeout(() => {
      setVideoInfo({
        title: "Sample Video Title",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: "10:30",
        views: "1,234,567",
        likes: "12,345",
        author: "Channel Name",
        description: "This is a demo. To enable full functionality, add your YouTube Data API v3 key from Google Cloud Console.",
        videoId: videoId
      });

      setLoading(false);
      
      toast({
        title: "Demo Mode",
        description: "Showing sample video info. Add YouTube API key for real data.",
      });
    }, 1000);
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
              <CardTitle className="text-3xl">YouTube Video Info</CardTitle>
              <CardDescription>View information about YouTube videos</CardDescription>
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

                    <div className="bg-muted p-3 rounded-lg text-xs">
                      <p className="font-medium mb-1">Video ID:</p>
                      <code className="bg-background px-2 py-1 rounded">{videoInfo.videoId}</code>
                    </div>
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

              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-900">
                <p className="font-medium mb-1">⚠️ Important Notice</p>
                <p className="text-xs mb-2">
                  This tool displays video information only. Downloading copyrighted content without 
                  permission may violate YouTube's Terms of Service and copyright laws.
                </p>
                <p className="text-xs">
                  For full functionality, get a free YouTube Data API v3 key from{" "}
                  <a 
                    href="https://console.cloud.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Google Cloud Console
                  </a>.
                </p>
              </div>

              {/* Download Desktop App Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-lg">
                      <Download className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-blue-900">Download Videos with Our Desktop App</h3>
                      <p className="text-sm text-blue-800 mb-4">
                        Want to actually download YouTube videos? Get our free desktop application for Windows!
                      </p>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          // Direct download link to the file in public folder
                          window.open('/VideoDownloaderPro.exe', '_blank');
                          toast({
                            title: "Download Started",
                            description: "VideoDownloaderPro.exe is being downloaded",
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download for Windows
                      </Button>
                      <p className="text-xs text-blue-700 mt-2">
                        File size: ~19.3 MB | Windows 10/11 compatible
                      </p>

                      {/* Clear user-friendly instructions */}
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">ℹ️</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900 mb-2">
                              Windows Security Warning - Quick Fix
                            </p>
                            <p className="text-xs text-blue-800 mb-3">
                              After downloading, Windows will show a security warning. This is normal for non-commercially signed apps.
                              <strong> Here's how to run it:</strong>
                            </p>
                            <ol className="text-xs text-blue-900 space-y-2 pl-4">
                              <li>1. Click the download button above</li>
                              <li>2. When you see "Windows protected your PC", click <strong>"More info"</strong></li>
                              <li>3. Click the <strong>"Run anyway"</strong> button that appears</li>
                              <li>4. Done! The app will open ✅</li>
                            </ol>
                            <p className="text-xs text-blue-700 mt-3 italic">
                              This is a free tool. Removing this warning requires a paid code signing certificate (€86/year).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Apps Coming Soon */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-purple-900">Mobile Apps Coming Soon! 📱</h3>
                      <p className="text-sm text-purple-800 mb-3">
                        We're working hard to bring you native mobile applications:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/50 p-3 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">🤖</span>
                            <span className="font-semibold text-purple-900">Android App</span>
                          </div>
                          <p className="text-xs text-purple-700">Coming Soon for Android 8.0+</p>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">🍎</span>
                            <span className="font-semibold text-purple-900">iOS App</span>
                          </div>
                          <p className="text-xs text-purple-700">Coming Soon for iOS 14.0+</p>
                        </div>
                      </div>
                      <p className="text-xs text-purple-700">
                        💡 Want early access? Join our newsletter to be notified when we launch!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YouTubeDownloader;
