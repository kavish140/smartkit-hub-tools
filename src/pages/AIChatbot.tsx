import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Trash2, Copy, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToolTracking } from "@/hooks/useToolTracking";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const VOICE_OPTIONS = [
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Arnold (Deep Male)" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (British Male)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female)" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Female)" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male)" },
];

const AIChatbot = () => {
  useToolTracking("AI Chatbot");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant named Jarvis. Provide clear, concise, and friendly responses.");
  const [apiUrl] = useState("http://localhost:3001/api");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not capture audio. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = async (text: string) => {
    if (!isVoiceEnabled) return;

    try {
      const response = await fetch(`${apiUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voiceId: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error("Text-to-speech error");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    } catch (error) {
      console.error("Text-to-speech error:", error);
      toast({
        title: "Voice Error",
        description: "Could not generate speech. Check if the API server is running.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          systemPrompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat API error");
      }

      const data = await response.json();
      const aiResponse = data.response;

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if voice is enabled
      if (isVoiceEnabled) {
        await speakText(aiResponse);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Make sure the API server is running on port 3001.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed.",
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard.",
    });
  };

  const exportChat = () => {
    const chatText = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AI Chatbot with Voice - Gemini & ElevenLabs | AI SmartKit"
        description="Advanced AI chatbot powered by Google Gemini with voice input/output using ElevenLabs. Chat naturally with text or voice, customize voices, and get intelligent responses."
        keywords="AI chatbot, voice assistant, Gemini AI, ElevenLabs, voice chat, AI assistant, speech recognition, text to speech"
      />
      <Header />
      <main className="flex-1 bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-3xl">AI Chatbot with Voice</CardTitle>
                <CardDescription>
                  Chat with an advanced AI assistant powered by Google Gemini. Enable voice for natural conversations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    ✅ <strong>Ready to use!</strong> AI chatbot is powered by your backend API. 
                    Make sure the server is running on <code className="bg-background px-1 rounded">localhost:3001</code>
                  </p>
                </div>

                {/* Voice Settings */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="voice-enabled"
                      checked={isVoiceEnabled}
                      onCheckedChange={setIsVoiceEnabled}
                    />
                    <Label htmlFor="voice-enabled" className="cursor-pointer">
                      Enable Voice Output
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-select">Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger id="voice-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICE_OPTIONS.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopAudio}
                      disabled={!audioRef.current}
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Define how the AI should behave..."
                    rows={2}
                  />
                </div>

                {/* Chat Messages */}
                <div className="border rounded-lg p-4 h-[400px] overflow-y-auto bg-background">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>Start a conversation with the AI assistant...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">Thinking...</p>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message or use voice input..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      disabled={isLoading}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || isLoading}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Listening... Speak now
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Chat
                  </Button>
                  <Button
                    onClick={exportChat}
                    variant="outline"
                    disabled={messages.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">⚠️ Server Setup Required</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Before using the chatbot, start the API server:
                  </p>
                  <code className="block bg-background px-3 py-2 rounded text-xs">
                    cd server<br/>
                    npm install<br/>
                    npm start
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Server will run on <strong>http://localhost:3001</strong>
                  </p>
                </div>
                
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Make sure the backend API server is running (see above)</li>
                  <li>Customize the system prompt to change AI behavior</li>
                  <li>Toggle voice output and select your preferred voice</li>
                  <li>Type your message or click the microphone to use voice input</li>
                  <li>Press Enter or click Send to get AI responses</li>
                  <li>Copy messages, export chat history, or clear conversation anytime</li>
                </ol>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">ℹ️ Note</h4>
                  <p className="text-xs text-muted-foreground">
                    Your API keys are stored securely in the <code className="bg-background px-1 rounded">server/.env</code> file 
                    and never exposed to the frontend. This provides better security than storing keys in the browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIChatbot;
