import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const JSONFormatter = () => {
  useToolTracking("JSON Formatter");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
    } catch (error) {
      setOutput((error as Error).message);
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: "The input is not valid JSON",
        variant: "destructive",
      });
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
    } catch (error) {
      setOutput((error as Error).message);
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: "The input is not valid JSON",
        variant: "destructive",
      });
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      toast({
        title: "Valid JSON",
        description: "The JSON syntax is valid",
      });
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
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

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">JSON Formatter</CardTitle>
              <CardDescription>Format, validate, and minify JSON data beautifully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Input JSON</label>
                    {isValid !== null && (
                      <div className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isValid ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                        {isValid ? 'Valid' : 'Invalid'}
                      </div>
                    )}
                  </div>
                  <Textarea
                    placeholder='{"name": "John", "age": 30}'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Output</label>
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
                    className="min-h-[400px] font-mono text-sm bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  className="bg-gradient-primary border-0" 
                  onClick={formatJSON}
                  disabled={!input}
                >
                  Format
                </Button>
                <Button 
                  variant="outline"
                  onClick={minifyJSON}
                  disabled={!input}
                >
                  Minify
                </Button>
                <Button 
                  variant="outline"
                  onClick={validateJSON}
                  disabled={!input}
                >
                  Validate
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

export default JSONFormatter;
