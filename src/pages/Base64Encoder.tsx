import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const Base64Encoder = () => {
  useToolTracking("Base64 Encoder");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Failed to encode text",
        variant: "destructive",
      });
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Invalid Base64 string",
        variant: "destructive",
      });
    }
  };

  const handleConvert = () => {
    if (mode === "encode") {
      encodeBase64();
    } else {
      decodeBase64();
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === "encode" ? "decode" : "encode");
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
              { title: "Choose Mode", description: "Select Encode to convert text to Base64, or Decode to convert Base64 back to text." },
              { title: "Enter Text", description: "Type or paste your text in the input area." },
              { title: "Instant Conversion", description: "The conversion happens automatically as you type." },
              { title: "Copy Result", description: "Click the copy button to copy the encoded or decoded text." }
            ]}
            tips={[
              { text: "Base64 is commonly used for encoding binary data in text format" },
              { text: "Perfect for embedding images in HTML/CSS or API requests" },
              { text: "Decoding invalid Base64 will show an error message" },
              { text: "Base64 increases data size by approximately 33%" }
            ]}
          />

          <Card className="max-w-4xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Base64 Encoder/Decoder</CardTitle>
              <CardDescription>Encode and decode Base64 strings easily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="encode">Encode</TabsTrigger>
                  <TabsTrigger value="decode">Decode</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
                  </label>
                  <Textarea
                    placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[200px] font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">
                      {mode === "encode" ? "Base64 Encoded" : "Decoded Text"}
                    </label>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={copyOutput}
                      disabled={!output}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-[200px] font-mono bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  className="bg-gradient-primary border-0" 
                  onClick={handleConvert}
                  disabled={!input}
                >
                  {mode === "encode" ? "Encode" : "Decode"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={swapInputOutput}
                  disabled={!output}
                >
                  Swap
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Base64Encoder;
