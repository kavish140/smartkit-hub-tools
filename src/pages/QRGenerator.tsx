import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Download, Palette, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import QRCode from "qrcode";

const QRGenerator = () => {
  useToolTracking("QR Code Generator");
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
  
  // Validate hex color
  const isValidHex = (v: string) => /^#([0-9a-fA-F]{3}){1,2}$/.test(v.trim());

  // Auto-generate QR code when settings change
  useEffect(() => {
    console.log("useEffect triggered, text:", text);
    if (text.trim()) {
      console.log("Calling generateQR");
      generateQR();
    } else {
      console.log("Text is empty, hiding QR");
      setQrGenerated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, size, fgColor, bgColor, errorCorrection, logo, logoSize, dotStyle, cornerStyle]);
  
  const generateQR = async () => {
    if (!text.trim()) {
      setQrGenerated(false);
      return;
    }

    try {
      // Basic validation
      if (!isValidHex(fgColor) || !isValidHex(bgColor)) {
        toast({
          title: "Invalid color",
          description: "Please use a valid hex color like #000000 or #FFF",
          variant: "destructive",
        });
        setQrGenerated(false);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas ref is null");
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Cannot get canvas context");
        return;
      }

      // Set canvas size
      canvas.width = size;
      canvas.height = size;

      // For rounded styles, we need to apply custom rendering
      if (dotStyle === 'rounded' || dotStyle === 'dots' || cornerStyle !== 'square') {
        // Generate QR code as data URL first to get the matrix
        const qrDataUrl = await QRCode.toDataURL(text, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor
          },
          errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
        });

        // Load the QR image to extract pixel data
        const img = new Image();
        img.src = qrDataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        // Get image data to analyze QR pattern
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, size, size);

        // Calculate module size (size of each QR dot)
        // QR codes have a formula: (version * 4 + 17) modules + margin
        // Estimate modules by sampling
        let moduleSize = 1;
        for (let i = 0; i < size; i++) {
          const idx = (i * size) * 4;
          const r1 = imageData.data[idx];
          const r2 = imageData.data[idx + 4];
          if (Math.abs(r1 - r2) > 100) {
            // Found transition
            let count = 1;
            while (i + count < size) {
              const idx2 = ((i + count) * size) * 4;
              if (Math.abs(imageData.data[idx] - imageData.data[idx2]) < 100) {
                count++;
              } else {
                break;
              }
            }
            moduleSize = count;
            break;
          }
        }

        // Draw QR modules with custom styles
        ctx.fillStyle = fgColor;
        for (let y = 0; y < size; y += moduleSize) {
          for (let x = 0; x < size; x += moduleSize) {
            const idx = (y * size + x) * 4;
            const isDark = imageData.data[idx] < 128;

            if (isDark) {
              // Check if this is a corner detection pattern (position pattern)
              const isCornerPattern = 
                (x < moduleSize * 10 && y < moduleSize * 10) || // Top-left
                (x > size - moduleSize * 10 && y < moduleSize * 10) || // Top-right
                (x < moduleSize * 10 && y > size - moduleSize * 10); // Bottom-left

              if (dotStyle === 'dots') {
                // Draw circular dots
                ctx.beginPath();
                ctx.arc(
                  x + moduleSize / 2,
                  y + moduleSize / 2,
                  moduleSize / 2.5,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              } else if (dotStyle === 'rounded') {
                // Draw rounded squares
                const radius = moduleSize / 4;
                ctx.beginPath();
                ctx.roundRect(x, y, moduleSize, moduleSize, radius);
                ctx.fill();
              } else {
                // Draw square
                ctx.fillRect(x, y, moduleSize, moduleSize);
              }
            }
          }
        }
      } else {
        // Standard square QR code
        await QRCode.toCanvas(canvas, text, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor
          },
          errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
        });
      }

      // Show QR immediately after base draw
      console.log("QR code generated successfully");
      setQrGenerated(true);

      // Add logo if provided
      if (logo) {
        const logoImg = new Image();
        // Helps avoid tainted canvas if a remote image is ever used
        logoImg.crossOrigin = "anonymous";
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
          // QR already shown; nothing else to do
        };
        logoImg.onerror = () => {
          // If logo fails to load, still show QR code
          // QR already shown
        };
      }
    } catch (error: any) {
      console.error(error);
      const message = typeof error?.message === 'string' ? error.message : 'Failed to generate QR code';
      // Common overflow hint when data is too long for the selected EC level
      const hint = /code length overflow/i.test(message)
        ? " Try reducing the Error Correction Level or shortening the content."
        : "";
      toast({
        title: "Generation error",
        description: message + hint,
        variant: "destructive",
      });
      setQrGenerated(false);
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
      if (canvas.toBlob) {
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
      } else {
        // Fallback for very old browsers
        const dataUrl = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode.${format}`;
        link.click();
        toast({
          title: "Success",
          description: `QR code downloaded as ${format.toUpperCase()}`,
        });
      }
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
      <SEO
        title="QR Code Generator"
        description="Create custom QR codes with logos, colors, and error correction options. Download PNG/JPEG/WEBP and use for print or web." 
        keywords="qr code generator, qr maker, custom qr, download qr, qr with logo"
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
                title: "Choose QR Type",
                description: "Select from URL, Text, WiFi, Email, SMS, Phone, or vCard. Each type has specific fields for that format."
              },
              {
                title: "Enter Content",
                description: "Fill in the required information. For URL, enter the web address. For WiFi, provide network name and password."
              },
              {
                title: "Customize Appearance",
                description: "Change foreground and background colors, adjust size, set error correction level, and optionally add a logo."
              },
              {
                title: "Download QR Code",
                description: "Choose your preferred format (PNG, SVG, or JPEG) and download. Higher error correction allows more logo coverage."
              }
            ]}
            tips={[
              { text: "Use High error correction (30%) when adding logos to QR codes" },
              { text: "Test your QR code with multiple devices before printing" },
              { text: "Maintain good contrast between foreground and background colors" },
              { text: "Logo should cover no more than 30% of the QR code area" },
              { text: "SVG format is best for print materials and scalability" }
            ]}
          />

          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mt-6">
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

                <div className="mt-6 p-4 bg-muted rounded-lg border border-dashed">
                  <p className="text-sm text-center text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Live Preview - QR updates as you type
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Live Preview & Download</CardTitle>
                <CardDescription>Your QR code updates in real-time as you make changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-8 rounded-lg flex justify-center items-center min-h-[400px]">
                  <canvas 
                    ref={canvasRef} 
                    className={`max-w-full border-2 border-border rounded-lg shadow-lg ${qrGenerated ? '' : 'hidden'}`}
                  />
                  {!qrGenerated && (
                    <div className="text-center text-muted-foreground">
                      <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Start typing to see your QR code</p>
                      <p className="text-sm">Enter any text or URL in the left panel</p>
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
            {/* Long-form explanatory content for SEO (600+ words) - Collapsible Accordion */}
            <Accordion type="single" collapsible className="max-w-4xl mx-auto mt-8">
              <AccordionItem value="about">
                <AccordionTrigger className="text-left font-semibold">
                  About the QR Code Generator
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    QR codes are a compact way to encode information — URLs, contact cards,
                    Wi‑Fi credentials, and more — into a scannable image. This QR Code
                    Generator gives you precise control over the generated code: change size,
                    foreground and background colors, error correction level, and optionally
                    embed a logo for branding. It is ideal for creating codes for marketing
                    materials, business cards, event signage, or secure one-time links.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="encode">
                <AccordionTrigger className="text-left font-semibold">
                  What you can encode
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    You can encode any text or URL; common use cases include website links,
                    vCard contact cards, Wi‑Fi network parameters, SMS templates, and
                    payment or ticketing tokens. The generator treats input as raw text, so
                    you may format vCard and Wi‑Fi payloads according to the destination
                    application's requirements for best compatibility.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="customization">
                <AccordionTrigger className="text-left font-semibold">
                  Customization & error correction
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Error correction is an important QR feature: choosing a higher level (Q/H)
                    lets the code remain readable even if part of it is obscured — for
                    example, by a centrally placed logo or light damage after printing.
                    Higher correction increases the number of modules and can slightly affect
                    scannability under very tight contrast, so always test on multiple devices.
                    For logos, keep coverage under 30% and use a white backdrop behind the
                    logo to preserve contrast.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="design">
                <AccordionTrigger className="text-left font-semibold">
                  Design best practices
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Maintain strong contrast between foreground and background colors. Dark
                    foreground on a light background is the most reliable. Avoid gradients or
                    patterns that reduce readability. For print, use the SVG or high-resolution
                    PNG output to preserve sharp edges. When adding logos, prefer vector
                    formats or high-DPI raster images to avoid blurring when scaled.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="usecases">
                <AccordionTrigger className="text-left font-semibold">
                  Use cases and examples
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Marketing: place QR codes on flyers and posters that link to landing
                    pages or promo codes. Events: embed schedule links or registration tokens.
                    Business: print vCard QR codes on business cards to transfer contact
                    details quickly. Logistics: use QR tags for asset tracking. Each use case
                    benefits from testing: scan the final output with several phone models and
                    at different sizes before distributing widely.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="troubleshooting">
                <AccordionTrigger className="text-left font-semibold">
                  Troubleshooting
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    If a code won't scan, try increasing size or error correction, simplify the
                    content (shorten URLs), or change color contrast. Online scanners and
                    native phone camera apps can behave differently; always validate using the
                    target devices. If you receive an overflow error, it means the data is too
                    large for the selected error correction level — reduce content length or
                    lower correction.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy">
                <AccordionTrigger className="text-left font-semibold">
                  Privacy & distribution
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Generation occurs in your browser, and we do not upload textual content to
                    our servers. When sharing QR codes that contain sensitive data (Wi‑Fi
                    passwords, private links), prefer short-lived tokens or server-side
                    redirects that expire after use. For public campaigns, combine QR codes
                    with UTM parameters for analytics while protecting personally identifiable
                    information.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="related">
                <AccordionTrigger className="text-left font-semibold">
                  Related tools
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Use our <a href="/image-compressor" className="underline">Image Compressor</a> to optimize
                    exported PNGs for web delivery, or the <a href="/password-generator" className="underline">Password Generator</a>
                    {" "}to create secure tokens that you encode in QR codes for temporary access.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="accessibility">
                <AccordionTrigger className="text-left font-semibold">
                  Accessibility and scanning reliability
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    Ensure your QR codes are accessible: provide a short human-readable URL
                    or an alternative CTA near the code for users who cannot scan images.
                    For visually impaired users, include descriptive alt text when embedding
                    QR codes on web pages. Scanning reliability depends on contrast, size,
                    and print quality — always test in the final medium and at the sizes you
                    plan to distribute.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="measuring">
                <AccordionTrigger className="text-left font-semibold">
                  Measuring success
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    If you use QR codes in marketing, add UTM parameters or short redirect
                    links to track scans in analytics platforms. Short-lived redirect URLs can
                    help you control access and measure engagement while keeping the encoded
                    payload small. For campaigns, A/B test different placements and sizes to
                    determine the most effective presentation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="printing">
                <AccordionTrigger className="text-left font-semibold">
                  Printing & production notes
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <p>
                    When printing QR codes, vector SVGs produce the sharpest results. For
                    large-format prints like banners, a high-resolution PNG (300+ DPI) is
                    recommended. Keep quiet zones (margins) around the code free from
                    graphics and text. If your design overlays images or patterns near the
                    QR, increase error correction and verify scanning from different angles.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QRGenerator;
