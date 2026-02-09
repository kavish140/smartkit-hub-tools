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
      // Use our backend API to download directly
      const downloadUrl = `/api/download?videoId=${videoInfo.videoId}&quality=${selectedQuality}&format=${selectedFormat}`;

      // Create a hidden link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoInfo.title}.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started!",
        description: `Downloading ${videoInfo.title} in ${selectedQuality}p ${selectedFormat.toUpperCase()}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start download. Please try the alternative methods below.",
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
              <CardTitle className="text-3xl">YouTube Video Downloader</CardTitle>
              <CardDescription>Download YouTube videos directly in your browser - No software needed!</CardDescription>
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

                    {/* Web-Based Download Section */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-600 text-white p-3 rounded-lg">
                            <Download className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 text-green-900">Download Video - Direct Download</h3>
                            <p className="text-sm text-green-800 mb-4">
                              Download videos directly from our servers. No redirects to other sites!
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div>
                                <label className="text-xs font-medium text-green-900 mb-1 block">Quality</label>
                                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="144">144p (Low)</SelectItem>
                                    <SelectItem value="360">360p (SD)</SelectItem>
                                    <SelectItem value="480">480p (SD)</SelectItem>
                                    <SelectItem value="720">720p (HD)</SelectItem>
                                    <SelectItem value="1080">1080p (Full HD)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-green-900 mb-1 block">Format</label>
                                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mp4">MP4 (Video)</SelectItem>
                                    <SelectItem value="mp3">MP3 (Audio Only)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white w-full mb-3"
                              onClick={handleDownload}
                              disabled={downloading}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {downloading ? "Downloading..." : "⚡ Download Now (Direct from Our Site)"}
                            </Button>

                            {/* Backup Download Methods */}
                            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 mb-3">
                              <p className="text-xs font-bold text-amber-900 mb-2">💾 BACKUP METHODS (if direct download fails):</p>
                              <div className="space-y-2 text-xs text-amber-900">

                                <div className="bg-white rounded p-2 border-2 border-green-400">
                                  <p className="font-bold mb-1 text-green-700">✅ Method 1: SS Trick (EASIEST!)</p>
                                  <p className="mb-1">Add <code className="bg-amber-100 px-1 rounded font-bold">ss</code> before youtube.com in any video URL</p>
                                  <p className="text-[10px] mb-2 text-gray-600">Example: https://<strong className="text-green-700">ss</strong>youtube.com/watch?v={videoInfo.videoId}</p>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 h-7 text-xs w-full"
                                    onClick={() => {
                                      const ssUrl = `https://ssyoutube.com/watch?v=${videoInfo.videoId}`;
                                      window.open(ssUrl, '_blank');
                                      toast({ title: "Opening SS YouTube", description: "This redirects to savefrom.net - select quality and download!" });
                                    }}
                                  >
                                    ⚡ Use SS Method (Recommended)
                                  </Button>
                                </div>

                                <div className="bg-white rounded p-2">
                                  <p className="font-semibold mb-1">Method 2: Copy URL & Use Any Downloader</p>
                                  <p className="text-[10px] mb-2 text-gray-600">Copy video URL and paste into any YouTube downloader site you trust</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs w-full"
                                    onClick={() => {
                                      const youtubeUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
                                      navigator.clipboard.writeText(youtubeUrl);
                                      toast({
                                        title: "✅ URL Copied!",
                                        description: "Paste this into: savefrom.net, y2mate.com, or any YouTube downloader"
                                      });
                                    }}
                                  >
                                    📋 Copy Video URL
                                  </Button>
                                </div>

                                <div className="bg-white rounded p-2">
                                  <p className="font-semibold mb-1">Method 3: Manual Download Sites</p>
                                  <p className="text-[10px] mb-2 text-gray-600">Open these sites and paste your video URL:</p>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px] flex-1"
                                      onClick={() => {
                                        window.open('https://en.savefrom.net/', '_blank');
                                        toast({ title: "Opening SaveFrom.net", description: "Paste your video URL there" });
                                      }}
                                    >
                                      SaveFrom.net
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px] flex-1"
                                      onClick={() => {
                                        window.open('https://www.y2mate.com/', '_blank');
                                        toast({ title: "Opening Y2Mate", description: "Paste your video URL there" });
                                      }}
                                    >
                                      Y2Mate.com
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px] flex-1"
                                      onClick={() => {
                                        window.open('https://loader.to/', '_blank');
                                        toast({ title: "Opening Loader.to", description: "Paste your video URL there" });
                                      }}
                                    >
                                      Loader.to
                                    </Button>
                                  </div>
                                </div>

                              </div>
                            </div>

                            <div className="mt-3 bg-white/60 rounded border border-green-200 p-3">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-green-800">
                                  <p className="font-semibold mb-1">Direct Download Benefits:</p>
                                  <ul className="space-y-0.5 pl-4 list-disc">
                                    <li>Downloads directly from our servers</li>
                                    <li>No redirects to third-party sites</li>
                                    <li>Choose your preferred quality and format</li>
                                    <li>Fast and reliable downloads</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-green-700 mt-3 italic">
                              Note: Downloads are processed through third-party services. Quality and format availability may vary.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-900">
                <p className="font-medium mb-1">ℹ️ Legal Notice</p>
                <p className="text-xs mb-2">
                  Please respect copyright laws and YouTube's Terms of Service. Only download videos you have permission to download
                  or that are in the public domain. This tool is for personal, educational, and fair use purposes only.
                </p>
                <p className="text-xs">
                  Video information is fetched using YouTube's public oEmbed API. For enhanced features, you can add a YouTube Data API v3 key from{" "}
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YouTubeDownloader;
