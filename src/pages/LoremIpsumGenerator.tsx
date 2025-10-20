import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";

const LoremIpsumGenerator = () => {
  useToolTracking("Lorem Ipsum Generator");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [count, setCount] = useState([3]);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generated, setGenerated] = useState("");

  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
    "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat",
    "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse",
    "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
    "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
    "mollit", "anim", "id", "est", "laborum"
  ];

  const generateWords = (num: number): string => {
    const words: string[] = [];
    if (startWithLorem && num > 0) {
      words.push("Lorem", "ipsum", "dolor", "sit", "amet");
      num -= 5;
    }
    for (let i = 0; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(" ");
  };

  const generateSentence = (): string => {
    const length = Math.floor(Math.random() * 10) + 5;
    const words = generateWords(length);
    return words.charAt(0).toUpperCase() + words.slice(1) + ".";
  };

  const generateParagraph = (): string => {
    const numSentences = Math.floor(Math.random() * 4) + 3;
    const sentences: string[] = [];
    for (let i = 0; i < numSentences; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  };

  const generate = () => {
    let result = "";
    const amount = count[0];

    switch (unit) {
      case "words":
        result = generateWords(amount);
        break;
      case "sentences":
        for (let i = 0; i < amount; i++) {
          result += generateSentence() + " ";
        }
        break;
      case "paragraphs":
        const paragraphs: string[] = [];
        for (let i = 0; i < amount; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join("\n\n");
        break;
    }

    setGenerated(result.trim());
  };

  const copy = () => {
    navigator.clipboard.writeText(generated);
    toast({
      title: "Copied!",
      description: "Lorem ipsum text copied to clipboard",
    });
  };

  const presets = [
    { name: "Short (1 paragraph)", count: 1, unit: "paragraphs" as const },
    { name: "Medium (3 paragraphs)", count: 3, unit: "paragraphs" as const },
    { name: "Long (5 paragraphs)", count: 5, unit: "paragraphs" as const },
    { name: "100 words", count: 100, unit: "words" as const },
    { name: "10 sentences", count: 10, unit: "sentences" as const },
  ];

  const loadPreset = (preset: typeof presets[0]) => {
    setCount([preset.count]);
    setUnit(preset.unit);
  };

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
            { title: "Choose Type", description: "Select Paragraphs, Sentences, or Words format." },
            { title: "Set Quantity", description: "Use the slider to choose how much placeholder text to generate." },
            { title: "Use Presets", description: "Quick options for small, medium, or large text blocks." },
            { title: "Copy Text", description: "Copy generated lorem ipsum for mockups, designs, or testing." }
          ]}
          tips={[
            { text: "Lorem ipsum is standard placeholder text since the 1500s" },
            { text: "Perfect for design mockups and content placeholders" },
            { text: "Word count helps estimate content length for layouts" },
            { text: "Use paragraphs for body text, sentences for headlines" }
          ]}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Lorem Ipsum Generator
            </CardTitle>
            <CardDescription>
              Generate placeholder text for your designs, mockups, and prototypes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Generate</Label>
                <Select value={unit} onValueChange={(value: any) => setUnit(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Count: {count[0]}</Label>
                <Slider
                  value={count}
                  onValueChange={setCount}
                  min={1}
                  max={unit === "words" ? 500 : unit === "sentences" ? 50 : 10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="startWithLorem"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="startWithLorem" className="cursor-pointer">
                Start with "Lorem ipsum dolor sit amet"
              </Label>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button onClick={generate} className="w-full" size="lg">
              Generate Lorem Ipsum
            </Button>

            {/* Output */}
            {generated && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Generated Text ({generated.split(/\s+/).length} words)</Label>
                  <Button onClick={copy} size="sm" variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={generated}
                  readOnly
                  className="min-h-[400px] font-serif text-base leading-relaxed"
                />
              </div>
            )}

            {/* Info */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">About Lorem Ipsum</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s. 
                  It's used to fill space when the actual content is not yet available, allowing designers 
                  to focus on layout and visual elements without being distracted by meaningful content.
                </p>
                <p className="mt-2">
                  <strong>Common Uses:</strong> Website mockups, design prototypes, typography samples, 
                  print layouts, and content placeholders.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoremIpsumGenerator;
