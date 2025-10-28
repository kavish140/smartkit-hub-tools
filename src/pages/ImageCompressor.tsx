import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";
import SEO from "@/components/SEO";
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
      <SEO
        title="Image Compressor"
        description="Compress images in the browser to reduce file size while preserving quality. Supports JPEG/WebP output and shows before/after comparison." 
        keywords="image compressor, compress image, reduce image size, image optimizer, webp, jpeg" 
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
              { title: "Upload Image", description: "Click to browse or drag & drop your image file (JPG, PNG, WebP supported)." },
              { title: "Adjust Quality", description: "Use the slider to set compression level. Lower quality = smaller file size." },
              { title: "Preview Result", description: "See side-by-side comparison of original and compressed images." },
              { title: "Download", description: "Click Download to save the compressed image with reduced file size." }
            ]}
            tips={[
              { text: "70-80% quality usually gives best size/quality balance" },
              { text: "WebP format offers better compression than JPG" },
              { text: "Perfect for optimizing images for web and mobile" },
              { text: "File size reduction shown in real-time" }
            ]}
          />

          <Card className="max-w-4xl mx-auto mt-6">
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
            {/* Detailed explanatory content for SEO (600+ words) */}
            <div className="prose max-w-4xl mx-auto mt-8 text-sm text-muted-foreground">
              <h2>About the Image Compressor</h2>
              <p>
                Images often account for the largest portion of a web page’s payload. The
                Image Compressor helps you reduce file size without sacrificing visible
                quality — ideal when optimizing pages for faster load times, lower mobile
                data usage, or meeting upload limits. This tool performs client-side
                compression, so your images never leave your browser unless you explicitly
                upload them elsewhere.
              </p>

              <h3>How compression works</h3>
              <p>
                Compression reduces file size by removing redundant information and using
                more efficient encoding formats. Lossy compression (e.g., JPEG) discards
                some image detail to achieve smaller files, while lossless formats retain
                exact image data. The quality slider controls the trade-off between size
                and fidelity; a setting around 70–80% often gives good visual results with
                meaningful size reductions.
              </p>

              <h3>Practical tips for best results</h3>
              <p>
                When optimizing for web, resize large images to the exact pixel dimensions
                required by your layout before compression. Use WebP when possible for
                better compression ratios, but provide fallbacks for older browsers if
                needed. Preview images at multiple zoom levels to ensure that compression
                artifacts are acceptable. For photographs, slightly lower quality usually
                yields substantial savings; for graphics with text or line art, higher
                quality settings preserve sharpness.
              </p>

              <h3>Use cases</h3>
              <p>
                - Web performance: Reduce page weight and improve Core Web Vitals scores.
                - Mobile: Lower bandwidth usage for users on limited data plans.
                - Email: Ensure attachments stay within size limits without reformatting.
                - Archival: Create smaller preview images for catalogs and galleries.
              </p>

              <h3>Privacy and security</h3>
              <p>
                All compression is performed in your browser — we do not upload images to
                our servers. This keeps private photos or documents local to your device.
                If you need server-side batch processing or integration into a CI system,
                consider a secure server or cloud function that runs trusted image
                libraries behind controlled access.
              </p>

              <h3>Troubleshooting & limitations</h3>
              <p>
                Extremely small quality values will produce visible artifacts. If your
                original image has transparency (PNG), converting to JPEG will lose
                transparency; WebP can keep transparency and still compress efficiently.
                Very large images may take longer to compress in the browser; downscale
                them first for faster results. For professional-grade workflows, use a
                desktop tool or server-side pipeline that supports advanced options like
                progressive JPEGs and chroma subsampling.
              </p>

              <h3>Related tools</h3>
              <p>
                Combine this with our <a href="/qr-generator">QR Generator</a> for
                producing optimized QR images for print, and our
                <a href="/password-generator"> Password Generator</a> when creating secure
                tokens or credentials to embed in documentation. See the <a href="/privacy-policy">Privacy Policy</a>
                for more details on how we handle data.
              </p>

              <h3>Advanced workflow notes</h3>
              <p>
                For designers and developers, integrate compression into your build or
                CI pipeline using server-side tools when processing large numbers of
                images. This tool is best for ad-hoc optimization and quick previews.
                For automated processing use libraries like Sharp, imagemin, or cloud
                services which allow fine-grained control over chroma subsampling,
                progressive encoding, and format conversion.
              </p>

              <h3>SEO and performance impact</h3>
              <p>
                Optimizing images reduces page weight and speeds up rendering which
                directly improves user experience and search rankings. Smaller images
                reduce TTFB and improve LCP (Largest Contentful Paint) metrics. Always
                balance visual quality with performance needs and test metrics after
                optimization.
              </p>

              <h3>File formats & compatibility</h3>
              <p>
                WebP generally offers better compression for photos but check browser
                support for your audience. JPEG is widely compatible and excellent for
                photographic content; PNG is better for graphics with transparency. Our
                tool supports conversion workflows locally, but be mindful that converting
                between formats may change color profiles and transparency handling.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImageCompressor;
