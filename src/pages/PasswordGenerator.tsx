import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, ArrowLeft, Check, Shield, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import SEO from "@/components/SEO";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percentage: number;
}

const PasswordGenerator = () => {
  useToolTracking("Password Generator");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("GeneratePassword123!");
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [includeCustom, setIncludeCustom] = useState(false);
  const [customChars, setCustomChars] = useState("");
  const [requireAll, setRequireAll] = useState(true);
  const [numPasswords, setNumPasswords] = useState(1);
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: "", color: "", percentage: 0 });

  const calculateStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    let checks = 0;

    // Length check
    if (pwd.length >= 8) checks++;
    if (pwd.length >= 12) checks++;
    if (pwd.length >= 16) checks++;

    // Character variety checks
    if (/[a-z]/.test(pwd)) checks++;
    if (/[A-Z]/.test(pwd)) checks++;
    if (/[0-9]/.test(pwd)) checks++;
    if (/[^a-zA-Z0-9]/.test(pwd)) checks++;

    // Pattern checks (negative)
    if (/(.)\1{2,}/.test(pwd)) checks--; // Repeated characters
    if (/^[a-zA-Z]+$/.test(pwd)) checks--; // Only letters
    if (/^[0-9]+$/.test(pwd)) checks--; // Only numbers

    score = Math.max(0, Math.min(checks, 7));

    const percentage = (score / 7) * 100;

    if (score <= 2) return { score, label: "Weak", color: "text-red-600", percentage };
    if (score <= 4) return { score, label: "Fair", color: "text-orange-600", percentage };
    if (score <= 5) return { score, label: "Good", color: "text-yellow-600", percentage };
    if (score <= 6) return { score, label: "Strong", color: "text-blue-600", percentage };
    return { score, label: "Very Strong", color: "text-green-600", percentage };
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    const ambiguous = "il1Lo0O";

    let chars = "";
    let required = "";

    if (includeUppercase) {
      chars += uppercase;
      if (requireAll) required += uppercase;
    }
    if (includeLowercase) {
      chars += lowercase;
      if (requireAll) required += lowercase;
    }
    if (includeNumbers) {
      chars += numbers;
      if (requireAll) required += numbers;
    }
    if (includeSymbols) {
      chars += symbols;
      if (requireAll) required += symbols;
    }
    if (includeCustom && customChars) {
      chars += customChars;
    }

    if (excludeAmbiguous) {
      chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
    }

    if (chars === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    const newPasswords: string[] = [];

    for (let p = 0; p < numPasswords; p++) {
      let newPassword = "";
      
      // Add required characters first if enabled
      if (requireAll && required) {
        const charTypes = [
          includeUppercase ? uppercase : "",
          includeLowercase ? lowercase : "",
          includeNumbers ? numbers : "",
          includeSymbols ? symbols : ""
        ].filter(Boolean);

        for (const charType of charTypes) {
          if (charType) {
            newPassword += charType.charAt(Math.floor(Math.random() * charType.length));
          }
        }
      }

      // Fill the rest randomly
      while (newPassword.length < length[0]) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Shuffle the password
      newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
      
      newPasswords.push(newPassword);
    }

    if (numPasswords === 1) {
      setPassword(newPasswords[0]);
    } else {
      setPasswords(newPasswords);
    }

    toast({
      title: "Generated!",
      description: `${numPasswords} password(s) generated`,
    });
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: index !== undefined ? `Password #${index + 1} copied` : "Password copied to clipboard",
    });
  };

  const getStrengthIcon = () => {
    if (strength.score <= 2) return <X className="h-5 w-5" />;
    if (strength.score <= 4) return <AlertTriangle className="h-5 w-5" />;
    return <Shield className="h-5 w-5" />;
  };

  const getStrengthColor = () => {
    if (strength.score <= 2) return "bg-red-500";
    if (strength.score <= 4) return "bg-orange-500";
    if (strength.score <= 5) return "bg-yellow-500";
    if (strength.score <= 6) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Password Generator"
        description="Generate strong, unique passwords with customizable length, character sets and bulk options. Includes strength meter and best practices."
        keywords="password generator, strong password, password strength, password manager, secure passwords"
      />
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
                title: "Choose Mode",
                description: "Select Single Password for one strong password, or Bulk Generate to create multiple passwords at once."
              },
              {
                title: "Set Length",
                description: "Use the slider to set password length. 16+ characters recommended for strong security."
              },
              {
                title: "Select Character Types",
                description: "Enable uppercase, lowercase, numbers, and symbols. More variety means stronger passwords."
              },
              {
                title: "Generate & Copy",
                description: "Click Generate to create your password. Use the copy button to add it to clipboard. Check the strength meter for security level."
              }
            ]}
            tips={[
              { text: "Use at least 16 characters for maximum security" },
              { text: "Include all character types for stronger passwords" },
              { text: "Avoid common patterns and dictionary words" },
              { text: "Use Passphrase mode for memorable yet secure passwords" },
              { text: "Never reuse passwords across different accounts" }
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
            {/* Settings Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-3xl">Advanced Password Generator</CardTitle>
                <CardDescription>Generate ultra-secure passwords with custom options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="single" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single" onClick={() => setNumPasswords(1)}>Single Password</TabsTrigger>
                    <TabsTrigger value="bulk" onClick={() => setNumPasswords(5)}>Bulk Generate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-6 mt-6">
                    {/* Password Display */}
                    <div className="space-y-3">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="font-mono text-lg break-all flex-1">{password}</div>
                          <Button size="icon" variant="ghost" onClick={() => copyToClipboard(password)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Strength Meter */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getStrengthIcon()}
                              <span className={`font-medium ${strength.color}`}>
                                {strength.label || "Generate a password"}
                              </span>
                            </div>
                            <Badge variant="outline">{length[0]} characters</Badge>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                              style={{ width: `${strength.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password Analysis */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Has Uppercase</span>
                          {/[A-Z]/.test(password) ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Has Lowercase</span>
                          {/[a-z]/.test(password) ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Has Numbers</span>
                          {/[0-9]/.test(password) ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Has Symbols</span>
                          {/[^a-zA-Z0-9]/.test(password) ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                    </div>

                    {/* Length Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Password Length</Label>
                        <Badge variant="secondary">{length[0]} characters</Badge>
                      </div>
                      <Slider
                        value={length}
                        onValueChange={setLength}
                        min={8}
                        max={128}
                        step={1}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Weak (8)</span>
                        <span>Recommended (16+)</span>
                        <span>Maximum (128)</span>
                      </div>
                    </div>

                    {/* Character Options */}
                    <div className="space-y-3">
                      <Label>Character Types</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="uppercase"
                            checked={includeUppercase}
                            onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                          />
                          <Label htmlFor="uppercase" className="cursor-pointer">Uppercase (A-Z)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="lowercase"
                            checked={includeLowercase}
                            onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                          />
                          <Label htmlFor="lowercase" className="cursor-pointer">Lowercase (a-z)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="numbers"
                            checked={includeNumbers}
                            onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                          />
                          <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="symbols"
                            checked={includeSymbols}
                            onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                          />
                          <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-3">
                      <Label>Advanced Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="exclude-ambiguous"
                            checked={excludeAmbiguous}
                            onCheckedChange={(checked) => setExcludeAmbiguous(checked as boolean)}
                          />
                          <Label htmlFor="exclude-ambiguous" className="cursor-pointer text-sm">
                            Exclude ambiguous characters (i, l, 1, L, o, 0, O)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="require-all"
                            checked={requireAll}
                            onCheckedChange={(checked) => setRequireAll(checked as boolean)}
                          />
                          <Label htmlFor="require-all" className="cursor-pointer text-sm">
                            Require at least one character from each selected type
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="custom-chars"
                            checked={includeCustom}
                            onCheckedChange={(checked) => setIncludeCustom(checked as boolean)}
                          />
                          <Label htmlFor="custom-chars" className="cursor-pointer text-sm">
                            Include custom characters
                          </Label>
                        </div>

                        {includeCustom && (
                          <Input
                            placeholder="Enter custom characters..."
                            value={customChars}
                            onChange={(e) => setCustomChars(e.target.value)}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary border-0" 
                      size="lg"
                      onClick={generatePassword}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New Password
                    </Button>
                  </TabsContent>

                  <TabsContent value="bulk" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label>Number of Passwords</Label>
                      <Slider
                        value={[numPasswords]}
                        onValueChange={(val) => setNumPasswords(val[0])}
                        min={2}
                        max={50}
                        step={1}
                      />
                      <p className="text-sm text-muted-foreground">Generate {numPasswords} passwords at once</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Length: {length[0]} characters</Label>
                      <Slider
                        value={length}
                        onValueChange={setLength}
                        min={8}
                        max={64}
                        step={1}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bulk-upper" checked={includeUppercase} onCheckedChange={(c) => setIncludeUppercase(c as boolean)} />
                        <Label htmlFor="bulk-upper">A-Z</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bulk-lower" checked={includeLowercase} onCheckedChange={(c) => setIncludeLowercase(c as boolean)} />
                        <Label htmlFor="bulk-lower">a-z</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bulk-num" checked={includeNumbers} onCheckedChange={(c) => setIncludeNumbers(c as boolean)} />
                        <Label htmlFor="bulk-num">0-9</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bulk-sym" checked={includeSymbols} onCheckedChange={(c) => setIncludeSymbols(c as boolean)} />
                        <Label htmlFor="bulk-sym">!@#$</Label>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary border-0" 
                      size="lg"
                      onClick={generatePassword}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate {numPasswords} Passwords
                    </Button>

                    {passwords.length > 0 && (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {passwords.map((pwd, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="shrink-0">#{index + 1}</Badge>
                              <code className="flex-1 text-sm break-all">{pwd}</code>
                              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(pwd, index)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Long-form explanatory content for SEO & AdSense (600+ words) */}
            <div className="prose max-w-4xl mx-auto mt-8 text-sm text-muted-foreground">
              <h2>About the Password Generator</h2>
              <p>
                Strong, unique passwords are one of the simplest and most effective
                defenses against account takeover. The Password Generator on SmartKit.tech
                is built to help you create credentials that are resilient to modern attacks
                — without needing to memorize complex strings. Whether you are securing a
                bank account, an email address, or a throwaway test account, this tool
                provides configurable options so you can tailor entropy, length, and
                character sets to meet both personal needs and site-specific policies.
              </p>

              <h3>What makes a password strong?</h3>
              <p>
                A password's strength is measured by entropy — effectively the unpredictability
                of the character sequence. Length and variety of character types (uppercase,
                lowercase, numbers, symbols) increase entropy exponentially. For example,
                increasing length from 8 to 16 characters and including multiple character
                classes dramatically increases the number of possible combinations, making
                brute-force attacks infeasible for practical purposes.
              </p>

              <h3>How this tool generates secure passwords</h3>
              <p>
                This generator builds a character pool based on your selected options and
                samples characters uniformly at random from that pool. If you enable the
                "require each type" option, the generator ensures at least one character
                from each selected class is included — a useful measure for websites that
                enforce complexity rules. You can exclude ambiguous characters (like l, 1,
                O, 0) to reduce transcription errors when manually entering passwords.
              </p>

              <h3>Recommended settings & practical tips</h3>
              <p>
                For most users, we recommend a minimum of 16 characters with all character
                types enabled. Passphrases (longer sequences of words) are also an excellent
                option when memorability is important; a trustworthy password manager can
                store these for you. Avoid reusing passwords across services — if one site is
                compromised, reused passwords allow attackers to pivot. Use the bulk
                generation feature when creating login credentials for teams; export the
                results directly into a secure password manager or encrypted vault, and
                rotate those credentials regularly.
              </p>

              <h3>Real-world examples</h3>
              <p>
                Example strong password (random): <code>g7#fV9q!zR2mT%hL</code><br />
                Example passphrase (memorable): <em>maple+river*blue!76</em><br />
                Both of these exceed common minimums and avoid dictionary phrases that are
                vulnerable to targeted guessing.
              </p>

              <h3>Security considerations and privacy</h3>
              <p>
                All generation in this tool happens locally in your browser — nothing is
                transmitted to our servers — which reduces exposure and preserves your
                privacy. Nevertheless, be cautious with bulk exports: do not email plain
                text lists or store passwords in unencrypted cloud storage. For teams,
                integrate with a dedicated password manager that supports secure sharing and
                access controls.
              </p>

              <h3>When to use passphrases vs. complex passwords</h3>
              <p>
                Use passphrases when you need something easier to remember but still highly
                secure; combine unrelated words, punctuation, and numbers (e.g.,
                "Velvet+Coffee*42!River"). Use randomized complex passwords for services where
                machine-generated credentials are acceptable and you rely on a password
                manager to store them. Both approaches are valid; the key is uniqueness and
                sufficient length.
              </p>

              <h3>Related tools and next steps</h3>
              <p>
                For related utilities, see our <a href="/qr-generator">QR Generator</a> to
                create secure QR-based credentials and our <a href="/image-compressor">Image Compressor</a>
                to optimize images for documentation and onboarding. For compliance and
                policies, consult our <a href="/privacy-policy">Privacy Policy</a> and
                <a href="/terms">Terms of Service</a>. If you want help integrating this
                tool into a team workflow or hiding API keys server-side, visit the
                <a href="/contact">Contact</a> page to get in touch.
              </p>
            </div>

            {/* Info Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-green-900 mb-2">✅ Best Practices</p>
                  <ul className="space-y-1 text-green-800 text-xs list-disc list-inside">
                    <li>Use 16+ characters</li>
                    <li>Mix all character types</li>
                    <li>Unique for each account</li>
                    <li>Use a password manager</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-medium text-red-900 mb-2">❌ Never Do</p>
                  <ul className="space-y-1 text-red-800 text-xs list-disc list-inside">
                    <li>Reuse passwords</li>
                    <li>Use personal info</li>
                    <li>Share with others</li>
                    <li>Store in plain text</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2">💡 How Long to Crack?</p>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div className="flex justify-between">
                      <span>8 chars (simple):</span>
                      <span className="font-medium">Instant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12 chars (mixed):</span>
                      <span className="font-medium">200 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>16 chars (mixed):</span>
                      <span className="font-medium">1B+ years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-medium text-purple-900 mb-2">🔒 Privacy</p>
                  <p className="text-xs text-purple-800">
                    All passwords are generated locally in your browser. Nothing is sent to any server.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordGenerator;
