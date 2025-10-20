import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Music, Upload, Download, Play, Pause, Volume2, FileAudio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";`nimport HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const AudioConverter = () => {
  useToolTracking("Audio Converter");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [bitrate, setBitrate] = useState(128);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const formats = [
    { value: "mp3", label: "MP3 (MPEG Audio Layer 3)", mime: "audio/mpeg" },
    { value: "wav", label: "WAV (Waveform Audio)", mime: "audio/wav" },
    { value: "ogg", label: "OGG (Ogg Vorbis)", mime: "audio/ogg" },
    { value: "webm", label: "WebM Audio", mime: "audio/webm" },
  ];

  const bitrateOptions = [64, 96, 128, 192, 256, 320];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an audio file",
          variant: "destructive",
        });
        return;
      }

      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setConvertedBlob(null);
      setIsPlaying(false);
      setCurrentTime(0);
      
      toast({
        title: "Audio Loaded",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      });
    }
  };

  const convertAudio = async () => {
    if (!audioFile || !audioUrl) {
      toast({
        title: "No Audio File",
        description: "Please upload an audio file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // For browser-based conversion, we'll use MediaRecorder API
      // This provides format conversion capabilities
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Fetch the audio file
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create an offline context for rendering
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      // Create a buffer source
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start(0);
      
      // Render the audio
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to desired format using MediaRecorder
      const stream = audioContext.createMediaStreamDestination();
      const newSource = audioContext.createBufferSource();
      newSource.buffer = renderedBuffer;
      newSource.connect(stream);
      
      // Get MIME type for selected format
      const selectedFormat = formats.find(f => f.value === outputFormat);
      let mimeType = selectedFormat?.mime || 'audio/webm';
      
      // Check if the format is supported
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Fallback to webm if not supported
        mimeType = 'audio/webm';
        toast({
          title: "Format Note",
          description: `${outputFormat.toUpperCase()} direct encoding not supported by browser. Converting to WebM format.`,
        });
      }

      const mediaRecorder = new MediaRecorder(stream.stream, {
        mimeType: mimeType,
        audioBitsPerSecond: bitrate * 1000
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setConvertedBlob(blob);
        setLoading(false);
        
        toast({
          title: "Conversion Complete!",
          description: `Audio converted successfully (${(blob.size / 1024 / 1024).toFixed(2)} MB)`,
        });
      };

      newSource.start(0);
      mediaRecorder.start();

      // Stop recording after the duration
      setTimeout(() => {
        mediaRecorder.stop();
        newSource.stop();
      }, (renderedBuffer.duration * 1000) + 100);

    } catch (error) {
      setLoading(false);
      console.error("Conversion error:", error);
      toast({
        title: "Conversion Failed",
        description: "Browser may not support this audio format conversion. Try WebM format.",
        variant: "destructive",
      });
    }
  };

  const downloadAudio = () => {
    if (convertedBlob && audioFile) {
      const url = URL.createObjectURL(convertedBlob);
      const link = document.createElement('a');
      const originalName = audioFile.name.split('.')[0];
      link.download = `${originalName}_converted.${outputFormat}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Converted audio file has been downloaded",
      });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

          {/* How to Use Guide */}
          <HowToUse
            steps={[
              { title: "Upload Audio", description: "Click to browse or drag & drop your audio file (MP3, WAV, OGG, M4A supported)." },
              { title: "Select Output Format", description: "Choose the format you want to convert to from the dropdown." },
              { title: "Adjust Settings", description: "Set bitrate and sample rate for quality control. Higher values = better quality." },
              { title: "Convert & Download", description: "Click Convert to process, then download your converted audio file." }
            ]}
            tips={[
              { text: "Higher bitrate (320kbps) provides better audio quality" },
              { text: "WAV format is lossless but creates larger files" },
              { text: "MP3 is great for compatibility across all devices" },
              { text: "OGG offers good quality-to-size ratio" }
            ]}
          />

          <Card className="max-w-4xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Audio Converter</CardTitle>
              <CardDescription>Convert audio files between different formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Audio File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported: MP3, WAV, OGG, M4A, FLAC, AAC, and more
                    </p>
                  </label>
                </div>
              </div>

              {/* File Info */}
              {audioFile && (
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Music className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB • {audioFile.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Audio Player */}
              {audioUrl && (
                <Card className="bg-gradient-primary text-white">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          size="lg"
                          variant="secondary"
                          onClick={togglePlayPause}
                          className="rounded-full w-12 h-12 p-0"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                        </Button>
                        <div>
                          <p className="font-medium">Preview Audio</p>
                          <p className="text-sm opacity-90">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </p>
                        </div>
                      </div>
                      <Volume2 className="h-6 w-6 opacity-75" />
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Conversion Settings */}
              {audioFile && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div className="flex items-center gap-2">
                              <FileAudio className="h-4 w-4" />
                              {format.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Audio Bitrate: {bitrate} kbps</Label>
                    <Slider
                      value={[bitrate]}
                      onValueChange={(value) => setBitrate(value[0])}
                      min={64}
                      max={320}
                      step={32}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {bitrateOptions.map((rate) => (
                        <span key={rate}>{rate}</span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary border-0"
                    onClick={convertAudio}
                    disabled={loading}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    {loading ? "Converting..." : `Convert to ${outputFormat.toUpperCase()}`}
                  </Button>
                </div>
              )}

              {/* Converted Audio */}
              {convertedBlob && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-900 font-medium mb-2">✅ Conversion Complete!</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-800">
                          Format: {outputFormat.toUpperCase()}
                        </p>
                        <p className="text-sm text-green-800">
                          Size: {(convertedBlob.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-sm text-green-800">
                          Bitrate: {bitrate} kbps
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={downloadAudio}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {outputFormat.toUpperCase()}
                  </Button>
                </div>
              )}

              {/* Info Cards */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <p className="font-medium mb-1">🎵 Browser-Based Audio Conversion</p>
                <p className="text-xs">
                  This tool converts audio entirely in your browser using the Web Audio API and MediaRecorder API.
                  No files are uploaded to any server - all processing happens locally for your privacy.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">💡 Supported Formats:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <strong>Input:</strong> MP3, WAV, OGG, M4A, FLAC, AAC, WMA, AIFF
                  </div>
                  <div>
                    <strong>Output:</strong> MP3, WAV, OGG, WebM (browser-dependent)
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> Actual format support depends on your browser. 
                  Chrome, Firefox, and Edge support most modern audio formats.
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

export default AudioConverter;
