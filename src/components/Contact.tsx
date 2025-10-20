import { Mail, Github, Twitter, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a 
                      href="mailto:kavishganatra5@gmail.com" 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      kavishganatra5@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Support</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4 text-center">Connect With Us</h3>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="mailto:kavishganatra5@gmail.com">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <p className="text-sm text-center text-muted-foreground">
                  <strong>Note:</strong> For privacy policy inquiries or data-related questions, 
                  please refer to our{" "}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  page or contact us directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
