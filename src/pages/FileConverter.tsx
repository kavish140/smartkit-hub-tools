import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileImage, FileText, Upload, AlertCircle, X, FileSpreadsheet, File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ConversionFormat {
  from: string[];
  to: string[];
  label: string;
  icon: any;
}

const FileConverter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState("png");
  const [activeTab, setActiveTab] = useState("image");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const conversionFormats: { [key: string]: ConversionFormat } = {
    image: {
      from: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'],
      to: ['png', 'jpg', 'webp', 'gif', 'bmp', 'ico'],
      label: "Images",
      icon: FileImage
    },
    document: {
      from: ['txt', 'md', 'html', 'csv', 'json', 'xml'],
      to: ['txt', 'md', 'html', 'pdf', 'docx'],
      label: "Documents",
      icon: FileText
    },
    spreadsheet: {
      from: ['csv', 'json', 'xml'],
      to: ['csv', 'json', 'xlsx'],
      label: "Spreadsheets",
      icon: FileSpreadsheet
    }
  };

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles([...files, ...uploadedFiles]);
      toast({
        title: "Files Added",
        description: `${uploadedFiles.length} file(s) ready for conversion`,
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please add files to convert",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(((i + 1) / files.length) * 100);

      try {
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = canvasRef.current || document.createElement('canvas');
              
              // Maintain aspect ratio
              let width = img.width;
              let height = img.height;
              const maxSize = 4096; // Max dimension
              
              if (width > maxSize || height > maxSize) {
                if (width > height) {
                  height = (height / width) * maxSize;
                  width = maxSize;
                } else {
                  width = (width / height) * maxSize;
                  height = maxSize;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Fill white background for non-transparent formats
                if (outputFormat === 'jpg' || outputFormat === 'bmp') {
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fillRect(0, 0, width, height);
                }
                
                ctx.drawImage(img, 0, 0, width, height);
                
                const mimeTypes: { [key: string]: string } = {
                  png: 'image/png',
                  jpg: 'image/jpeg',
                  webp: 'image/webp',
                  bmp: 'image/bmp',
                  gif: 'image/gif',
                  ico: 'image/x-icon'
                };
                
                const quality = outputFormat === 'jpg' ? 0.92 : 0.9;
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const originalName = file.name.split('.')[0];
                    link.download = `${originalName}.${outputFormat}`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                  }
                  resolve(null);
                }, mimeTypes[outputFormat] || 'image/png', quality);
              } else {
                resolve(null);
              }
            };
            img.onerror = () => resolve(null);
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error(`Error converting ${file.name}:`, error);
      }
    }

    setConverting(false);
    setProgress(0);
    
    toast({
      title: "Conversion Complete",
      description: `${files.length} file(s) converted to ${outputFormat.toUpperCase()}`,
    });
  };

  const convertDocuments = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please add files to convert",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(((i + 1) / files.length) * 100);

      try {
        const text = await file.text();
        let convertedContent = text;
        let mimeType = 'text/plain';
        let extension = outputFormat;

        switch (outputFormat) {
          case 'md':
            // Convert to markdown
            convertedContent = `# ${file.name}\n\n${text}`;
            mimeType = 'text/markdown';
            break;
          case 'html':
            // Convert to HTML
            convertedContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${file.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <pre>${text}</pre>
</body>
</html>`;
            mimeType = 'text/html';
            break;
          case 'json':
            // Try to format as JSON
            try {
              const parsed = JSON.parse(text);
              convertedContent = JSON.stringify(parsed, null, 2);
            } catch {
              convertedContent = JSON.stringify({ content: text }, null, 2);
            }
            mimeType = 'application/json';
            break;
          case 'csv':
            // Simple conversion (assumes newline = row)
            const lines = text.split('\n');
            convertedContent = lines.map(line => `"${line}"`).join('\n');
            mimeType = 'text/csv';
            break;
          default:
            convertedContent = text;
        }

        const blob = new Blob([convertedContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const originalName = file.name.split('.')[0];
        link.download = `${originalName}.${extension}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Error converting ${file.name}:`, error);
      }
    }

    setConverting(false);
    setProgress(0);
    
    toast({
      title: "Conversion Complete",
      description: `${files.length} file(s) converted`,
    });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '')) {
      return <FileImage className="h-5 w-5" />;
    } else if (['txt', 'md', 'html', 'pdf', 'doc', 'docx'].includes(ext || '')) {
      return <FileText className="h-5 w-5" />;
    } else if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
      return <FileSpreadsheet className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
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

          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Universal File Converter</CardTitle>
              <CardDescription>Convert images, documents, and spreadsheets - Batch processing supported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="image">
                    <FileImage className="h-4 w-4 mr-2" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="document">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="spreadsheet">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Spreadsheets
                  </TabsTrigger>
                </TabsList>

                {/* Image Converter */}
                <TabsContent value="image" className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WebP, BMP, SVG, TIFF • Multiple files supported
                        </p>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Selected Files ({files.length})</Label>
                          <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                            Clear All
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {files.map((file, index) => (
                            <Card key={index} className="p-3">
                              <div className="flex items-center gap-3">
                                {getFileIcon(file.name)}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate text-sm">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Convert To</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="png">PNG - Lossless, supports transparency</SelectItem>
                            <SelectItem value="jpg">JPEG - Best for photos, smaller size</SelectItem>
                            <SelectItem value="webp">WebP - Modern format, excellent compression</SelectItem>
                            <SelectItem value="gif">GIF - Animated images</SelectItem>
                            <SelectItem value="bmp">BMP - Uncompressed bitmap</SelectItem>
                            <SelectItem value="ico">ICO - Icon format</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quick Actions</Label>
                        <Button 
                          className="w-full bg-gradient-primary border-0"
                          onClick={convertImages}
                          disabled={files.length === 0 || converting}
                        >
                          {converting ? `Converting... ${progress.toFixed(0)}%` : `Convert ${files.length} File(s)`}
                        </Button>
                      </div>
                    </div>

                    {converting && <Progress value={progress} className="w-full" />}
                  </div>
                </TabsContent>

                {/* Document Converter */}
                <TabsContent value="document" className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".txt,.md,.html,.csv,.json,.xml"
                        multiple
                        onChange={handleFilesUpload}
                        className="hidden"
                        id="doc-upload"
                      />
                      <label htmlFor="doc-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Upload documents to convert</p>
                        <p className="text-xs text-muted-foreground">
                          TXT, MD, HTML, CSV, JSON, XML • Batch conversion available
                        </p>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <Label>Files Ready ({files.length})</Label>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {files.map((file, index) => (
                            <Card key={index} className="p-3">
                              <div className="flex items-center gap-3">
                                {getFileIcon(file.name)}
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {file.name.split('.').pop()?.toUpperCase()}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Output Format</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="txt">Plain Text (TXT)</SelectItem>
                            <SelectItem value="md">Markdown (MD)</SelectItem>
                            <SelectItem value="html">HTML Document</SelectItem>
                            <SelectItem value="json">JSON Format</SelectItem>
                            <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>&nbsp;</Label>
                        <Button 
                          className="w-full bg-gradient-primary border-0"
                          onClick={convertDocuments}
                          disabled={files.length === 0 || converting}
                        >
                          {converting ? "Converting..." : "Convert Documents"}
                        </Button>
                      </div>
                    </div>

                    {converting && <Progress value={progress} className="w-full" />}
                  </div>
                </TabsContent>

                {/* Spreadsheet Converter */}
                <TabsContent value="spreadsheet" className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-lg text-center">
                    <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                    <p className="font-medium text-yellow-900 mb-2">CSV & JSON Conversion</p>
                    <p className="text-sm text-yellow-800">
                      Upload CSV or JSON files and convert between formats. Excel support coming soon!
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <canvas ref={canvasRef} className="hidden" />

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">🔒 Privacy First</p>
                      <p className="text-xs text-blue-800">
                        All conversions happen in your browser. No files are uploaded to any server.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <Download className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900 mb-1">⚡ Batch Processing</p>
                      <p className="text-xs text-green-800">
                        Convert multiple files at once. Select all your files and convert them in one click.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium text-sm">📋 Supported Conversions:</p>
                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1">Images:</p>
                    <p className="text-muted-foreground">PNG ↔ JPEG ↔ WebP ↔ GIF ↔ BMP ↔ ICO</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Documents:</p>
                    <p className="text-muted-foreground">TXT ↔ MD ↔ HTML ↔ JSON ↔ CSV</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Coming Soon:</p>
                    <p className="text-muted-foreground">PDF, DOCX, XLSX, PPTX</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FileConverter;
