import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Mic, MicOff, VolumeX, Trash2, Copy, Settings, MessageSquare, Plus, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { useToolTracking } from "@/hooks/useToolTracking";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
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
  const { toast } = useToast();

  // Chat History Management
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const saved = localStorage.getItem("chatHistories");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful, friendly, and expressive AI assistant named Jarvis. When appropriate, use emotional language, exclamations, and varied tone. For jokes, be enthusiastic and playful! For serious topics, be thoughtful and empathetic. Use punctuation like ! and ? to convey emotion. Keep responses natural and conversational.");
  const [showSettings, setShowSettings] = useState(false);
  
  const [groqApiKey, setGroqApiKey] = useState(
    () => localStorage.getItem("groqApiKey") || import.meta.env.VITE_GROQ_API_KEY || ""
  );
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(
    () => localStorage.getItem("elevenLabsApiKey") || import.meta.env.VITE_ELEVENLABS_API_KEY || ""
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Persist API keys to localStorage when they change
    if (groqApiKey) {
      localStorage.setItem("groqApiKey", groqApiKey);
    }
    if (elevenLabsApiKey) {
      localStorage.setItem("elevenLabsApiKey", elevenLabsApiKey);
    }

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

  // Save chat histories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }, [chatHistories]);

  // Update current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistories(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages, updatedAt: new Date(), title: generateChatTitle(messages) }
          : chat
      ));
    }
  }, [messages, currentChatId]);

  const generateChatTitle = (msgs: Message[]) => {
    const firstUserMsg = msgs.find(m => m.role === "user");
    if (!firstUserMsg) return "New Chat";
    return firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
  };

  const startNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChatHistories(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setInputText("");
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  };

  const deleteChat = (chatId: string) => {
    setChatHistories(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const clearAllHistory = () => {
    setChatHistories([]);
    setCurrentChatId(null);
    setMessages([]);
  };

  const saveSettings = () => {
    if (groqApiKey) localStorage.setItem("groqApiKey", groqApiKey);
    if (elevenLabsApiKey) localStorage.setItem("elevenLabsApiKey", elevenLabsApiKey);
    setShowSettings(false);
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved locally.",
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
            model_id: "eleven_turbo_v2_5", // Faster, more expressive model
            voice_settings: {
              stability: 0.3, // Lower = more expressive and varied
              similarity_boost: 0.8, // Higher = more character-like
              style: 0.5, // Added style for emotional range
              use_speaker_boost: true // Enhance emotional expression
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

    if (!groqApiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Groq API key in settings.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }

    // Create new chat if none exists
    if (!currentChatId) {
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: inputText.slice(0, 30) + (inputText.length > 30 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setChatHistories(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    }

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      // Build messages in OpenAI format for Groq
      const groqMessages = [
        {
          role: "system",
          content: systemPrompt
        },
        ...newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.9, // Higher = more creative and expressive
            max_tokens: 1024,
            top_p: 0.95, // Increased for more varied responses
            frequency_penalty: 0.3, // Reduce repetition
            presence_penalty: 0.2 // Encourage diverse vocabulary
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Groq API Error:", errorData);
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from Groq API");
      }
      
      const aiResponse = data.choices[0].message.content;

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
    <div className="flex h-screen bg-background">
      <SEO
        title="AI Chatbot with Voice - Groq & ElevenLabs | AI SmartKit"
        description="Advanced AI chatbot powered by Groq (Llama 3.3) with voice input/output using ElevenLabs. Chat naturally with text or voice, customize voices, and get intelligent responses."
        keywords="AI chatbot, voice assistant, Groq AI, Llama 3, ElevenLabs, voice chat, AI assistant, speech recognition, text to speech"
      />
      
      {/* Sidebar - Chat History */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r bg-muted/30 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Chat History</h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-2 border-b">
          <Button onClick={startNewChat} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chatHistories.map((chat) => (
            <div key={chat.id} className="group relative">
              <button
                onClick={() => loadChat(chat.id)}
                className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                  currentChatId === chat.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {chatHistories.length > 0 && (
          <div className="p-2 border-t">
            <Button onClick={clearAllHistory} variant="outline" size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">AI Chatbot</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Configure your AI chatbot settings</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* API Keys */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">API Configuration</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groq-key">Groq API Key</Label>
                      <Input
                        id="groq-key"
                        type="password"
                        placeholder="gsk_..."
                        value={groqApiKey}
                        onChange={(e) => setGroqApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Get your free key from{" "}
                        <a
                          href="https://console.groq.com/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Groq Console
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
                </div>

                {/* Voice Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Voice Settings</h3>
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

                  {isVoiceEnabled && (
                    <div className="col-span-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1">🎭 Expressive Voice Mode Active</p>
                      <p className="text-xs text-muted-foreground">
                        AI responses are optimized for emotional delivery with varied tone, enthusiasm, and natural speech patterns. Perfect for jokes, stories, and engaging conversations!
                      </p>
                    </div>
                  )}
                </div>

                {/* System Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Define how the AI should behave..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: The default prompt encourages expressive, emotional responses for better voice output
                  </p>
                </div>

                <Button onClick={saveSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-muted-foreground">Type a message below to chat with AI</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-background p-4">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex gap-2">
              <Textarea
                placeholder="Message AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                className="min-h-[50px] max-h-[200px] resize-none"
                rows={1}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  disabled={isLoading}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  size="icon"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isListening && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                🎤 Listening... Speak now
              </p>
            )}
            
            {/* How to use link */}
            <div className="text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs text-foreground hover:underline">
                    How to use
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How to Use AI Chatbot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Type your message in the input box or use voice input (microphone icon)</li>
                      <li>Press Enter or click Send to get AI responses</li>
                      <li>Click Settings (gear icon) to configure API keys, voice options, and system prompt</li>
                      <li>View and manage your chat history in the sidebar</li>
                      <li>Start new conversations with the "New Chat" button</li>
                      <li>Enable voice output in settings to hear AI responses</li>
                    </ol>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1">💡 Tip</p>
                      <p className="text-xs text-muted-foreground">
                        The chatbot works out of the box with default API keys. For unlimited usage, add your own free API keys from Groq Console.
                      </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1">🔒 Privacy</p>
                      <p className="text-xs text-muted-foreground">
                        All chats and settings are stored locally in your browser. Nothing is sent to our servers.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
