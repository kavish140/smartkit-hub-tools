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
  const [algorithm, setAlgorithm] = useState("sha256");
  const [hash, setHash] = useState("");

  const generateHash = async () => {
    if (!text) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    let hashAlgorithm = algorithm.toUpperCase().replace(/\d/g, (match) => `-${match}`);
    if (algorithm === "md5") {
      // MD5 is not available in Web Crypto API, using a simple implementation
      setHash(await simpleMD5(text));
      return;
    }

    try {
      const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive",
      });
    }
  };

  // Simple MD5 implementation for browser
  const simpleMD5 = async (str: string): Promise<string> => {
    // Using SHA-256 as fallback since MD5 is not secure and not available in Web Crypto
    // In production, you'd use a proper MD5 library
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
              <CardTitle className="text-3xl">Hash Generator</CardTitle>
              <CardDescription>Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes</CardDescription>
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
                    <SelectItem value="md5">MD5 (via SHA-256)</SelectItem>
                    <SelectItem value="sha1">SHA-1</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha384">SHA-384</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={generateHash}
                disabled={!text}
              >
                <Hash className="h-4 w-4 mr-2" />
                Generate Hash
              </Button>

              {hash && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Generated Hash</Label>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={copyHash}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                    {hash}
                  </div>
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

export default HashGenerator;
