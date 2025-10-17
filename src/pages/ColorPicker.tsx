import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Pipette, Palette, Sparkles, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SavedColor {
  id: string;
  hex: string;
  name: string;
}

const ColorPicker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [color, setColor] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [colorName, setColorName] = useState("");
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientColor2, setGradientColor2] = useState("#ec4899");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const handleHexChange = (hex: string) => {
    setColor(hex);
    const newRgb = hexToRgb(hex);
    setRgb(newRgb);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [key]: value };
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(hex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [key]: value };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(hex);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`,
    });
  };

  const saveColor = () => {
    const newColor: SavedColor = {
      id: `${Date.now()}-${Math.random()}`,
      hex: color,
      name: colorName || color,
    };
    setSavedColors(prev => [newColor, ...prev].slice(0, 20));
    setColorName("");
    toast({
      title: "Color Saved!",
      description: `Saved as ${newColor.name}`,
    });
  };

  const removeColor = (id: string) => {
    setSavedColors(prev => prev.filter(c => c.id !== id));
  };

  const generateColorScheme = (type: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic') => {
    const colors: string[] = [color];
    const { h, s, l } = hsl;

    switch (type) {
      case 'complementary':
        const comp = hslToRgb((h + 180) % 360, s, l);
        colors.push(rgbToHex(comp.r, comp.g, comp.b));
        break;
      case 'analogous':
        const analog1 = hslToRgb((h + 30) % 360, s, l);
        const analog2 = hslToRgb((h - 30 + 360) % 360, s, l);
        colors.push(rgbToHex(analog1.r, analog1.g, analog1.b));
        colors.push(rgbToHex(analog2.r, analog2.g, analog2.b));
        break;
      case 'triadic':
        const tri1 = hslToRgb((h + 120) % 360, s, l);
        const tri2 = hslToRgb((h + 240) % 360, s, l);
        colors.push(rgbToHex(tri1.r, tri1.g, tri1.b));
        colors.push(rgbToHex(tri2.r, tri2.g, tri2.b));
        break;
      case 'tetradic':
        const tet1 = hslToRgb((h + 90) % 360, s, l);
        const tet2 = hslToRgb((h + 180) % 360, s, l);
        const tet3 = hslToRgb((h + 270) % 360, s, l);
        colors.push(rgbToHex(tet1.r, tet1.g, tet1.b));
        colors.push(rgbToHex(tet2.r, tet2.g, tet2.b));
        colors.push(rgbToHex(tet3.r, tet3.g, tet3.b));
        break;
      case 'monochromatic':
        const mono1 = hslToRgb(h, s, Math.max(0, l - 20));
        const mono2 = hslToRgb(h, s, Math.min(100, l + 20));
        const mono3 = hslToRgb(h, s, Math.min(100, l + 40));
        colors.push(rgbToHex(mono1.r, mono1.g, mono1.b));
        colors.push(rgbToHex(mono2.r, mono2.g, mono2.b));
        colors.push(rgbToHex(mono3.r, mono3.g, mono3.b));
        break;
    }

    return colors;
  };

  const generateGradientCSS = () => {
    return `linear-gradient(${gradientAngle}deg, ${color}, ${gradientColor2})`;
  };

  const getColorName = (hex: string) => {
    // Simple color naming based on hue
    const rgbValues = hexToRgb(hex);
    const { h } = rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b);
    if (h < 15 || h >= 345) return "Red";
    if (h < 45) return "Orange";
    if (h < 75) return "Yellow";
    if (h < 165) return "Green";
    if (h < 255) return "Blue";
    if (h < 285) return "Purple";
    return "Pink";
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

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Palette className="h-8 w-8" />
                Advanced Color Picker
              </CardTitle>
              <CardDescription>
                Pick colors, create gradients, generate palettes, and build color schemes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="picker" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="picker">
                    <Pipette className="h-4 w-4 mr-2" />
                    Picker
                  </TabsTrigger>
                  <TabsTrigger value="gradients">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gradients
                  </TabsTrigger>
                  <TabsTrigger value="schemes">
                    <Palette className="h-4 w-4 mr-2" />
                    Schemes
                  </TabsTrigger>
                  <TabsTrigger value="saved">
                    Saved ({savedColors.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="picker" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <div 
                          className="w-full h-64 rounded-lg border-4 border-border shadow-lg transition-all"
                          style={{ backgroundColor: color }}
                        />
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => handleHexChange(e.target.value)}
                          className="w-full h-16 cursor-pointer"
                        />
                        <div className="w-full text-center">
                          <p className="text-2xl font-bold">{getColorName(color)}</p>
                          <p className="text-sm text-muted-foreground">{color}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>HEX</Label>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(color, "HEX")}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <Input
                          value={color}
                          onChange={(e) => handleHexChange(e.target.value)}
                          className="font-mono text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>RGB</Label>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">R (Red)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="255"
                              value={rgb.r}
                              onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">G (Green)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="255"
                              value={rgb.g}
                              onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">B (Blue)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="255"
                              value={rgb.b}
                              onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>HSL</Label>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">H (Hue)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="360"
                              value={hsl.h}
                              onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">S (Saturation)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={hsl.s}
                              onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">L (Lightness)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={hsl.l}
                              onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <Label>Save Color</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Color name (optional)"
                            value={colorName}
                            onChange={(e) => setColorName(e.target.value)}
                          />
                          <Button onClick={saveColor}>
                            <Plus className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gradients" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div 
                      className="w-full h-64 rounded-lg border-4 border-border shadow-lg"
                      style={{ background: generateGradientCSS() }}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Color 1</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            value={color}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Color 2</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Angle: {gradientAngle}°</Label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>CSS Code</Label>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(generateGradientCSS(), "Gradient CSS")}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                        background: {generateGradientCSS()};
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="outline" onClick={() => setGradientAngle(0)}>0°</Button>
                      <Button variant="outline" onClick={() => setGradientAngle(90)}>90°</Button>
                      <Button variant="outline" onClick={() => setGradientAngle(180)}>180°</Button>
                      <Button variant="outline" onClick={() => setGradientAngle(270)}>270°</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schemes" className="space-y-6 mt-6">
                  {['complementary', 'analogous', 'triadic', 'tetradic', 'monochromatic'].map((schemeType) => {
                    const scheme = generateColorScheme(schemeType as any);
                    return (
                      <Card key={schemeType}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold capitalize mb-3">{schemeType}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {scheme.map((schemeColor, idx) => (
                              <div key={idx} className="space-y-2">
                                <div
                                  className="h-24 rounded border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                                  style={{ backgroundColor: schemeColor }}
                                  onClick={() => handleHexChange(schemeColor)}
                                />
                                <div className="text-center">
                                  <p className="text-xs font-mono">{schemeColor}</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(schemeColor, "Color")}
                                    className="h-6 text-xs"
                                  >
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="saved" className="space-y-4 mt-6">
                  {savedColors.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No saved colors yet</p>
                      <p className="text-sm">Save colors from the Picker tab</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {savedColors.map((saved) => (
                        <div key={saved.id} className="space-y-2">
                          <div
                            className="h-24 rounded border-2 border-border cursor-pointer hover:scale-105 transition-transform relative group"
                            style={{ backgroundColor: saved.hex }}
                            onClick={() => handleHexChange(saved.hex)}
                          >
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColor(saved.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium truncate">{saved.name}</p>
                            <p className="text-xs font-mono text-muted-foreground">{saved.hex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ColorPicker;
