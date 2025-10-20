import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, CheckCircle2, XCircle, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";

interface Match {
  text: string;
  index: number;
  groups?: string[];
}

const RegexTester = () => {
  useToolTracking("Regex Tester");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pattern, setPattern] = useState("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("Contact us at support@example.com or sales@company.org for more info.");
  const [matches, setMatches] = useState<Match[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches: Match[] = [];
      let match;
      
      while ((match = regex.exec(testString)) !== null) {
        foundMatches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (!flags.includes("g")) break;
      }
      
      setMatches(foundMatches);
      setIsValid(true);
      setError("");
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      setMatches([]);
    }
  };

  const highlightMatches = (): JSX.Element[] => {
    if (matches.length === 0) {
      return [<span key="no-match">{testString}</span>];
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {testString.substring(lastIndex, match.index)}
          </span>
        );
      }
      parts.push(
        <mark key={`match-${idx}`} className="bg-yellow-300 dark:bg-yellow-700 px-1 rounded">
          {match.text}
        </mark>
      );
      lastIndex = match.index + match.text.length;
    });

    if (lastIndex < testString.length) {
      parts.push(
        <span key="text-end">{testString.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

  const commonPatterns = [
    { name: "Email", pattern: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", flags: "gi" },
    { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", flags: "gi" },
    { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}", flags: "g" },
    { name: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
    { name: "Hex Color", pattern: "#[0-9A-Fa-f]{6}\\b|#[0-9A-Fa-f]{3}\\b", flags: "g" },
    { name: "Date (MM/DD/YYYY)", pattern: "\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12]\\d|3[01])\\/\\d{4}\\b", flags: "g" },
    { name: "Time (HH:MM)", pattern: "\\b([01]?\\d|2[0-3]):[0-5]\\d\\b", flags: "g" },
    { name: "Credit Card", pattern: "\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b", flags: "g" },
    { name: "Username", pattern: "@[a-zA-Z0-9_]{1,15}", flags: "g" },
    { name: "Hashtag", pattern: "#[a-zA-Z0-9_]+", flags: "g" },
  ];

  const loadPattern = (p: typeof commonPatterns[0]) => {
    setPattern(p.pattern);
    setFlags(p.flags);
  };

  const copyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    toast({
      title: "Copied!",
      description: "Regex pattern copied to clipboard",
    });
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6" />
              Regex Tester
            </CardTitle>
            <CardDescription>
              Test and debug regular expressions with live matching and highlighting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pattern Input */}
            <div className="space-y-2">
              <Label>Regular Expression Pattern</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 bg-background">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern..."
                    className="border-0 focus-visible:ring-0 font-mono text-sm"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="gim"
                    className="border-0 focus-visible:ring-0 w-16 font-mono text-sm"
                  />
                </div>
                <Button onClick={copyRegex} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {!isValid && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Flags: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), y (sticky)
              </p>
            </div>

            {/* Test String */}
            <div className="space-y-2">
              <Label>Test String</Label>
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Test Button */}
            <Button onClick={testRegex} className="w-full" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Test Regex
            </Button>

            {/* Results */}
            {isValid && (
              <>
                <Card className={matches.length > 0 ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-orange-500 bg-orange-50 dark:bg-orange-950"}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      {matches.length > 0 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="font-semibold">
                            {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          <span className="font-semibold">No matches found</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Highlighted Text */}
                {matches.length > 0 && (
                  <div className="space-y-2">
                    <Label>Highlighted Matches</Label>
                    <div className="border rounded-lg p-4 bg-background font-mono text-sm whitespace-pre-wrap">
                      {highlightMatches()}
                    </div>
                  </div>
                )}

                {/* Match Details */}
                {matches.length > 0 && (
                  <div className="space-y-2">
                    <Label>Match Details</Label>
                    <div className="space-y-2">
                      {matches.map((match, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="font-semibold">Match {idx + 1}:</span>
                                <code className="bg-muted px-2 py-1 rounded">{match.text}</code>
                              </div>
                              <div className="text-muted-foreground">
                                Position: {match.index} - {match.index + match.text.length}
                              </div>
                              {match.groups && match.groups.length > 0 && (
                                <div>
                                  <span className="font-semibold">Capture Groups:</span>
                                  <div className="ml-4">
                                    {match.groups.map((group, gIdx) => (
                                      <div key={gIdx}>Group {gIdx + 1}: <code className="bg-muted px-1 rounded">{group}</code></div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Common Patterns */}
            <div className="space-y-2">
              <Label>Common Patterns</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {commonPatterns.map((p) => (
                  <Button
                    key={p.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPattern(p)}
                    className="justify-start h-auto p-3 flex-col items-start"
                  >
                    <span className="font-semibold text-sm">{p.name}</span>
                    <code className="text-xs font-mono text-muted-foreground truncate w-full">
                      /{p.pattern.substring(0, 30)}.../{p.flags}
                    </code>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Character Classes:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><code className="bg-background px-1 rounded">.</code> - Any character</li>
                    <li><code className="bg-background px-1 rounded">\d</code> - Digit (0-9)</li>
                    <li><code className="bg-background px-1 rounded">\w</code> - Word character</li>
                    <li><code className="bg-background px-1 rounded">\s</code> - Whitespace</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Quantifiers:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><code className="bg-background px-1 rounded">*</code> - 0 or more</li>
                    <li><code className="bg-background px-1 rounded">+</code> - 1 or more</li>
                    <li><code className="bg-background px-1 rounded">?</code> - 0 or 1</li>
                    <li><code className="bg-background px-1 rounded">{`{n,m}`}</code> - Between n and m</li>
                  </ul>
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

export default RegexTester;
