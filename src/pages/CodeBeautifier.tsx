import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";`nimport HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const CodeBeautifier = () => {
  useToolTracking("Code Beautifier");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [htmlInput, setHtmlInput] = useState("");
  const [cssInput, setCssInput] = useState("");
  const [jsInput, setJsInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [cssOutput, setCssOutput] = useState("");
  const [jsOutput, setJsOutput] = useState("");

  const beautifyHTML = (html: string): string => {
    let formatted = html;
    let indent = 0;
    const tab = "  ";
    
    formatted = formatted.replace(/>\s*</g, '><');
    
    const tokens = formatted.split(/(<[^>]+>)/g).filter(Boolean);
    const result: string[] = [];
    
    tokens.forEach(token => {
      if (token.match(/^<\/\w/)) {
        indent = Math.max(0, indent - 1);
      }
      
      if (token.match(/^<\w[^>]*[^\/]>$/)) {
        result.push(tab.repeat(indent) + token);
        indent++;
      } else if (token.match(/^<\w[^>]*\/>$/)) {
        result.push(tab.repeat(indent) + token);
      } else if (token.match(/^<\/\w/)) {
        result.push(tab.repeat(indent) + token);
      } else if (token.trim()) {
        result.push(tab.repeat(indent) + token.trim());
      }
    });
    
    return result.join('\n');
  };

  const beautifyCSS = (css: string): string => {
    let formatted = css;
    
    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/\s*{\s*/g, ' {\n  ');
    formatted = formatted.replace(/\s*}\s*/g, '\n}\n');
    formatted = formatted.replace(/\s*;\s*/g, ';\n  ');
    formatted = formatted.replace(/\s*:\s*/g, ': ');
    formatted = formatted.replace(/,\s*/g, ', ');
    formatted = formatted.trim();
    
    return formatted;
  };

  const beautifyJS = (js: string): string => {
    let formatted = js;
    let indent = 0;
    const tab = "  ";
    
    // Remove extra spaces
    formatted = formatted.replace(/\s+/g, ' ');
    
    // Add line breaks after semicolons and braces
    formatted = formatted.replace(/;/g, ';\n');
    formatted = formatted.replace(/{/g, '{\n');
    formatted = formatted.replace(/}/g, '\n}\n');
    formatted = formatted.replace(/,/g, ',\n');
    
    // Apply indentation
    const lines = formatted.split('\n');
    const result: string[] = [];
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      if (line.startsWith('}')) {
        indent = Math.max(0, indent - 1);
      }
      
      result.push(tab.repeat(indent) + line);
      
      if (line.endsWith('{')) {
        indent++;
      }
    });
    
    return result.join('\n');
  };

  const handleBeautifyHTML = () => {
    try {
      const beautified = beautifyHTML(htmlInput);
      setHtmlOutput(beautified);
      toast({
        title: "HTML Formatted!",
        description: "Your HTML code has been beautified",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format HTML",
        variant: "destructive",
      });
    }
  };

  const handleBeautifyCSS = () => {
    try {
      const beautified = beautifyCSS(cssInput);
      setCssOutput(beautified);
      toast({
        title: "CSS Formatted!",
        description: "Your CSS code has been beautified",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format CSS",
        variant: "destructive",
      });
    }
  };

  const handleBeautifyJS = () => {
    try {
      const beautified = beautifyJS(jsInput);
      setJsOutput(beautified);
      toast({
        title: "JavaScript Formatted!",
        description: "Your JavaScript code has been beautified",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format JavaScript",
        variant: "destructive",
      });
    }
  };

  const copyOutput = (output: string, type: string) => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: `${type} code copied to clipboard`,
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

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Code Beautifier</CardTitle>
              <CardDescription>Format HTML, CSS, and JavaScript code</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Input HTML</label>
                      <Textarea
                        placeholder="<div><p>Your HTML here...</p></div>"
                        value={htmlInput}
                        onChange={(e) => setHtmlInput(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Formatted HTML</label>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyOutput(htmlOutput, "HTML")}
                          disabled={!htmlOutput}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={htmlOutput}
                        readOnly
                        className="min-h-[400px] font-mono text-sm bg-muted"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary border-0" 
                    onClick={handleBeautifyHTML}
                    disabled={!htmlInput}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Format HTML
                  </Button>
                </TabsContent>

                <TabsContent value="css" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Input CSS</label>
                      <Textarea
                        placeholder=".class{color:red;margin:0;}"
                        value={cssInput}
                        onChange={(e) => setCssInput(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Formatted CSS</label>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyOutput(cssOutput, "CSS")}
                          disabled={!cssOutput}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={cssOutput}
                        readOnly
                        className="min-h-[400px] font-mono text-sm bg-muted"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary border-0" 
                    onClick={handleBeautifyCSS}
                    disabled={!cssInput}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Format CSS
                  </Button>
                </TabsContent>

                <TabsContent value="javascript" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Input JavaScript</label>
                      <Textarea
                        placeholder="function test(){console.log('Hello');}"
                        value={jsInput}
                        onChange={(e) => setJsInput(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Formatted JavaScript</label>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyOutput(jsOutput, "JavaScript")}
                          disabled={!jsOutput}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={jsOutput}
                        readOnly
                        className="min-h-[400px] font-mono text-sm bg-muted"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary border-0" 
                    onClick={handleBeautifyJS}
                    disabled={!jsInput}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Format JavaScript
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Automatically formats messy code</li>
                  <li>• Adds proper indentation</li>
                  <li>• Works offline in your browser</li>
                  <li>• No code is sent to any server</li>
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

export default CodeBeautifier;
