import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, FileImage, FileText, Upload, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FileConverter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState("png");

  const imageFormats = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPEG" },
    { value: "webp", label: "WebP" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setConvertedFile(null);
      
      toast({
        title: "File Loaded",
        description: `${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const convertImage = async () => {
    if (!file) {
      toast({
        title: "No File",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            let mimeType = 'image/png';
            let quality = 0.9;
            
            if (outputFormat === 'jpg') {
              mimeType = 'image/jpeg';
            } else if (outputFormat === 'webp') {
              mimeType = 'image/webp';
            }
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setConvertedFile(url);
                setLoading(false);
                
                toast({
                  title: "Conversion Complete",
                  description: `Image converted to ${outputFormat.toUpperCase()}`,
                });
              }
            }, mimeType, quality);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion",
        variant: "destructive",
      });
    }
  };

  const downloadFile = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      const originalName = file?.name.split('.')[0] || 'converted';
      link.download = `${originalName}.${outputFormat}`;
      link.href = convertedFile;
      link.click();
      
      toast({
        title: "Downloaded",
        description: "Converted file has been downloaded",
      });
    }
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

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">File Converter</CardTitle>
              <CardDescription>Convert files between different formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="image" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">
                    <FileImage className="h-4 w-4 mr-2" />
                    Image Converter
                  </TabsTrigger>
                  <TabsTrigger value="document" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Document Converter
                    <span className="ml-2 text-xs">(Coming Soon)</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported: PNG, JPG, JPEG, WebP, GIF
                          </p>
                        </label>
                      </div>
                    </div>

                    {file && (
                      <Card className="bg-muted">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <FileImage className="h-8 w-8 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select value={outputFormat} onValueChange={setOutputFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary border-0"
                      onClick={convertImage}
                      disabled={!file || loading}
                    >
                      {loading ? "Converting..." : "Convert Image"}
                    </Button>

                    {convertedFile && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-900 font-medium mb-2">✅ Conversion Complete!</p>
                          <div className="bg-white p-4 rounded border">
                            <img 
                              src={convertedFile} 
                              alt="Converted" 
                              className="max-w-full h-auto rounded"
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={downloadFile}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download {outputFormat.toUpperCase()}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="document" className="space-y-6">
                  <div className="text-center py-12 bg-muted rounded-lg">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2 font-medium">
                      Document Converter Coming Soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, TXT conversions will be available in a future update
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">🎨 Image Converter</p>
                    <p className="text-xs">
                      Convert images between PNG, JPEG, and WebP formats entirely in your browser.
                      No files are uploaded to any server - all processing happens locally for your privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">💡 Supported Conversions:</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li><strong>PNG:</strong> Best for graphics with transparency, screenshots</li>
                  <li><strong>JPEG:</strong> Best for photographs, smaller file size</li>
                  <li><strong>WebP:</strong> Modern format with excellent compression</li>
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

export default FileConverter;
