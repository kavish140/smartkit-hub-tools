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
  
  // API Keys - hardcoded fallback if env variables don't work
  const FALLBACK_GEMINI_KEY = "AIzaSyC-BlgasLsoKLqN05QaDFJg0Ar-gFdjDxQ";
  const FALLBACK_ELEVENLABS_KEY = "sk_be8cacf10b4a8ec62da98453eabedfc3f24f18d13c6acc2c";
  
  const defaultGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || FALLBACK_GEMINI_KEY;
  const defaultElevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY || FALLBACK_ELEVENLABS_KEY;
  
  const [geminiApiKey, setGeminiApiKey] = useState(defaultGeminiKey);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(defaultElevenLabsKey);
  const [showApiKeys, setShowApiKeys] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load saved API keys from localStorage if they exist, otherwise use defaults
    const savedGeminiKey = localStorage.getItem("gemini_api_key");
    const savedElevenKey = localStorage.getItem("elevenlabs_api_key");
    
    if (savedGeminiKey) {
      setGeminiApiKey(savedGeminiKey);
    } else if (defaultGeminiKey) {
      setGeminiApiKey(defaultGeminiKey);
    }
    
    if (savedElevenKey) {
      setElevenLabsApiKey(savedElevenKey);
    } else if (defaultElevenLabsKey) {
      setElevenLabsApiKey(defaultElevenLabsKey);
    }
    
    // Debug: Log if environment variables are loaded (only first 10 chars for security)
    console.log("Gemini API Key loaded:", defaultGeminiKey ? `${defaultGeminiKey.substring(0, 10)}...` : "NOT FOUND");
    console.log("ElevenLabs API Key loaded:", defaultElevenLabsKey ? `${defaultElevenLabsKey.substring(0, 10)}...` : "NOT FOUND");

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

  const saveApiKeys = () => {
    if (geminiApiKey) localStorage.setItem("gemini_api_key", geminiApiKey);
    if (elevenLabsApiKey) localStorage.setItem("elevenlabs_api_key", elevenLabsApiKey);
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved locally in your browser.",
    });
  };

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
    if (!isVoiceEnabled || !elevenLabsApiKey) return;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ElevenLabs API error");
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
        description: "Could not generate speech. Check your ElevenLabs API key or quota.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    if (!geminiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key to use the chatbot.",
        variant: "destructive",
      });
      setShowApiKeys(true);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser: ${userMessage.content}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error:", errorData);
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Gemini API Response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text;

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
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error?.message || "Unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage.includes("API") ? errorMessage : "Failed to get AI response. Please check your API key and try again.",
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
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm">
                    ✅ <strong>Ready to use!</strong> The chatbot is pre-configured with default API keys. 
                    You can use it immediately or <button 
                      onClick={() => setShowApiKeys(!showApiKeys)} 
                      className="underline text-primary hover:text-primary/80"
                    >
                      {showApiKeys ? 'hide' : 'customize'} your own API keys
                    </button>.
                  </p>
                </div>

                {/* API Configuration (Collapsible) */}
                {showApiKeys && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold text-sm">API Configuration (Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gemini-key">Gemini API Key</Label>
                        <Input
                          id="gemini-key"
                          type="password"
                          placeholder="AIzaSy..."
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Get your free key from{" "}
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Google AI Studio
                          </a>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="elevenlabs-key">ElevenLabs API Key (for voice)</Label>
                        <Input
                          id="elevenlabs-key"
                          type="password"
                          placeholder="sk_..."
                          value={elevenLabsApiKey}
                          onChange={(e) => setElevenLabsApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Get your key from{" "}
                          <a
                            href="https://elevenlabs.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            ElevenLabs
                          </a>
                        </p>
                      </div>
                    </div>
                    <Button onClick={saveApiKeys} variant="outline" size="sm">
                      Save My API Keys Locally
                    </Button>
                  </div>
                )}

                {/* Voice Settings */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="voice-enabled"
                      checked={isVoiceEnabled}
                      onCheckedChange={setIsVoiceEnabled}
                      disabled={!elevenLabsApiKey}
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
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li><strong>Just start chatting!</strong> The tool is pre-configured and ready to use</li>
                  <li>Optionally customize the system prompt to change AI behavior</li>
                  <li>Toggle voice output and select your preferred voice</li>
                  <li>Type your message or click the microphone to use voice input</li>
                  <li>Press Enter or click Send to get AI responses</li>
                  <li>Copy messages, export chat history, or clear conversation anytime</li>
                </ol>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">💡 Tip: Use Your Own API Keys</h4>
                  <p className="text-xs text-muted-foreground">
                    The default keys have usage limits shared by all users. For unlimited use, click 
                    "customize your own API keys" above and add your free Gemini API key from Google AI Studio.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">⚠️ Privacy Note</h4>
                  <p className="text-xs text-muted-foreground">
                    API keys are stored locally in your browser only. Your conversations are sent directly 
                    to Google/ElevenLabs servers and are not stored on our servers.
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
