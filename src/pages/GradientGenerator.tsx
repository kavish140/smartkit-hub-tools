import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Plus, Trash2, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const GradientGenerator = () => {
  useToolTracking("Gradient Generator");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gradientType, setGradientType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState([90]);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#667eea", position: 0 },
    { id: "2", color: "#764ba2", position: 100 },
  ]);

  const addColorStop = () => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      position: 50,
    };
    setColorStops([...colorStops, newStop].sort((a, b) => a.position - b.position));
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(stop => stop.id !== id));
    } else {
      toast({
        title: "Minimum 2 colors required",
        description: "A gradient needs at least 2 color stops",
        variant: "destructive",
      });
    }
  };

  const updateColorStop = (id: string, field: "color" | "position", value: string | number) => {
    setColorStops(colorStops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ).sort((a, b) => a.position - b.position));
  };

  const generateCSS = (): string => {
    const stops = colorStops.map(stop => `${stop.color} ${stop.position}%`).join(", ");
    
    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle[0]}deg, ${stops})`;
      case "radial":
        return `radial-gradient(circle, ${stops})`;
      case "conic":
        return `conic-gradient(from ${angle[0]}deg, ${stops})`;
      default:
        return "";
    }
  };

  const cssCode = generateCSS();

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${cssCode};`);
    toast({
      title: "Copied!",
      description: "CSS code copied to clipboard",
    });
  };

  const randomizeGradient = () => {
    const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const numStops = Math.floor(Math.random() * 3) + 2; // 2-4 stops
    
    const newStops: ColorStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        id: Date.now().toString() + i,
        color: randomColor(),
        position: Math.round((100 / (numStops - 1)) * i),
      });
    }
    
    setColorStops(newStops);
    setAngle([Math.floor(Math.random() * 360)]);
    
    const types: ("linear" | "radial" | "conic")[] = ["linear", "radial", "conic"];
    setGradientType(types[Math.floor(Math.random() * types.length)]);
  };

  const presetGradients = [
    { name: "Sunset", stops: [{ color: "#ff6b6b", pos: 0 }, { color: "#feca57", pos: 50 }, { color: "#ee5a6f", pos: 100 }] },
    { name: "Ocean", stops: [{ color: "#2E3192", pos: 0 }, { color: "#1BFFFF", pos: 100 }] },
    { name: "Forest", stops: [{ color: "#134E5E", pos: 0 }, { color: "#71B280", pos: 100 }] },
    { name: "Purple Haze", stops: [{ color: "#360033", pos: 0 }, { color: "#0b8793", pos: 100 }] },
    { name: "Fire", stops: [{ color: "#f12711", pos: 0 }, { color: "#f5af19", pos: 100 }] },
    { name: "Ice", stops: [{ color: "#76b852", pos: 0 }, { color: "#8DC26F", pos: 100 }] },
  ];

  const loadPreset = (preset: typeof presetGradients[0]) => {
    const newStops = preset.stops.map((stop, idx) => ({
      id: Date.now().toString() + idx,
      color: stop.color,
      position: stop.pos,
    }));
    setColorStops(newStops);
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
              <Palette className="h-6 w-6" />
              CSS Gradient Generator
            </CardTitle>
            <CardDescription>
              Create beautiful CSS gradients with multiple color stops and export the code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div 
                className="w-full h-64 rounded-lg border-4 border-border shadow-lg"
                style={{ background: cssCode }}
              />
            </div>

            {/* Gradient Type */}
            <div className="space-y-2">
              <Label>Gradient Type</Label>
              <Select value={gradientType} onValueChange={(value: any) => setGradientType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Gradient</SelectItem>
                  <SelectItem value="radial">Radial Gradient</SelectItem>
                  <SelectItem value="conic">Conic Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Angle Control (for linear and conic) */}
            {(gradientType === "linear" || gradientType === "conic") && (
              <div className="space-y-2">
                <Label>Angle: {angle[0]}°</Label>
                <Slider
                  value={angle}
                  onValueChange={setAngle}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Color Stops */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Color Stops</Label>
                <Button onClick={addColorStop} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              </div>

              <div className="space-y-3">
                {colorStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                    <span className="text-sm font-medium w-8">{index + 1}</span>
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, "color", e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, "color", e.target.value)}
                      className="w-28 font-mono text-sm"
                      placeholder="#000000"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Slider
                        value={[stop.position]}
                        onValueChange={(value) => updateColorStop(stop.id, "position", value[0])}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">{stop.position}%</span>
                    </div>
                    <Button
                      onClick={() => removeColorStop(stop.id)}
                      size="sm"
                      variant="ghost"
                      disabled={colorStops.length <= 2}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Gradients */}
            <div className="space-y-2">
              <Label>Preset Gradients</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {presetGradients.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(preset)}
                    className="h-auto flex-col gap-2 p-3"
                  >
                    <div 
                      className="w-full h-12 rounded"
                      style={{
                        background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.pos}%`).join(", ")})`
                      }}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* CSS Code */}
            <Tabs defaultValue="css" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="scss">SCSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              </TabsList>
              <TabsContent value="css" className="space-y-2">
                <Label>CSS Code</Label>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`background: ${cssCode};`}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="scss" className="space-y-2">
                <Label>SCSS Code</Label>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`.gradient {\n  background: ${cssCode};\n}`}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="tailwind" className="space-y-2">
                <Label>Tailwind CSS (Custom)</Label>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`// Add to tailwind.config.js\ntheme: {\n  extend: {\n    backgroundImage: {\n      'custom-gradient': '${cssCode}',\n    }\n  }\n}\n\n// Use: bg-custom-gradient`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={copyCSS}>
                <Copy className="mr-2 h-4 w-4" />
                Copy CSS
              </Button>
              <Button onClick={randomizeGradient} variant="outline">
                Randomize
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default GradientGenerator;
