import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Atom, Download, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Isomer {
  name: string;
  structure: string;
  svg: string;
}

const IsomerDiagrams = () => {
  const [carbonCount, setCarbonCount] = useState<number>(4);
  const [hydrogenCount, setHydrogenCount] = useState<number>(10);
  const [isomers, setIsomers] = useState<Isomer[]>([]);
  const [formulaType, setFormulaType] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateFormula = (c: number, h: number): string => {
    if (h === 2 * c + 2) return "Alkane";
    if (h === 2 * c) return "Alkene";
    if (h === 2 * c - 2) return "Alkyne";
    return "Invalid";
  };

  const generateIsomers = () => {
    const type = validateFormula(carbonCount, hydrogenCount);
    setFormulaType(type);

    if (type === "Invalid") {
      toast({
        title: "Invalid Formula",
        description: "The molecular formula doesn't match standard hydrocarbon patterns.",
        variant: "destructive",
      });
      setIsomers([]);
      return;
    }

    if (type !== "Alkane") {
      toast({
        title: "Limited Support",
        description: "Currently only alkane isomers (CnH2n+2) are fully supported.",
      });
      setIsomers([]);
      return;
    }

    // Generate isomers based on carbon count
    const generatedIsomers = generateAlkaneIsomers(carbonCount);
    setIsomers(generatedIsomers);

    if (generatedIsomers.length === 0) {
      toast({
        title: "No Isomers",
        description: "Isomer generation for this molecule is not yet implemented.",
      });
    }
  };

  const generateAlkaneIsomers = (c: number): Isomer[] => {
    const isomers: Isomer[] = [];

    if (c === 3) {
      // Propane - only 1 structure
      isomers.push({
        name: "Propane",
        structure: "CH3-CH2-CH3",
        svg: drawLinearAlkane(3),
      });
    } else if (c === 4) {
      // Butane - 2 isomers
      isomers.push({
        name: "n-Butane",
        structure: "CH3-CH2-CH2-CH3",
        svg: drawLinearAlkane(4),
      });
      isomers.push({
        name: "Isobutane (2-Methylpropane)",
        structure: "CH3-CH(CH3)-CH3",
        svg: drawBranchedAlkane(4, "iso"),
      });
    } else if (c === 5) {
      // Pentane - 3 isomers
      isomers.push({
        name: "n-Pentane",
        structure: "CH3-CH2-CH2-CH2-CH3",
        svg: drawLinearAlkane(5),
      });
      isomers.push({
        name: "Isopentane (2-Methylbutane)",
        structure: "CH3-CH(CH3)-CH2-CH3",
        svg: drawBranchedAlkane(5, "iso"),
      });
      isomers.push({
        name: "Neopentane (2,2-Dimethylpropane)",
        structure: "C(CH3)4",
        svg: drawBranchedAlkane(5, "neo"),
      });
    } else if (c === 6) {
      // Hexane - 5 isomers
      isomers.push({
        name: "n-Hexane",
        structure: "CH3-CH2-CH2-CH2-CH2-CH3",
        svg: drawLinearAlkane(6),
      });
      isomers.push({
        name: "2-Methylpentane",
        structure: "CH3-CH(CH3)-CH2-CH2-CH3",
        svg: drawBranchedAlkane(6, "2-methyl"),
      });
      isomers.push({
        name: "3-Methylpentane",
        structure: "CH3-CH2-CH(CH3)-CH2-CH3",
        svg: drawBranchedAlkane(6, "3-methyl"),
      });
      isomers.push({
        name: "2,2-Dimethylbutane",
        structure: "CH3-C(CH3)2-CH2-CH3",
        svg: drawBranchedAlkane(6, "2,2-dimethyl"),
      });
      isomers.push({
        name: "2,3-Dimethylbutane",
        structure: "CH3-CH(CH3)-CH(CH3)-CH3",
        svg: drawBranchedAlkane(6, "2,3-dimethyl"),
      });
    }

    return isomers;
  };

  const drawLinearAlkane = (c: number): string => {
    const width = 400;
    const height = 200;
    const spacing = Math.min(60, (width - 100) / (c - 1));
    const startX = (width - spacing * (c - 1)) / 2;
    const centerY = height / 2;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw carbon chain
    for (let i = 0; i < c; i++) {
      const x = startX + i * spacing;
      
      // Draw carbon atom
      svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
      svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
      
      // Draw bond to next carbon
      if (i < c - 1) {
        svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
      }
    }
    
    svg += `</svg>`;
    return svg;
  };

  const drawBranchedAlkane = (c: number, type: string): string => {
    const width = 400;
    const height = 250;
    const spacing = 60;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (c === 4 && type === "iso") {
      // Isobutane structure
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Central carbon
      svg += `<circle cx="${centerX}" cy="${centerY}" r="8" fill="#333" />`;
      svg += `<text x="${centerX}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
      
      // Three methyl groups
      const positions = [
        { x: centerX - spacing, y: centerY },
        { x: centerX + spacing, y: centerY },
        { x: centerX, y: centerY - spacing },
      ];
      
      positions.forEach((pos) => {
        svg += `<line x1="${centerX}" y1="${centerY}" x2="${pos.x}" y2="${pos.y}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${pos.x}" cy="${pos.y}" r="8" fill="#333" />`;
        svg += `<text x="${pos.x}" y="${pos.y - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      });
      
      // Bottom carbon
      svg += `<line x1="${centerX}" y1="${centerY}" x2="${centerX}" y2="${centerY + spacing}" stroke="#333" stroke-width="2" />`;
      svg += `<circle cx="${centerX}" cy="${centerY + spacing}" r="8" fill="#333" />`;
      svg += `<text x="${centerX}" y="${centerY + spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
    } else if (c === 5 && type === "iso") {
      // Isopentane structure
      const startX = width / 2 - spacing;
      const centerY = height / 2;
      
      // Main chain (4 carbons)
      for (let i = 0; i < 4; i++) {
        const x = startX + i * spacing;
        svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
        svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
        
        if (i < 3) {
          svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
        }
      }
      
      // Branch on second carbon
      const branchX = startX + spacing;
      svg += `<line x1="${branchX}" y1="${centerY}" x2="${branchX}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
      svg += `<circle cx="${branchX}" cy="${centerY - spacing}" r="8" fill="#333" />`;
      svg += `<text x="${branchX}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
    } else if (c === 5 && type === "neo") {
      // Neopentane structure
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Central carbon
      svg += `<circle cx="${centerX}" cy="${centerY}" r="8" fill="#333" />`;
      svg += `<text x="${centerX}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
      
      // Four methyl groups
      const positions = [
        { x: centerX - spacing, y: centerY },
        { x: centerX + spacing, y: centerY },
        { x: centerX, y: centerY - spacing },
        { x: centerX, y: centerY + spacing },
      ];
      
      positions.forEach((pos) => {
        svg += `<line x1="${centerX}" y1="${centerY}" x2="${pos.x}" y2="${pos.y}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${pos.x}" cy="${pos.y}" r="8" fill="#333" />`;
        svg += `<text x="${pos.x}" y="${pos.y < centerY ? pos.y - 15 : pos.y + 25}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      });
    } else if (c === 6) {
      // Hexane isomers
      const startX = 80;
      const centerY = height / 2;
      
      if (type === "2-methyl") {
        // 2-Methylpentane
        for (let i = 0; i < 5; i++) {
          const x = startX + i * spacing;
          svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
          svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
          
          if (i < 4) {
            svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
          }
        }
        
        // Branch on second carbon
        const branchX = startX + spacing;
        svg += `<line x1="${branchX}" y1="${centerY}" x2="${branchX}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branchX}" cy="${centerY - spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branchX}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      } else if (type === "3-methyl") {
        // 3-Methylpentane
        for (let i = 0; i < 5; i++) {
          const x = startX + i * spacing;
          svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
          svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
          
          if (i < 4) {
            svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
          }
        }
        
        // Branch on third carbon
        const branchX = startX + 2 * spacing;
        svg += `<line x1="${branchX}" y1="${centerY}" x2="${branchX}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branchX}" cy="${centerY - spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branchX}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      } else if (type === "2,2-dimethyl") {
        // 2,2-Dimethylbutane
        for (let i = 0; i < 4; i++) {
          const x = startX + i * spacing;
          svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
          svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
          
          if (i < 3) {
            svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
          }
        }
        
        // Two branches on second carbon
        const branchX = startX + spacing;
        svg += `<line x1="${branchX}" y1="${centerY}" x2="${branchX}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branchX}" cy="${centerY - spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branchX}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
        
        svg += `<line x1="${branchX}" y1="${centerY}" x2="${branchX}" y2="${centerY + spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branchX}" cy="${centerY + spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branchX}" y="${centerY + spacing + 25}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      } else if (type === "2,3-dimethyl") {
        // 2,3-Dimethylbutane
        for (let i = 0; i < 4; i++) {
          const x = startX + i * spacing;
          svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#333" />`;
          svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#333">C</text>`;
          
          if (i < 3) {
            svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#333" stroke-width="2" />`;
          }
        }
        
        // Branch on second carbon
        const branch1X = startX + spacing;
        svg += `<line x1="${branch1X}" y1="${centerY}" x2="${branch1X}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branch1X}" cy="${centerY - spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branch1X}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
        
        // Branch on third carbon
        const branch2X = startX + 2 * spacing;
        svg += `<line x1="${branch2X}" y1="${centerY}" x2="${branch2X}" y2="${centerY - spacing}" stroke="#333" stroke-width="2" />`;
        svg += `<circle cx="${branch2X}" cy="${centerY - spacing}" r="8" fill="#333" />`;
        svg += `<text x="${branch2X}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#333">CH3</text>`;
      }
    }
    
    svg += `</svg>`;
    return svg;
  };

  const downloadSVG = (isomer: Isomer) => {
    const blob = new Blob([isomer.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${isomer.name.replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `${isomer.name} structure saved as SVG.`,
    });
  };

  const quickSelect = (c: number, h: number) => {
    setCarbonCount(c);
    setHydrogenCount(h);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Atom className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hydrocarbon Isomer Diagrams
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Generate and visualize structural isomers for hydrocarbon molecules
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Molecular Formula</CardTitle>
              <CardDescription>
                Enter the number of carbon and hydrogen atoms (e.g., C4H10 for butane)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbon">Number of Carbon Atoms (C)</Label>
                  <Input
                    id="carbon"
                    type="number"
                    min="1"
                    max="10"
                    value={carbonCount}
                    onChange={(e) => setCarbonCount(parseInt(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrogen">Number of Hydrogen Atoms (H)</Label>
                  <Input
                    id="hydrogen"
                    type="number"
                    min="1"
                    max="30"
                    value={hydrogenCount}
                    onChange={(e) => setHydrogenCount(parseInt(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Select (Alkanes)</Label>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => quickSelect(3, 8)} variant="outline" size="sm">
                    C3H8 (Propane)
                  </Button>
                  <Button onClick={() => quickSelect(4, 10)} variant="outline" size="sm">
                    C4H10 (Butane)
                  </Button>
                  <Button onClick={() => quickSelect(5, 12)} variant="outline" size="sm">
                    C5H12 (Pentane)
                  </Button>
                  <Button onClick={() => quickSelect(6, 14)} variant="outline" size="sm">
                    C6H14 (Hexane)
                  </Button>
                  <Button onClick={() => quickSelect(7, 16)} variant="outline" size="sm">
                    C7H16 (Heptane)
                  </Button>
                  <Button onClick={() => quickSelect(8, 18)} variant="outline" size="sm">
                    C8H18 (Octane)
                  </Button>
                </div>
              </div>

              <Button
                onClick={generateIsomers}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                <Atom className="mr-2 h-5 w-5" />
                Generate Isomers
              </Button>

              {formulaType && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm font-medium">
                    Formula Type: <span className="text-blue-600 dark:text-blue-400">{formulaType}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    C{carbonCount}H{hydrogenCount}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {isomers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Found {isomers.length} Isomer{isomers.length !== 1 ? "s" : ""}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isomers.map((isomer, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{isomer.name}</CardTitle>
                      <CardDescription className="font-mono">{isomer.structure}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="bg-white rounded-lg p-4 mb-4"
                        dangerouslySetInnerHTML={{ __html: isomer.svg }}
                      />
                      <Button
                        onClick={() => downloadSVG(isomer)}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download SVG
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IsomerDiagrams;
