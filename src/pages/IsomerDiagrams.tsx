import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Atom, Download, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToolTracking } from "@/hooks/useToolTracking";

interface Isomer {
  name: string;
  structure: string;
  svg: string;
}

type MoleculeType = "alkane" | "alkene" | "alkyne";

const IsomerDiagrams = () => {
  useToolTracking("Isomer Diagrams");
  const [activeTab, setActiveTab] = useState<MoleculeType>("alkane");
  const [carbonCount, setCarbonCount] = useState<number>(4);
  const [isomers, setIsomers] = useState<Isomer[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate hydrogen count based on molecule type and carbon count
  const calculateHydrogen = (c: number, type: MoleculeType): number => {
    if (type === "alkane") return 2 * c + 2;
    if (type === "alkene") return 2 * c;
    if (type === "alkyne") return 2 * c - 2;
    return 0;
  };

  const hydrogenCount = calculateHydrogen(carbonCount, activeTab);

  // Update isomers when carbon count or tab changes
  useEffect(() => {
    setIsomers([]);
  }, [carbonCount, activeTab]);

  const generateIsomers = () => {
    let generatedIsomers: Isomer[] = [];

    if (activeTab === "alkane") {
      generatedIsomers = generateAlkaneIsomers(carbonCount);
    } else if (activeTab === "alkene") {
      generatedIsomers = generateAlkeneIsomers(carbonCount);
    } else if (activeTab === "alkyne") {
      generatedIsomers = generateAlkyneIsomers(carbonCount);
    }

    setIsomers(generatedIsomers);

    if (generatedIsomers.length === 0) {
      toast({
        title: "No Isomers Available",
        description: `Isomer generation for C${carbonCount} ${activeTab} is not yet available.`,
      });
    } else {
      toast({
        title: "Isomers Generated!",
        description: `Found ${generatedIsomers.length} isomer${generatedIsomers.length !== 1 ? 's' : ''} for C${carbonCount}H${hydrogenCount}.`,
      });
    }
  };

  const generateAlkaneIsomers = (c: number): Isomer[] => {
    const isomers: Isomer[] = [];

    // All alkanes have at least the linear (n-alkane) form
    if (c >= 1 && c <= 10) {
      const alkaneNames = ["Methane", "Ethane", "Propane", "Butane", "Pentane", "Hexane", "Heptane", "Octane", "Nonane", "Decane"];
      isomers.push({
        name: c <= 3 ? alkaneNames[c - 1] : `n-${alkaneNames[c - 1]}`,
        structure: c === 1 ? "CH4" : c === 2 ? "CH3-CH3" : "CH3-" + "(CH2)".repeat(c - 2) + "-CH3",
        svg: drawLinearAlkane(c),
      });
    }

    if (c === 4) {
      isomers.push({
        name: "Isobutane (2-Methylpropane)",
        structure: "CH3-CH(CH3)-CH3",
        svg: drawBranchedAlkane(4, "iso"),
      });
    } else if (c === 5) {
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
    } else if (c === 7) {
      // Heptane has 9 isomers - showing main ones
      isomers.push({
        name: "2-Methylhexane",
        structure: "CH3-CH(CH3)-(CH2)3-CH3",
        svg: drawBranchedAlkane(7, "2-methyl"),
      });
      isomers.push({
        name: "3-Methylhexane",
        structure: "CH3-CH2-CH(CH3)-(CH2)2-CH3",
        svg: drawBranchedAlkane(7, "3-methyl"),
      });
    } else if (c >= 8 && c <= 10) {
      // For C8-C10, just show a note about isomer count
      const isomerCounts: {[key: number]: number} = {8: 18, 9: 35, 10: 75};
      isomers.push({
        name: `Note: C${c} has ${isomerCounts[c]} possible isomers`,
        structure: "Only linear form shown",
        svg: drawLinearAlkane(c),
      });
    }

    return isomers;
  };

  const generateAlkeneIsomers = (c: number): Isomer[] => {
    const isomers: Isomer[] = [];

    if (c >= 2 && c <= 10) {
      const alkeneNames = ["", "Ethene", "Propene", "Butene", "Pentene", "Hexene", "Heptene", "Octene", "Nonene", "Decene"];
      isomers.push({
        name: alkeneNames[c - 1] || `C${c}-Alkene`,
        structure: c === 2 ? "CH2=CH2" : "CH2=CH-" + (c > 3 ? "(CH2)".repeat(c - 3) + "-" : "") + "CH3",
        svg: drawLinearAlkene(c),
      });
    }

    if (c === 4) {
      isomers.push({
        name: "2-Butene (cis/trans)",
        structure: "CH3-CH=CH-CH3",
        svg: drawLinearAlkene(4, 2),
      });
      isomers.push({
        name: "2-Methylpropene",
        structure: "CH2=C(CH3)-CH3",
        svg: drawBranchedAlkene(4, "iso"),
      });
    } else if (c >= 5 && c <= 10) {
      isomers.push({
        name: `Multiple positional and geometric isomers exist`,
        structure: `C${c}H${2*c} has various isomers`,
        svg: drawLinearAlkene(c),
      });
    }

    return isomers;
  };

  const generateAlkyneIsomers = (c: number): Isomer[] => {
    const isomers: Isomer[] = [];

    if (c >= 2 && c <= 10) {
      const alkyneNames = ["", "Ethyne", "Propyne", "Butyne", "Pentyne", "Hexyne", "Heptyne", "Octyne", "Nonyne", "Decyne"];
      isomers.push({
        name: alkyneNames[c - 1] || `C${c}-Alkyne`,
        structure: c === 2 ? "HC≡CH" : "HC≡C-" + (c > 3 ? "(CH2)".repeat(c - 3) + "-" : "") + "CH3",
        svg: drawLinearAlkyne(c),
      });
    }

    if (c >= 4 && c <= 10) {
      isomers.push({
        name: `2-${["", "", "", "Butyne", "Pentyne", "Hexyne", "Heptyne", "Octyne", "Nonyne", "Decyne"][c - 1]}`,
        structure: c === 4 ? "CH3-C≡C-CH3" : `CH3-C≡C-${"(CH2)".repeat(c - 4)}-CH3`,
        svg: drawLinearAlkyne(c, 2),
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

  const drawLinearAlkene = (c: number, position: number = 1): string => {
    const width = 400;
    const height = 200;
    const spacing = Math.min(60, (width - 100) / Math.max(c - 1, 1));
    const startX = (width - spacing * Math.max(c - 1, 1)) / 2;
    const centerY = height / 2;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw carbon chain
    for (let i = 0; i < c; i++) {
      const x = startX + i * spacing;
      
      svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#1e40af" />`;
      svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#1e40af">C</text>`;
      
      if (i < c - 1) {
        // Draw double bond at specified position
        if (i === position - 1) {
          svg += `<line x1="${x + 8}" y1="${centerY - 3}" x2="${x + spacing - 8}" y2="${centerY - 3}" stroke="#1e40af" stroke-width="2" />`;
          svg += `<line x1="${x + 8}" y1="${centerY + 3}" x2="${x + spacing - 8}" y2="${centerY + 3}" stroke="#1e40af" stroke-width="2" />`;
        } else {
          svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#1e40af" stroke-width="2" />`;
        }
      }
    }
    
    svg += `</svg>`;
    return svg;
  };

  const drawBranchedAlkene = (c: number, type: string): string => {
    const width = 400;
    const height = 250;
    const spacing = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (c === 4 && type === "iso") {
      // 2-Methylpropene
      svg += `<circle cx="${centerX - spacing}" cy="${centerY}" r="8" fill="#1e40af" />`;
      svg += `<text x="${centerX - spacing}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#1e40af">CH2</text>`;
      
      svg += `<line x1="${centerX - spacing + 8}" y1="${centerY - 3}" x2="${centerX - 8}" y2="${centerY - 3}" stroke="#1e40af" stroke-width="2" />`;
      svg += `<line x1="${centerX - spacing + 8}" y1="${centerY + 3}" x2="${centerX - 8}" y2="${centerY + 3}" stroke="#1e40af" stroke-width="2" />`;
      
      svg += `<circle cx="${centerX}" cy="${centerY}" r="8" fill="#1e40af" />`;
      svg += `<text x="${centerX}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#1e40af">C</text>`;
      
      svg += `<line x1="${centerX}" y1="${centerY}" x2="${centerX}" y2="${centerY - spacing}" stroke="#1e40af" stroke-width="2" />`;
      svg += `<circle cx="${centerX}" cy="${centerY - spacing}" r="8" fill="#1e40af" />`;
      svg += `<text x="${centerX}" y="${centerY - spacing - 15}" text-anchor="middle" font-size="14" fill="#1e40af">CH3</text>`;
      
      svg += `<line x1="${centerX + 8}" y1="${centerY}" x2="${centerX + spacing - 8}" y2="${centerY}" stroke="#1e40af" stroke-width="2" />`;
      svg += `<circle cx="${centerX + spacing}" cy="${centerY}" r="8" fill="#1e40af" />`;
      svg += `<text x="${centerX + spacing}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#1e40af">CH3</text>`;
    }
    
    svg += `</svg>`;
    return svg;
  };

  const drawLinearAlkyne = (c: number, position: number = 1): string => {
    const width = 400;
    const height = 200;
    const spacing = Math.min(60, (width - 100) / Math.max(c - 1, 1));
    const startX = (width - spacing * Math.max(c - 1, 1)) / 2;
    const centerY = height / 2;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw carbon chain
    for (let i = 0; i < c; i++) {
      const x = startX + i * spacing;
      
      svg += `<circle cx="${x}" cy="${centerY}" r="8" fill="#dc2626" />`;
      svg += `<text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="14" fill="#dc2626">C</text>`;
      
      if (i < c - 1) {
        // Draw triple bond at specified position
        if (i === position - 1) {
          svg += `<line x1="${x + 8}" y1="${centerY - 4}" x2="${x + spacing - 8}" y2="${centerY - 4}" stroke="#dc2626" stroke-width="2" />`;
          svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#dc2626" stroke-width="2" />`;
          svg += `<line x1="${x + 8}" y1="${centerY + 4}" x2="${x + spacing - 8}" y2="${centerY + 4}" stroke="#dc2626" stroke-width="2" />`;
        } else {
          svg += `<line x1="${x + 8}" y1="${centerY}" x2="${x + spacing - 8}" y2="${centerY}" stroke="#dc2626" stroke-width="2" />`;
        }
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
              <CardTitle>Select Hydrocarbon Type</CardTitle>
              <CardDescription>
                Choose the type of hydrocarbon and carbon count (hydrogen is calculated automatically)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MoleculeType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="alkane">Alkane (CnH2n+2)</TabsTrigger>
                  <TabsTrigger value="alkene">Alkene (CnH2n)</TabsTrigger>
                  <TabsTrigger value="alkyne">Alkyne (CnH2n-2)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="alkane" className="space-y-4 mt-6">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Alkanes: Saturated hydrocarbons with single bonds only
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="alkene" className="space-y-4 mt-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Alkenes: Unsaturated hydrocarbons with one C=C double bond
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="alkyne" className="space-y-4 mt-6">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Alkynes: Unsaturated hydrocarbons with one C≡C triple bond
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbon">Number of Carbon Atoms (C)</Label>
                  <Input
                    id="carbon"
                    type="number"
                    min={activeTab === "alkane" ? "1" : "2"}
                    max="10"
                    value={carbonCount}
                    onChange={(e) => setCarbonCount(parseInt(e.target.value) || (activeTab === "alkane" ? 1 : 2))}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrogen">Number of Hydrogen Atoms (H)</Label>
                  <Input
                    id="hydrogen"
                    type="number"
                    value={hydrogenCount}
                    disabled
                    className="text-lg bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Auto-calculated based on carbon count and type</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {activeTab === "alkane" && (
                    <>
                      <Button onClick={() => setCarbonCount(3)} variant="outline" size="sm">C3H8</Button>
                      <Button onClick={() => setCarbonCount(4)} variant="outline" size="sm">C4H10</Button>
                      <Button onClick={() => setCarbonCount(5)} variant="outline" size="sm">C5H12</Button>
                      <Button onClick={() => setCarbonCount(6)} variant="outline" size="sm">C6H14</Button>
                      <Button onClick={() => setCarbonCount(7)} variant="outline" size="sm">C7H16</Button>
                      <Button onClick={() => setCarbonCount(8)} variant="outline" size="sm">C8H18</Button>
                    </>
                  )}
                  {activeTab === "alkene" && (
                    <>
                      <Button onClick={() => setCarbonCount(2)} variant="outline" size="sm">C2H4</Button>
                      <Button onClick={() => setCarbonCount(3)} variant="outline" size="sm">C3H6</Button>
                      <Button onClick={() => setCarbonCount(4)} variant="outline" size="sm">C4H8</Button>
                      <Button onClick={() => setCarbonCount(5)} variant="outline" size="sm">C5H10</Button>
                      <Button onClick={() => setCarbonCount(6)} variant="outline" size="sm">C6H12</Button>
                      <Button onClick={() => setCarbonCount(7)} variant="outline" size="sm">C7H14</Button>
                    </>
                  )}
                  {activeTab === "alkyne" && (
                    <>
                      <Button onClick={() => setCarbonCount(2)} variant="outline" size="sm">C2H2</Button>
                      <Button onClick={() => setCarbonCount(3)} variant="outline" size="sm">C3H4</Button>
                      <Button onClick={() => setCarbonCount(4)} variant="outline" size="sm">C4H6</Button>
                      <Button onClick={() => setCarbonCount(5)} variant="outline" size="sm">C5H8</Button>
                      <Button onClick={() => setCarbonCount(6)} variant="outline" size="sm">C6H10</Button>
                      <Button onClick={() => setCarbonCount(7)} variant="outline" size="sm">C7H12</Button>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={generateIsomers}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                <Atom className="mr-2 h-5 w-5" />
                Generate Isomers for C{carbonCount}H{hydrogenCount}
              </Button>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm font-medium">
                  Current Formula: <span className="text-blue-600 dark:text-blue-400">C{carbonCount}H{hydrogenCount}</span> ({activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})
                </p>
              </div>
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
