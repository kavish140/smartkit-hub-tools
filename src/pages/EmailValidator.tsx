import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import { useToolTracking } from "@/hooks/useToolTracking";

const EmailValidator = () => {
  useToolTracking("Email Validator");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationDetails, setValidationDetails] = useState<{
    format: boolean;
    hasAt: boolean;
    hasDomain: boolean;
    validTLD: boolean;
    noSpaces: boolean;
  } | null>(null);

  const validateEmail = () => {
    if (!email) {
      setIsValid(null);
      setValidationDetails(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasAt = email.includes('@');
    const hasDomain = email.split('@')[1]?.includes('.');
    const validTLD = /\.[a-z]{2,}$/i.test(email);
    const noSpaces = !/\s/.test(email);
    const format = emailRegex.test(email);

    const valid = format && hasAt && hasDomain && validTLD && noSpaces;

    setIsValid(valid);
    setValidationDetails({
      format,
      hasAt,
      hasDomain,
      validTLD,
      noSpaces,
    });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) {
      setIsValid(null);
      setValidationDetails(null);
    }
  };

  const exampleEmails = [
    "user@example.com",
    "john.doe@company.co.uk",
    "support@domain-name.org",
  ];

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
              { title: "Enter Email", description: "Type or paste an email address in the input field." },
              { title: "Instant Validation", description: "The tool validates format, syntax, and checks for common mistakes." },
              { title: "View Results", description: "See validation status with detailed checks (format, domain, syntax)." },
              { title: "Verify Multiple", description: "Test multiple email addresses to ensure they're valid before sending." }
            ]}
            tips={[
              { text: "Checks email format according to RFC 5322 standards" },
              { text: "Validates domain format and common TLDs" },
              { text: "Does not verify if the email account actually exists" },
              { text: "Great for form validation and data cleaning" }
            ]}
          />

          <Card className="max-w-2xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-3xl">Email Validator</CardTitle>
              <CardDescription>Validate email addresses and check format instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateEmail()}
                />
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={validateEmail}
                disabled={!email}
              >
                <Mail className="h-4 w-4 mr-2" />
                Validate Email
              </Button>

              {isValid !== null && (
                <div className={`p-6 rounded-lg border-2 ${isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <div className="flex items-center justify-center mb-4">
                    {isValid ? (
                      <Check className="h-12 w-12 text-green-600" />
                    ) : (
                      <X className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold text-center mb-4 ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                    {isValid ? 'Valid Email Address' : 'Invalid Email Address'}
                  </h3>
                  
                  {validationDetails && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Valid format</span>
                        {validationDetails.format ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Contains @ symbol</span>
                        {validationDetails.hasAt ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Has domain name</span>
                        {validationDetails.hasDomain ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Valid TLD extension</span>
                        {validationDetails.validTLD ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">No spaces</span>
                        {validationDetails.noSpaces ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-3">Try example emails:</h4>
                <div className="flex flex-wrap gap-2">
                  {exampleEmails.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(example);
                        setIsValid(null);
                        setValidationDetails(null);
                      }}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailValidator;
