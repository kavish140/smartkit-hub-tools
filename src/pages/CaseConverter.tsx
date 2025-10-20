import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";

const CaseConverter = () => {
  useToolTracking("Case Converter");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [input, setInput] = useState("hello world example text");
  
  const toCamelCase = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
  };

  const toPascalCase = (text: string): string => {
    const camel = toCamelCase(text);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const toSnakeCase = (text: string): string => {
    return text
      .replace(/([A-Z])/g, "_$1")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
  };

  const toKebabCase = (text: string): string => {
    return text
      .replace(/([A-Z])/g, "-$1")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  };

  const toConstantCase = (text: string): string => {
    return toSnakeCase(text).toUpperCase();
  };

  const toDotCase = (text: string): string => {
    return text
      .replace(/([A-Z])/g, ".$1")
      .replace(/[^a-zA-Z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .toLowerCase();
  };

  const toPathCase = (text: string): string => {
    return text
      .replace(/([A-Z])/g, "/$1")
      .replace(/[^a-zA-Z0-9]+/g, "/")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
  };

  const toTitleCase = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const toSentenceCase = (text: string): string => {
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const conversions = [
    { name: "camelCase", convert: toCamelCase, desc: "First word lowercase, rest capitalized" },
    { name: "PascalCase", convert: toPascalCase, desc: "All words capitalized, no spaces" },
    { name: "snake_case", convert: toSnakeCase, desc: "Lowercase with underscores" },
    { name: "kebab-case", convert: toKebabCase, desc: "Lowercase with hyphens" },
    { name: "CONSTANT_CASE", convert: toConstantCase, desc: "Uppercase with underscores" },
    { name: "dot.case", convert: toDotCase, desc: "Lowercase with dots" },
    { name: "path/case", convert: toPathCase, desc: "Lowercase with slashes" },
    { name: "Title Case", convert: toTitleCase, desc: "Each word capitalized" },
    { name: "Sentence case", convert: toSentenceCase, desc: "First letter capitalized" },
    { name: "lowercase", convert: (text: string) => text.toLowerCase(), desc: "All lowercase" },
    { name: "UPPERCASE", convert: (text: string) => text.toUpperCase(), desc: "All uppercase" },
  ];

  const copyResult = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${name} text copied to clipboard`,
    });
  };

  const examples = [
    "hello world example",
    "getUserById",
    "user_profile_data",
    "my-component-name",
    "CONSTANT_VALUE",
    "This is a sentence",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* How to Use Guide */}
        <HowToUse
          steps={[
            { title: "Enter Text", description: "Type or paste your text into the input area." },
            { title: "Choose Conversion", description: "Click any of the 11 conversion buttons to transform your text." },
            { title: "Preview Result", description: "See the converted text instantly in the output area." },
            { title: "Copy Format", description: "One-click copy to use the converted text anywhere." }
          ]}
          tips={[
            { text: "camelCase and PascalCase common for programming" },
            { text: "snake_case popular in Python and databases" },
            { text: "kebab-case used in URLs and CSS classes" },
            { text: "SCREAMING_SNAKE_CASE for constants" }
          ]}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-6 w-6" />
              Case Converter
            </CardTitle>
            <CardDescription>
              Convert text between different naming conventions and cases instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Text</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert..."
                className="min-h-[100px] text-base"
              />
            </div>

            {/* Example Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Try Examples:</label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Conversion Results */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Conversions:</label>
              <div className="grid grid-cols-1 gap-3">
                {conversions.map((conversion) => (
                  <Card key={conversion.name} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{conversion.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {conversion.desc}
                            </span>
                          </div>
                          <code className="block bg-background p-3 rounded font-mono text-sm break-all">
                            {conversion.convert(input)}
                          </code>
                        </div>
                        <Button
                          onClick={() => copyResult(conversion.convert(input), conversion.name)}
                          size="sm"
                          variant="ghost"
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-1">Programming:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li><strong>camelCase:</strong> JavaScript variables, methods</li>
                      <li><strong>PascalCase:</strong> Class names, components</li>
                      <li><strong>snake_case:</strong> Python, Ruby, SQL</li>
                      <li><strong>CONSTANT_CASE:</strong> Constants, env variables</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Web & Files:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li><strong>kebab-case:</strong> URLs, CSS classes, filenames</li>
                      <li><strong>dot.case:</strong> Package names, namespaces</li>
                      <li><strong>path/case:</strong> File paths, routes</li>
                      <li><strong>Title Case:</strong> Headings, titles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CaseConverter;
