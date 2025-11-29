import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const ImageCompressor = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      compressImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageData: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const compressed = canvas.toDataURL("image/jpeg", quality[0] / 100);
      setCompressedImage(compressed);
      // Estimate compressed size
      const base64Length = compressed.length - (compressed.indexOf(",") + 1);
      const estimatedSize = (base64Length * 3) / 4;
      setCompressedSize(estimatedSize);
    };
    img.src = imageData;
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const a = document.createElement("a");
    a.href = compressedImage;
    a.download = "compressed-image.jpg";
    a.click();
    toast({
      title: "Downloaded!",
      description: "Compressed image saved successfully",
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <HomeButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Image Compressor
          </h1>
          <p className="text-muted-foreground">Reduce image file size without losing quality</p>
        </div>

        <Card className="p-6 max-w-4xl mx-auto">
          {!originalImage ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload an image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports JPG, PNG, and other image formats
              </p>
              <label htmlFor="image-upload">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Original ({formatBytes(originalSize)})</Label>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">
                    Compressed ({formatBytes(compressedSize)})
                    {originalSize > 0 && (
                      <span className="text-primary ml-2">
                        ({Math.round((1 - compressedSize / originalSize) * 100)}% smaller)
                      </span>
                    )}
                  </Label>
                  {compressedImage && (
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="w-full h-64 object-cover rounded-lg border border-border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="quality">Quality: {quality[0]}%</Label>
                <Slider
                  id="quality"
                  value={quality}
                  onValueChange={(value) => {
                    setQuality(value);
                    if (originalImage) compressImage(originalImage);
                  }}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadImage} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed
                </Button>
                <label htmlFor="image-upload-new" className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      New Image
                    </span>
                  </Button>
                </label>
                <input
                  id="image-upload-new"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ImageCompressor;
