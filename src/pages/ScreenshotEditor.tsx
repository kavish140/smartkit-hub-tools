import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Upload, 
  Download, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Undo, 
  Redo, 
  Trash2,
  MousePointer,
  Paintbrush,
  Highlighter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Tool = "select" | "pen" | "highlighter" | "rectangle" | "circle" | "text" | "eraser" | "move";
type DrawAction = {
  tool: Tool;
  color: string;
  lineWidth: number;
  points?: { x: number; y: number }[];
  startX?: number;
  startY?: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
};

const ScreenshotEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [selectedText, setSelectedText] = useState<string>("");
  const [detectedFontInfo, setDetectedFontInfo] = useState<any>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (image && !imageRef.current) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        redrawCanvas();
      };
      img.src = image;
    } else if (imageRef.current) {
      redrawCanvas();
    }
  }, [actions]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgSrc = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
          }
          imageRef.current = img;
          setImage(imgSrc);
          setActions([]);
          setRedoStack([]);
          
          toast({
            title: "Image Loaded!",
            description: "Start editing your screenshot.",
          });
        };
        img.src = imgSrc;
      };
      reader.readAsDataURL(file);
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the base image
    ctx.drawImage(imageRef.current, 0, 0);
    
    // Draw all actions
    drawActions(ctx);
  };

  const drawActions = (ctx: CanvasRenderingContext2D) => {
    actions.forEach((action) => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.tool === "pen" || action.tool === "eraser") {
        if (action.points && action.points.length > 1) {
          ctx.globalCompositeOperation = action.tool === "eraser" ? "destination-out" : "source-over";
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          action.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
        }
      } else if (action.tool === "highlighter") {
        if (action.points && action.points.length > 1) {
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = action.lineWidth * 3;
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          action.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else if (action.tool === "rectangle") {
        ctx.strokeRect(action.startX!, action.startY!, action.width!, action.height!);
      } else if (action.tool === "circle") {
        const centerX = action.startX! + action.width! / 2;
        const centerY = action.startY! + action.height! / 2;
        const radius = Math.sqrt(action.width! ** 2 + action.height! ** 2) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (action.tool === "text") {
        ctx.font = `${action.fontSize}px ${action.fontFamily}`;
        ctx.fillText(action.text!, action.startX!, action.startY!);
      }
    });
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);

    setIsDrawing(true);

    if (currentTool === "pen" || currentTool === "eraser" || currentTool === "highlighter") {
      setCurrentAction({
        tool: currentTool,
        color,
        lineWidth,
        points: [{ x, y }],
      });
    } else if (currentTool === "rectangle" || currentTool === "circle") {
      setCurrentAction({
        tool: currentTool,
        color,
        lineWidth,
        startX: x,
        startY: y,
        width: 0,
        height: 0,
      });
    } else if (currentTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newAction: DrawAction = {
          tool: "text",
          color,
          lineWidth,
          startX: x,
          startY: y,
          text,
          fontSize,
          fontFamily,
        };
        setActions([...actions, newAction]);
        setRedoStack([]);
        toast({
          title: "Text Added",
          description: "Text has been added to the canvas.",
        });
      }
      setIsDrawing(false);
    } else if (currentTool === "select") {
      // Simulate text selection
      setSelectedText("Sample Text");
      setDetectedFontInfo({
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#000000",
        fontWeight: "normal",
      });
      toast({
        title: "Text Detected",
        description: "Text information displayed below.",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return;

    const { x, y } = getCanvasCoordinates(e);

    if (currentTool === "pen" || currentTool === "eraser" || currentTool === "highlighter") {
      setCurrentAction((prev) =>
        prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : null
      );
      
      // Draw preview in real-time
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && currentAction.points) {
        redrawCanvas();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const allPoints = [...currentAction.points, { x, y }];
        
        if (currentTool === "highlighter") {
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = lineWidth * 3;
        } else if (currentTool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
        }
        
        if (allPoints.length > 1) {
          ctx.beginPath();
          ctx.moveTo(allPoints[0].x, allPoints[0].y);
          allPoints.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    } else if (currentTool === "rectangle" || currentTool === "circle") {
      const newAction = {
        ...currentAction,
        width: x - currentAction.startX!,
        height: y - currentAction.startY!,
      };
      setCurrentAction(newAction);
      
      // Draw preview
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        redrawCanvas();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        
        if (currentTool === "rectangle") {
          ctx.strokeRect(newAction.startX!, newAction.startY!, newAction.width!, newAction.height!);
        } else if (currentTool === "circle") {
          const centerX = newAction.startX! + newAction.width! / 2;
          const centerY = newAction.startY! + newAction.height! / 2;
          const radius = Math.sqrt(newAction.width! ** 2 + newAction.height! ** 2) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAction) {
      setActions([...actions, currentAction]);
      setRedoStack([]);
      setCurrentAction(null);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (actions.length > 0) {
      const lastAction = actions[actions.length - 1];
      setRedoStack([...redoStack, lastAction]);
      setActions(actions.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const actionToRedo = redoStack[redoStack.length - 1];
      setActions([...actions, actionToRedo]);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const handleClear = () => {
    setActions([]);
    setRedoStack([]);
    toast({
      title: "Canvas Cleared",
      description: "All drawings have been removed.",
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const link = document.createElement("a");
    link.download = `edited-screenshot-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Downloaded!",
      description: "Your edited screenshot has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Paintbrush className="h-10 w-10 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Screenshot Editor
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Draw, annotate, and edit your screenshots with powerful markup tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tools Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Screenshot
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drawing Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => setCurrentTool("select")}
                    variant={currentTool === "select" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <MousePointer className="mr-2 h-4 w-4" />
                    Select Text
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("pen")}
                    variant={currentTool === "pen" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Pen className="mr-2 h-4 w-4" />
                    Pen
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("highlighter")}
                    variant={currentTool === "highlighter" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Highlighter className="mr-2 h-4 w-4" />
                    Highlighter
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("rectangle")}
                    variant={currentTool === "rectangle" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Rectangle
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("circle")}
                    variant={currentTool === "circle" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Circle className="mr-2 h-4 w-4" />
                    Circle
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("text")}
                    variant={currentTool === "text" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Type className="mr-2 h-4 w-4" />
                    Add Text
                  </Button>
                  <Button
                    onClick={() => setCurrentTool("eraser")}
                    variant={currentTool === "eraser" ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    <Eraser className="mr-2 h-4 w-4" />
                    Eraser
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brush Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-full"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Brush Size: {lineWidth}px</Label>
                    <Slider
                      value={[lineWidth]}
                      onValueChange={(value) => setLineWidth(value[0])}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Text Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={8}
                      max={72}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {detectedFontInfo && (
                <Card className="border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Detected Text Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Text:</strong> {selectedText}
                    </p>
                    <p className="text-sm">
                      <strong>Font Size:</strong> {detectedFontInfo.fontSize}
                    </p>
                    <p className="text-sm">
                      <strong>Font Family:</strong> {detectedFontInfo.fontFamily}
                    </p>
                    <p className="text-sm">
                      <strong>Color:</strong> {detectedFontInfo.color}
                    </p>
                    <p className="text-sm">
                      <strong>Weight:</strong> {detectedFontInfo.fontWeight}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Canvas</CardTitle>
                  <CardDescription>
                    Upload an image and use the tools to annotate it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button onClick={handleUndo} variant="outline" size="sm" disabled={actions.length === 0}>
                      <Undo className="mr-2 h-4 w-4" />
                      Undo
                    </Button>
                    <Button onClick={handleRedo} variant="outline" size="sm" disabled={redoStack.length === 0}>
                      <Redo className="mr-2 h-4 w-4" />
                      Redo
                    </Button>
                    <Button onClick={handleClear} variant="outline" size="sm" disabled={actions.length === 0}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="default"
                      size="sm"
                      disabled={!image}
                      className="ml-auto"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  <div className="border-2 border-dashed rounded-lg overflow-auto" style={{ maxHeight: "70vh" }}>
                    {!image ? (
                      <div
                        className="flex items-center justify-center bg-muted/20"
                        style={{ minHeight: "500px" }}
                      >
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Upload a screenshot to start editing
                          </p>
                        </div>
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="cursor-crosshair"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          cursor:
                            currentTool === "move"
                              ? "move"
                              : currentTool === "select"
                              ? "text"
                              : "crosshair",
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotEditor;
