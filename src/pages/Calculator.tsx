import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Delete, History, MemoryStick, Copy, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import SEO from "@/components/SEO";
import { useToolTracking } from "@/hooks/useToolTracking";

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator = () => {
  useToolTracking("Calculator");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<"basic" | "scientific">("basic");
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("deg");
  const inputRef = useRef<HTMLInputElement>(null);

  // Constants
  const constants = {
    π: Math.PI,
    e: Math.E,
    φ: (1 + Math.sqrt(5)) / 2, // Golden ratio
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      else if (e.key === '.') handleDecimal();
      else if (e.key === '+') handleOperation('+');
      else if (e.key === '-') handleOperation('-');
      else if (e.key === '*') handleOperation('×');
      else if (e.key === '/') { e.preventDefault(); handleOperation('÷'); }
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape') handleClear();
      else if (e.key === 'Backspace') handleBackspace();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, operation, previousValue, newNumber]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setExpression(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
      setExpression(expression + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
      setExpression(display + " " + op + " ");
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(String(result) + " " + op + " ");
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
      case "^": return Math.pow(a, b);
      case "mod": return a % b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      const expr = expression + display;
      
      addToHistory(expr, String(result));
      setDisplay(String(result));
      setExpression(expr + " = " + result);
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setExpression(expression + ".");
      setNewNumber(false);
    }
  };

  // Scientific functions
  const handleScientific = (func: string) => {
    const current = parseFloat(display);
    let result: number;
    
    switch (func) {
      case "sin":
        result = angleUnit === "deg" ? Math.sin(current * Math.PI / 180) : Math.sin(current);
        break;
      case "cos":
        result = angleUnit === "deg" ? Math.cos(current * Math.PI / 180) : Math.cos(current);
        break;
      case "tan":
        result = angleUnit === "deg" ? Math.tan(current * Math.PI / 180) : Math.tan(current);
        break;
      case "log":
        result = Math.log10(current);
        break;
      case "ln":
        result = Math.log(current);
        break;
      case "sqrt":
        result = Math.sqrt(current);
        break;
      case "x²":
        result = current * current;
        break;
      case "x³":
        result = current * current * current;
        break;
      case "1/x":
        result = 1 / current;
        break;
      case "!":
        result = factorial(current);
        break;
      case "π":
        result = constants.π;
        break;
      case "e":
        result = constants.e;
        break;
      case "%":
        result = current / 100;
        break;
      default:
        result = current;
    }
    
    addToHistory(`${func}(${display})`, String(result));
    setDisplay(String(result));
    setExpression(String(result));
    setNewNumber(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    toast({ title: "Memory Added", description: `M = ${memory + parseFloat(display)}` });
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    toast({ title: "Memory Subtracted", description: `M = ${memory - parseFloat(display)}` });
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setExpression(String(memory));
    setNewNumber(true);
    toast({ title: "Memory Recalled", description: `Value: ${memory}` });
  };

  const memoryClear = () => {
    setMemory(0);
    toast({ title: "Memory Cleared", description: "M = 0" });
  };

  // History management
  const addToHistory = (expr: string, result: string) => {
    const newItem: HistoryItem = {
      expression: expr,
      result: result,
      timestamp: new Date()
    };
    setHistory([newItem, ...history].slice(0, 50)); // Keep last 50
  };

  const loadFromHistory = (item: HistoryItem) => {
    setDisplay(item.result);
    setExpression(item.expression);
    setNewNumber(true);
  };

  const clearHistory = () => {
    setHistory([]);
    toast({ title: "History Cleared", description: "All calculations cleared" });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(display);
    toast({ title: "Copied!", description: "Result copied to clipboard" });
  };

  const downloadHistory = () => {
    const content = history.map(item => 
      `${item.expression} = ${item.result} (${item.timestamp.toLocaleString()})`
    ).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculator-history.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "History saved to file" });
  };

  // Expression evaluator
  const evaluateExpression = () => {
    try {
      // Safe evaluation (replace operators and use Function)
      const expr = inputRef.current?.value || "";
      const sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, String(Math.PI))
        .replace(/e/g, String(Math.E));
      
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      addToHistory(expr, String(result));
      setDisplay(String(result));
      setExpression(expr + " = " + result);
      setNewNumber(true);
    } catch (error) {
      toast({ 
        title: "Invalid Expression", 
        description: "Please check your input", 
        variant: "destructive" 
      });
    }
  };

  const basicButtons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "log"],
    ["ln", "sqrt", "x²", "x³"],
    ["1/x", "!", "π", "e"],
    ["(", ")", "^", "mod"],
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Free Online Calculator - Basic & Scientific"
        description="Free online calculator with basic and scientific modes. Calculate complex math operations, trigonometry, logarithms, and more. Features memory functions and calculation history."
        keywords="online calculator, free calculator, scientific calculator, math calculator, basic calculator, calculator online"
        canonical="https://aismartkit.tech/calculator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Online Calculator",
          "description": "Free online calculator with basic and scientific modes",
          "url": "https://aismartkit.tech/calculator",
          "applicationCategory": "UtilityApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
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
                title: "Choose Your Mode",
                description: "Switch between Basic mode for simple calculations or Scientific mode for advanced functions like trigonometry and logarithms."
              },
              {
                title: "Enter Your Calculation",
                description: "Click buttons or type directly using your keyboard. Use the expression field for complex calculations like '2*(3+4)' or 'sin(45)'."
              },
              {
                title: "Use Memory Functions",
                description: "Store values with M+, subtract with M-, recall with MR, or clear memory with MC. Current memory value is always visible."
              },
              {
                title: "View History",
                description: "All calculations are saved in the history panel. Click any history item to reload it, or download your history as JSON."
              }
            ]}
            tips={[
              { text: "Toggle between DEG and RAD for trigonometric functions" },
              { text: "Use constants π, e, and φ for mathematical calculations" },
              { text: "Press Escape to clear the calculator at any time" },
              { text: "Expression evaluator supports parentheses and complex formulas" },
              { text: "History saves your last 50 calculations automatically" }
            ]}
            shortcuts={[
              { keys: "0-9", action: "Enter numbers" },
              { keys: "+ - * /", action: "Basic operations" },
              { keys: "Enter", action: "Calculate result" },
              { keys: "Escape", action: "Clear all" },
              { keys: "Backspace", action: "Delete last character" }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Calculator */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl">Scientific Calculator</CardTitle>
                      <CardDescription>Advanced calculations with memory and history</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyResult}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Expression Input */}
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="text-right text-sm text-muted-foreground font-mono min-h-[20px]">
                      {expression}
                    </div>
                    <div className="text-right text-4xl font-mono font-bold break-all">
                      {display}
                    </div>
                  </div>

                  {/* Expression Evaluator */}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="Enter expression: 2*(3+4) or sin(45)"
                      className="font-mono"
                      onKeyDown={(e) => e.key === 'Enter' && evaluateExpression()}
                    />
                    <Button onClick={evaluateExpression}>Eval</Button>
                  </div>

                  {/* Memory & Mode Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={memoryAdd} title="Memory Add">
                        M+
                      </Button>
                      <Button size="sm" variant="outline" onClick={memorySubtract} title="Memory Subtract">
                        M-
                      </Button>
                      <Button size="sm" variant="outline" onClick={memoryRecall} title="Memory Recall">
                        MR
                      </Button>
                      <Button size="sm" variant="outline" onClick={memoryClear} title="Memory Clear">
                        MC
                      </Button>
                      <Button size="sm" variant="outline" disabled className="font-mono">
                        M: {memory.toFixed(2)}
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant={angleUnit === "deg" ? "default" : "outline"}
                        onClick={() => setAngleUnit("deg")}
                      >
                        DEG
                      </Button>
                      <Button 
                        size="sm" 
                        variant={angleUnit === "rad" ? "default" : "outline"}
                        onClick={() => setAngleUnit("rad")}
                      >
                        RAD
                      </Button>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={handleClear}>Clear (ESC)</Button>
                    <Button variant="outline" onClick={handleBackspace}>
                      <Delete className="h-4 w-4 mr-2" />
                      Backspace
                    </Button>
                    <Button variant="outline" onClick={() => handleScientific("%")}>
                      %
                    </Button>
                  </div>

                  <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="scientific">Scientific</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-2 mt-4">
                      <div className="grid grid-cols-4 gap-2">
                        {basicButtons.map((row, i) => (
                          row.map((btn) => (
                            <Button
                              key={btn}
                              variant={["+", "-", "×", "÷", "="].includes(btn) ? "default" : "outline"}
                              className={`h-14 text-xl font-semibold ${["+", "-", "×", "÷", "="].includes(btn) ? "bg-gradient-primary border-0" : ""}`}
                              onClick={() => {
                                if (btn === "=") handleEquals();
                                else if (["+", "-", "×", "÷"].includes(btn)) handleOperation(btn);
                                else if (btn === ".") handleDecimal();
                                else handleNumber(btn);
                              }}
                            >
                              {btn}
                            </Button>
                          ))
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="scientific" className="space-y-2 mt-4">
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {scientificButtons.map((row, i) => (
                          row.map((btn) => (
                            <Button
                              key={btn}
                              variant="outline"
                              className="h-12 text-sm font-medium"
                              onClick={() => {
                                if (["sin", "cos", "tan", "log", "ln", "sqrt", "x²", "x³", "1/x", "!", "π", "e", "%"].includes(btn)) {
                                  handleScientific(btn);
                                } else if (["^", "mod"].includes(btn)) {
                                  handleOperation(btn);
                                } else if (["(", ")"].includes(btn)) {
                                  setExpression(expression + btn);
                                  setDisplay(display === "0" ? btn : display + btn);
                                  setNewNumber(false);
                                }
                              }}
                            >
                              {btn}
                            </Button>
                          ))
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {basicButtons.map((row, i) => (
                          row.map((btn) => (
                            <Button
                              key={btn + "-sci"}
                              variant={["+", "-", "×", "÷", "="].includes(btn) ? "default" : "outline"}
                              className={`h-12 text-lg ${["+", "-", "×", "÷", "="].includes(btn) ? "bg-gradient-primary border-0" : ""}`}
                              onClick={() => {
                                if (btn === "=") handleEquals();
                                else if (["+", "-", "×", "÷"].includes(btn)) handleOperation(btn);
                                else if (btn === ".") handleDecimal();
                                else handleNumber(btn);
                              }}
                            >
                              {btn}
                            </Button>
                          ))
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="text-xs text-muted-foreground text-center">
                    💡 Tip: Use keyboard for quick calculations. Press ESC to clear.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History & Constants Panel */}
            <div className="space-y-4">
              {/* History */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      History
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={downloadHistory} disabled={history.length === 0}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={clearHistory} disabled={history.length === 0}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No calculations yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => loadFromHistory(item)}
                        >
                          <div className="font-mono text-sm">{item.expression}</div>
                          <div className="font-mono text-lg font-semibold">= {item.result}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Constants Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Constants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(constants).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="font-semibold">{key}</span>
                      <span className="font-mono text-sm">{value.toFixed(10)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
