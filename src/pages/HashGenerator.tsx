import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HashGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hash, setHash] = useState("");

  const generateHash = async () => {
    if (!text) {
      toast({
        title: "Error",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
      toast({
        title: "Success!",
        description: "Hash generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive",
      });
    }
  };

  const copyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
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
              <CardTitle className="text-3xl flex items-center gap-2">
                <Hash className="h-8 w-8" />
                Hash Generator
              </CardTitle>
              <CardDescription>
                Generate cryptographic hashes for your text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text">Input Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter text to hash..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Hash Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHA-1">SHA-1</SelectItem>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-384">SHA-384</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={generateHash}
              >
                <Hash className="h-4 w-4 mr-2" />
                Generate Hash
              </Button>

              {hash && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Generated Hash ({algorithm})</Label>
                    <Button size="sm" variant="ghost" onClick={copyHash}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded font-mono text-xs break-all">
                    {hash}
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">About Hash Functions:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li> SHA-1: 160-bit hash (Legacy, less secure)</li>
                  <li> SHA-256: 256-bit hash (Recommended)</li>
                  <li> SHA-384: 384-bit hash (High security)</li>
                  <li> SHA-512: 512-bit hash (Maximum security)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HashGenerator;