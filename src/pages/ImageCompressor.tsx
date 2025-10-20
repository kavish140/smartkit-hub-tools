import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/hooks/useToolTracking";

const ImageCompressor = () => {
  useToolTracking("Image Compressor");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(0.7);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const reader = new FileReader();
            reader.onload = (e) => {
              setCompressedImage(e.target?.result as string);
              toast({
                title: "Image Compressed!",
                description: `Reduced by ${((1 - blob.size / originalSize) * 100).toFixed(1)}%`,
              });
            };
            reader.readAsDataURL(blob);
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.src = originalImage;
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-image-${Date.now()}.jpg`;
    link.click();

    toast({
      title: "Downloaded!",
      description: "Compressed image has been downloaded",
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <CardTitle className="text-3xl">Image Compressor</CardTitle>
              <CardDescription>Reduce image file sizes without quality loss</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-lg font-medium mb-2">Upload Image</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Click to select or drag and drop
                    </div>
                    <Button asChild>
                      <span>Choose Image</span>
                    </Button>
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {originalImage && (
                  <>
                    <div className="space-y-2">
                      <Label>Compression Quality: {Math.round(quality * 100)}%</Label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Lower Quality (Smaller Size)</span>
                        <span>Higher Quality (Larger Size)</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary border-0" 
                      size="lg"
                      onClick={compressImage}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Compress Image
                    </Button>
                  </>
                )}
              </div>

              {originalImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Original Image</h3>
                      <img src={originalImage} alt="Original" className="w-full rounded mb-2" />
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">{formatSize(originalSize)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {compressedImage && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Compressed Image</h3>
                        <img src={compressedImage} alt="Compressed" className="w-full rounded mb-2" />
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">{formatSize(compressedSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reduced:</span>
                            <span className="font-medium text-green-600">
                              {((1 - compressedSize / originalSize) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          onClick={downloadCompressed}
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Compressed
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Tips:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Works completely offline in your browser</li>
                  <li>• No images are uploaded to any server</li>
                  <li>• Best for JPEG images</li>
                  <li>• Lower quality = smaller file size</li>
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

export default ImageCompressor;
