import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Atom, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Isomer {
  name: string;
  structure: string;
  iupacName: string;
  molecularFormula: string;
}

const IsomerDiagrams = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [carbonCount, setCarbonCount] = useState("4");
  const [hydrogenCount, setHydrogenCount] = useState("10");
  const [isomers, setIsomers] = useState<Isomer[]>([]);
  const [molecularFormula, setMolecularFormula] = useState("");

  // Generate isomers based on carbon count
  const generateIsomers = () => {
    const c = parseInt(carbonCount);
    const h = parseInt(hydrogenCount);

    if (isNaN(c) || isNaN(h) || c < 1 || h < 2) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid carbon and hydrogen counts",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a valid alkane formula (CnH2n+2)
    const expectedH = 2 * c + 2;
    const isAlkane = h === expectedH;
    const isAlkene = h === expectedH - 2;
    const isAlkyne = h === expectedH - 4;

    let type = "";
    if (isAlkane) type = "Alkane";
    else if (isAlkene) type = "Alkene";
    else if (isAlkyne) type = "Alkyne";
    else {
      toast({
        title: "Invalid Formula",
        description: `For C${c}, valid hydrogen counts are: ${expectedH} (alkane), ${expectedH - 2} (alkene), ${expectedH - 4} (alkyne)`,
        variant: "destructive",
      });
      return;
    }

    setMolecularFormula(`C${c}H${h} (${type})`);

    // Generate isomers based on carbon count
    const generatedIsomers = generateIsomersForCarbon(c, type);
    setIsomers(generatedIsomers);

    toast({
      title: "Isomers Generated",
      description: `Found ${generatedIsomers.length} isomer(s) for C${c}H${h}`,
    });
  };

  const generateIsomersForCarbon = (carbonCount: number, type: string): Isomer[] => {
    const isomers: Isomer[] = [];

    if (type === "Alkane") {
      switch (carbonCount) {
        case 1:
        case 2:
        case 3:
          isomers.push({
            name: `${getCarbonName(carbonCount)}ane`,
            structure: drawLinearAlkane(carbonCount),
            iupacName: `${getCarbonName(carbonCount)}ane`,
            molecularFormula: `C${carbonCount}H${2 * carbonCount + 2}`,
          });
          break;
        case 4:
          isomers.push(
            {
              name: "n-Butane",
              structure: drawLinearAlkane(4),
              iupacName: "butane",
              molecularFormula: "C4H10",
            },
            {
              name: "Isobutane",
              structure: drawBranchedAlkane("isobutane"),
              iupacName: "2-methylpropane",
              molecularFormula: "C4H10",
            }
          );
          break;
        case 5:
          isomers.push(
            {
              name: "n-Pentane",
              structure: drawLinearAlkane(5),
              iupacName: "pentane",
              molecularFormula: "C5H12",
            },
            {
              name: "Isopentane",
              structure: drawBranchedAlkane("isopentane"),
              iupacName: "2-methylbutane",
              molecularFormula: "C5H12",
            },
            {
              name: "Neopentane",
              structure: drawBranchedAlkane("neopentane"),
              iupacName: "2,2-dimethylpropane",
              molecularFormula: "C5H12",
            }
          );
          break;
        case 6:
          isomers.push(
            {
              name: "n-Hexane",
              structure: drawLinearAlkane(6),
              iupacName: "hexane",
              molecularFormula: "C6H14",
            },
            {
              name: "2-Methylpentane",
              structure: drawBranchedAlkane("2-methylpentane"),
              iupacName: "2-methylpentane",
              molecularFormula: "C6H14",
            },
            {
              name: "3-Methylpentane",
              structure: drawBranchedAlkane("3-methylpentane"),
              iupacName: "3-methylpentane",
              molecularFormula: "C6H14",
            },
            {
              name: "2,2-Dimethylbutane",
              structure: drawBranchedAlkane("2,2-dimethylbutane"),
              iupacName: "2,2-dimethylbutane",
              molecularFormula: "C6H14",
            },
            {
              name: "2,3-Dimethylbutane",
              structure: drawBranchedAlkane("2,3-dimethylbutane"),
              iupacName: "2,3-dimethylbutane",
              molecularFormula: "C6H14",
            }
          );
          break;
        default:
          isomers.push({
            name: `Linear ${getCarbonName(carbonCount)}ane`,
            structure: drawLinearAlkane(carbonCount),
            iupacName: `${getCarbonName(carbonCount)}ane`,
            molecularFormula: `C${carbonCount}H${2 * carbonCount + 2}`,
          });
      }
    }

    return isomers;
  };

  const getCarbonName = (count: number): string => {
    const names = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
    return names[count] || `C${count}`;
  };

  const drawLinearAlkane = (carbonCount: number): string => {
    // Generate SVG for linear alkane chain
    const width = Math.max(400, carbonCount * 60);
    const height = 120;
    const startX = 50;
    const startY = 60;
    const spacing = 60;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Draw carbon chain
    for (let i = 0; i < carbonCount; i++) {
      const x = startX + i * spacing;
      const y = startY;
      
      // Draw C label
      svg += `<text x="${x}" y="${y}" font-size="16" font-weight="bold" text-anchor="middle" fill="#000">C</text>`;
      
      // Draw bond to next carbon
      if (i < carbonCount - 1) {
        svg += `<line x1="${x + 10}" y1="${y - 5}" x2="${x + spacing - 10}" y2="${y - 5}" stroke="#000" stroke-width="2"/>`;
      }
      
      // Draw hydrogen atoms
      if (i === 0 || i === carbonCount - 1) {
        // Terminal carbons have 3 H
        svg += `<text x="${x}" y="${y - 25}" font-size="12" text-anchor="middle" fill="#666">H</text>`;
        svg += `<text x="${x - 20}" y="${y + 5}" font-size="12" text-anchor="middle" fill="#666">H</text>`;
        svg += `<text x="${x + 20}" y="${y + 5}" font-size="12" text-anchor="middle" fill="#666">H</text>`;
      } else {
        // Middle carbons have 2 H
        svg += `<text x="${x}" y="${y - 25}" font-size="12" text-anchor="middle" fill="#666">H</text>`;
        svg += `<text x="${x}" y="${y + 20}" font-size="12" text-anchor="middle" fill="#666">H</text>`;
      }
    }
    
    svg += `</svg>`;
    return svg;
  };

  const drawBranchedAlkane = (type: string): string => {
    const width = 400;
    const height = 200;
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    switch (type) {
      case "isobutane": // 2-methylpropane
        svg += `
          <text x="150" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="210" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="270" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="210" y="50" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <line x1="160" y1="95" x2="200" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="220" y1="95" x2="260" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="210" y1="85" x2="210" y2="60" stroke="#000" stroke-width="2"/>
          <text x="150" y="80" font-size="12" fill="#666">H₃</text>
          <text x="270" y="80" font-size="12" fill="#666">H₃</text>
          <text x="210" y="35" font-size="12" fill="#666">H₃</text>
          <text x="210" y="120" font-size="12" fill="#666">H</text>
        `;
        break;

      case "isopentane": // 2-methylbutane
        svg += `
          <text x="120" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="180" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="240" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="300" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="180" y="50" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <line x1="130" y1="95" x2="170" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="190" y1="95" x2="230" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="250" y1="95" x2="290" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="180" y1="85" x2="180" y2="60" stroke="#000" stroke-width="2"/>
        `;
        break;

      case "neopentane": // 2,2-dimethylpropane
        svg += `
          <text x="200" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="260" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="140" y="100" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="200" y="50" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <text x="200" y="150" font-size="16" font-weight="bold" text-anchor="middle">C</text>
          <line x1="210" y1="95" x2="250" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="150" y1="95" x2="190" y2="95" stroke="#000" stroke-width="2"/>
          <line x1="200" y1="85" x2="200" y2="60" stroke="#000" stroke-width="2"/>
          <line x1="200" y1="110" x2="200" y2="140" stroke="#000" stroke-width="2"/>
        `;
        break;

      case "2-methylpentane":
      case "3-methylpentane":
      case "2,2-dimethylbutane":
      case "2,3-dimethylbutane":
        svg += `<text x="200" y="100" font-size="14" text-anchor="middle" fill="#666">Complex branched structure</text>`;
        break;
    }

    svg += `</svg>`;
    return svg;
  };

  const downloadIsomer = (isomer: Isomer) => {
    const blob = new Blob([isomer.structure], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isomer.name.replace(/[^a-z0-9]/gi, '_')}.svg`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `${isomer.name} structure saved as SVG`,
    });
  };

  const quickSelect = (c: number) => {
    setCarbonCount(c.toString());
    setHydrogenCount((2 * c + 2).toString());
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
                <Atom className="h-8 w-8" />
                Hydrocarbon Isomer Diagrams
              </CardTitle>
              <CardDescription>
                Generate and visualize all structural isomers for a given molecular formula
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbon-count">Number of Carbon Atoms</Label>
                  <Input
                    id="carbon-count"
                    type="number"
                    min="1"
                    max="10"
                    value={carbonCount}
                    onChange={(e) => setCarbonCount(e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrogen-count">Number of Hydrogen Atoms</Label>
                  <Input
                    id="hydrogen-count"
                    type="number"
                    min="2"
                    max="30"
                    value={hydrogenCount}
                    onChange={(e) => setHydrogenCount(e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="space-y-2">
                <Label>Quick Select (Alkanes):</Label>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5, 6, 7, 8].map((c) => (
                    <Button
                      key={c}
                      variant="outline"
                      size="sm"
                      onClick={() => quickSelect(c)}
                    >
                      C{c}H{2 * c + 2}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                className="w-full bg-gradient-primary border-0"
                onClick={generateIsomers}
              >
                <Atom className="h-4 w-4 mr-2" />
                Generate Isomers
              </Button>

              {/* Results */}
              {isomers.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Molecular Formula: {molecularFormula}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total Isomers: {isomers.length}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {isomers.map((isomer, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-lg">{isomer.name}</CardTitle>
                          <CardDescription>IUPAC: {isomer.iupacName}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div 
                            className="bg-white p-4 rounded border flex items-center justify-center min-h-[150px]"
                            dangerouslySetInnerHTML={{ __html: isomer.structure }}
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-mono text-muted-foreground">
                              {isomer.molecularFormula}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadIsomer(isomer)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download SVG
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-blue-900">📚 Quick Reference:</p>
                <ul className="text-blue-800 space-y-1 ml-4 list-disc">
                  <li><strong>Alkanes:</strong> C<sub>n</sub>H<sub>2n+2</sub> (single bonds only)</li>
                  <li><strong>Alkenes:</strong> C<sub>n</sub>H<sub>2n</sub> (one double bond)</li>
                  <li><strong>Alkynes:</strong> C<sub>n</sub>H<sub>2n-2</sub> (one triple bond)</li>
                  <li><strong>Isomers:</strong> Same molecular formula, different structures</li>
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

export default IsomerDiagrams;
