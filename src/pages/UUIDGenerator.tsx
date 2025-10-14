import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UUIDGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uuid, setUuid] = useState("");
  const [count, setCount] = useState("1");
  const [version, setVersion] = useState("v4");
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUID = (): string => {
    if (version === "v4") {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    // For v1, using timestamp-based approach (simplified)
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2);
    return `${timestamp.toString(16).padStart(8, '0')}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11, 23)}`.substring(0, 36);
  };

  const handleGenerate = () => {
    const numCount = parseInt(count) || 1;
    const generated: string[] = [];
    
    for (let i = 0; i < Math.min(numCount, 100); i++) {
      generated.push(generateUUID());
    }
    
    setUuids(generated);
    if (generated.length === 1) {
      setUuid(generated[0]);
    } else {
      setUuid(generated.join('\n'));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "UUID copied to clipboard",
    });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuid);
    toast({
      title: "Copied!",
      description: `${uuids.length} UUID(s) copied to clipboard`,
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
              <CardTitle className="text-3xl">UUID Generator</CardTitle>
              <CardDescription>Generate unique identifiers (UUIDs) v1 and v4</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">UUID Version</Label>
                  <Select value={version} onValueChange={setVersion}>
                    <SelectTrigger id="version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1 (Timestamp-based)</SelectItem>
                      <SelectItem value="v4">Version 4 (Random)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="count">Number of UUIDs</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={handleGenerate}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate UUID{parseInt(count) > 1 ? 's' : ''}
              </Button>

              {uuid && (
                <div className="space-y-4">
                  {uuids.length === 1 ? (
                    <div className="bg-muted p-4 rounded-lg font-mono break-all flex items-center justify-between gap-4">
                      <span className="text-lg">{uuid}</span>
                      <Button size="icon" variant="ghost" onClick={() => copyToClipboard(uuid)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Generated {uuids.length} UUIDs</Label>
                        <Button size="sm" variant="ghost" onClick={copyAll}>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy All
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                        {uuids.map((id, index) => (
                          <div key={index} className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
                            <span className="font-mono text-sm flex-1">{id}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyToClipboard(id)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                    <p className="font-medium mb-1">About UUID {version.toUpperCase()}</p>
                    <p className="text-xs">
                      {version === "v4" 
                        ? "Version 4 UUIDs are randomly generated and have 122 bits of randomness. They're the most commonly used UUID version."
                        : "Version 1 UUIDs are timestamp-based and include the current time and a unique identifier. They can be sorted chronologically."
                      }
                    </p>
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

export default UUIDGenerator;
