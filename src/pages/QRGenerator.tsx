import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Upload, Palette, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import QRCodeLib from "qrcode";

const QRGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  
  // Customization options
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(20);
  const [cornerStyle, setCornerStyle] = useState("square");
  const [dotStyle, setDotStyle] = useState("square");
  
  const generateQR = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = size;
      canvas.height = size;

      // Generate QR code using qrcode library
      await QRCodeLib.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
      });

      // Add logo if provided
      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
          const logoSizePixels = (size * logoSize) / 100;
          const x = (size - logoSizePixels) / 2;
          const y = (size - logoSizePixels) / 2;
          
          // Draw white background for logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
          
          // Draw logo
          ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
          setQrGenerated(true);
          
          toast({
            title: "Success!",
            description: "QR code generated with logo",
          });
        };
      } else {
        setQrGenerated(true);
        toast({
          title: "Success!",
          description: "QR code generated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadQR = (format: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode.${format}`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: `QR code downloaded as ${format.toUpperCase()}`,
        });
      }, `image/${format}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive"
      });
    }
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

          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Settings className="h-7 w-7" />
                  QR Code Generator
                </CardTitle>
                <CardDescription>Create fully customized QR codes with logo, colors, and styles</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qr-text">Text or URL</Label>
                      <Input
                        id="qr-text"
                        placeholder="https://example.com or any text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && generateQR()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Error Correction Level</Label>
                      <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Size: {size}px</Label>
                      <Slider
                        value={[size]}
                        onValueChange={(value) => setSize(value[0])}
                        min={200}
                        max={1000}
                        step={50}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fg-color">Foreground Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="fg-color"
                            type="color"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bg-color">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="bg-color"
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Corner Style</Label>
                      <Select value={cornerStyle} onValueChange={setCornerStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dot Style</Label>
                      <Select value={dotStyle} onValueChange={setDotStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="logo" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo-upload">Upload Logo</Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      {logo && (
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo preview" className="w-16 h-16 object-contain border rounded" />
                          <Button variant="outline" size="sm" onClick={() => setLogo(null)}>
                            Remove Logo
                          </Button>
                        </div>
                      )}
                    </div>

                    {logo && (
                      <div className="space-y-2">
                        <Label>Logo Size: {logoSize}%</Label>
                        <Slider
                          value={[logoSize]}
                          onValueChange={(value) => setLogoSize(value[0])}
                          min={10}
                          max={40}
                          step={5}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <Button 
                  className="w-full bg-gradient-primary border-0 mt-6" 
                  size="lg"
                  onClick={generateQR}
                  disabled={!text.trim()}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Generate Custom QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Preview & Download</CardTitle>
                <CardDescription>Your customized QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-8 rounded-lg flex justify-center items-center min-h-[400px]">
                  {qrGenerated ? (
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full border-2 border-border rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Configure your QR code and click generate</p>
                    </div>
                  )}
                </div>

                {qrGenerated && (
                  <div className="space-y-2">
                    <Label>Download Format</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => downloadQR('png')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PNG
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => downloadQR('jpeg')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JPEG
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => downloadQR('webp')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        WEBP
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QRGenerator;
