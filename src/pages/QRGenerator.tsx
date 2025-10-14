import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const QRGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!text.trim()) return;
    // Using QR Server API (free, no key required)
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    setQrUrl(url);
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
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

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">QR Code Generator</CardTitle>
              <CardDescription>Create custom QR codes for URLs, text, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-text">Enter Text or URL</Label>
                <Input
                  id="qr-text"
                  placeholder="https://example.com or any text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateQR()}
                />
              </div>

              <Button 
                className="w-full bg-gradient-primary border-0" 
                size="lg"
                onClick={generateQR}
                disabled={!text.trim()}
              >
                Generate QR Code
              </Button>

              {qrUrl && (
                <div className="space-y-4">
                  <div className="bg-muted p-8 rounded-lg flex justify-center">
                    <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={downloadQR}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
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

export default QRGenerator;
