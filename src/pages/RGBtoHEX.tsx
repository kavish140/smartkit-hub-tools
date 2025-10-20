import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/hooks/useToolTracking";

const RGBtoHEX = () => {
  useToolTracking("RGB to HEX");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // RGB to HEX
  const [r, setR] = useState(255);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [hexResult, setHexResult] = useState("#FF0000");

  // HEX to RGB
  const [hexInput, setHexInput] = useState("#FF0000");
  const [rgbResult, setRgbResult] = useState({ r: 255, g: 0, b: 0 });

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
      return hex.toUpperCase();
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const handleRGBChange = (newR: number, newG: number, newB: number) => {
    setR(newR);
    setG(newG);
    setB(newB);
    const hex = rgbToHex(newR, newG, newB);
    setHexResult(hex);
  };

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#?[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex);
      setRgbResult(rgb);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Color value copied to clipboard",
    });
  };

  const generateRandomColor = () => {
    const newR = Math.floor(Math.random() * 256);
    const newG = Math.floor(Math.random() * 256);
    const newB = Math.floor(Math.random() * 256);
    handleRGBChange(newR, newG, newB);
  };

  // Predefined colors
  const presetColors = [
    { name: "Red", hex: "#FF0000", rgb: { r: 255, g: 0, b: 0 } },
    { name: "Green", hex: "#00FF00", rgb: { r: 0, g: 255, b: 0 } },
    { name: "Blue", hex: "#0000FF", rgb: { r: 0, g: 0, b: 255 } },
    { name: "Yellow", hex: "#FFFF00", rgb: { r: 255, g: 255, b: 0 } },
    { name: "Cyan", hex: "#00FFFF", rgb: { r: 0, g: 255, b: 255 } },
    { name: "Magenta", hex: "#FF00FF", rgb: { r: 255, g: 0, b: 255 } },
    { name: "Black", hex: "#000000", rgb: { r: 0, g: 0, b: 0 } },
    { name: "White", hex: "#FFFFFF", rgb: { r: 255, g: 255, b: 255 } },
    { name: "Gray", hex: "#808080", rgb: { r: 128, g: 128, b: 128 } },
    { name: "Orange", hex: "#FFA500", rgb: { r: 255, g: 165, b: 0 } },
    { name: "Purple", hex: "#800080", rgb: { r: 128, g: 0, b: 128 } },
    { name: "Pink", hex: "#FFC0CB", rgb: { r: 255, g: 192, b: 203 } },
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

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">RGB to HEX Converter</CardTitle>
              <CardDescription>Convert RGB colors to HEX and vice versa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="rgb-to-hex" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rgb-to-hex">RGB → HEX</TabsTrigger>
                  <TabsTrigger value="hex-to-rgb">HEX → RGB</TabsTrigger>
                </TabsList>

                <TabsContent value="rgb-to-hex" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Red (R)</Label>
                          <span className="text-sm font-mono font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                            {r}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="255"
                          value={r}
                          onChange={(e) => handleRGBChange(parseInt(e.target.value), g, b)}
                          className="accent-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Green (G)</Label>
                          <span className="text-sm font-mono font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                            {g}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="255"
                          value={g}
                          onChange={(e) => handleRGBChange(r, parseInt(e.target.value), b)}
                          className="accent-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Blue (B)</Label>
                          <span className="text-sm font-mono font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {b}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="255"
                          value={b}
                          onChange={(e) => handleRGBChange(r, g, parseInt(e.target.value))}
                          className="accent-blue-500"
                        />
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={generateRandomColor}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Generate Random Color
                    </Button>

                    <div 
                      className="w-full h-48 rounded-lg border-4 border-white shadow-lg"
                      style={{ backgroundColor: hexResult }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-muted">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground mb-2">RGB Value</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg">rgb({r}, {g}, {b})</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-primary text-white">
                        <CardContent className="p-4">
                          <div className="text-sm opacity-90 mb-2">HEX Value</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg font-bold">{hexResult}</span>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyToClipboard(hexResult)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hex-to-rgb" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>HEX Color Code</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="#FF0000"
                          value={hexInput}
                          onChange={(e) => handleHexChange(e.target.value)}
                          maxLength={7}
                          className="font-mono"
                        />
                        <input
                          type="color"
                          value={hexInput}
                          onChange={(e) => handleHexChange(e.target.value)}
                          className="w-14 h-10 border-2 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div 
                      className="w-full h-48 rounded-lg border-4 border-white shadow-lg"
                      style={{ backgroundColor: hexInput }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gradient-primary text-white">
                        <CardContent className="p-4">
                          <div className="text-sm opacity-90 mb-2">HEX Value</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg font-bold">{hexInput}</span>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyToClipboard(hexInput)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground mb-2">RGB Value</div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-lg">
                              rgb({rgbResult.r}, {rgbResult.g}, {rgbResult.b})
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(`rgb(${rgbResult.r}, ${rgbResult.g}, ${rgbResult.b})`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Card className="bg-red-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xs text-red-600 mb-1">Red</div>
                          <div className="text-2xl font-bold text-red-800">{rgbResult.r}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xs text-green-600 mb-1">Green</div>
                          <div className="text-2xl font-bold text-green-800">{rgbResult.g}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50">
                        <CardContent className="p-3 text-center">
                          <div className="text-xs text-blue-600 mb-1">Blue</div>
                          <div className="text-2xl font-bold text-blue-800">{rgbResult.b}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Preset Colors</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        handleRGBChange(color.rgb.r, color.rgb.g, color.rgb.b);
                        handleHexChange(color.hex);
                      }}
                      className="group relative aspect-square rounded-lg border-2 border-gray-200 hover:border-primary transition-all hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 bg-black/50 text-white rounded-lg transition-opacity">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">💡 Quick Guide:</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li><strong>RGB</strong> - Red, Green, Blue values from 0 to 255</li>
                  <li><strong>HEX</strong> - Hexadecimal color code (#RRGGBB)</li>
                  <li>Use sliders to adjust RGB values in real-time</li>
                  <li>Click preset colors for quick selection</li>
                  <li>Copy values directly to your clipboard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RGBtoHEX;
