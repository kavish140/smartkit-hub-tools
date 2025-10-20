import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const TextCounter = () => {
  useToolTracking("Text Counter");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: "0 min",
  });

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split("\n").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200) || 0;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      sentences,
      paragraphs,
      readingTime: `${readingTime} min`,
    });
  }, [text]);

  const copyStats = () => {
    const statsText = `
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime}
    `.trim();
    
    navigator.clipboard.writeText(statsText);
    toast({
      title: "Copied!",
      description: "Statistics copied to clipboard",
    });
  };

  const clearText = () => {
    setText("");
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
              {
                title: "Enter or Paste Text",
                description: "Type or paste your text into the text area. Statistics update automatically as you type."
              },
              {
                title: "View Statistics",
                description: "See real-time counts for characters, words, sentences, paragraphs, and estimated reading time."
              },
              {
                title: "Copy Statistics",
                description: "Click the copy button to copy all statistics to your clipboard for easy sharing or documentation."
              },
              {
                title: "Clear Text",
                description: "Use the clear button to remove all text and start fresh with a new document."
              }
            ]}
            tips={[
              { text: "Reading time is calculated at 200 words per minute (average reading speed)" },
              { text: "Works great for blog posts, essays, and social media content" },
              { text: "Character count includes spaces and punctuation" },
              { text: "Perfect for meeting character limits on platforms like Twitter" }
            ]}
          />

          <Card className="max-w-4xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Text Counter</CardTitle>
              <CardDescription>Count words, characters, and analyze your text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] font-mono"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.characters}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.charactersNoSpaces}</div>
                  <div className="text-sm text-muted-foreground">No Spaces</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.lines}</div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.sentences}</div>
                  <div className="text-sm text-muted-foreground">Sentences</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{stats.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center col-span-2">
                  <div className="text-3xl font-bold text-primary">{stats.readingTime}</div>
                  <div className="text-sm text-muted-foreground">Reading Time</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={copyStats}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Stats
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={clearText}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Clear Text
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

export default TextCounter;
