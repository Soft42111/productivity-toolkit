import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Wand2 } from "lucide-react";
import HomeButton from "@/components/HomeButton";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const ImageEnhancer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementLevel, setEnhancementLevel] = useState([50]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const applyCanvasEnhancements = (
    imageData: ImageData,
    level: number
  ): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const factor = level / 100;

    // Step 1: Noise reduction for smoother results
    if (factor > 0.3) {
      const newData = new Uint8ClampedArray(data);
      const radius = Math.floor(factor * 2);
      
      for (let y = radius; y < height - radius; y++) {
        for (let x = radius; x < width - radius; x++) {
          let r = 0, g = 0, b = 0, count = 0;
          
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              count++;
            }
          }
          
          const idx = (y * width + x) * 4;
          newData[idx] = r / count;
          newData[idx + 1] = g / count;
          newData[idx + 2] = b / count;
        }
      }
      
      data.set(newData);
    }

    // Step 2: Enhanced sharpening with unsharp mask
    if (factor > 0.4) {
      const sharpenKernel = [
        0, -1, 0,
        -1, 5 + factor * 2, -1,
        0, -1, 0
      ];
      
      const newData = new Uint8ClampedArray(data);
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            let ki = 0;
            
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4 + c;
                sum += data[idx] * sharpenKernel[ki++];
              }
            }
            
            const idx = (y * width + x) * 4 + c;
            newData[idx] = Math.max(0, Math.min(255, sum));
          }
        }
      }
      
      data.set(newData);
    }

    // Step 3: Brightness and contrast adjustments
    const brightness = 1 + (factor * 0.35);
    const contrast = 1 + (factor * 0.6);

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      r *= brightness;
      g *= brightness;
      b *= brightness;

      // Apply contrast (centered around 128)
      r = ((r - 128) * contrast) + 128;
      g = ((g - 128) * contrast) + 128;
      b = ((b - 128) * contrast) + 128;

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    // Step 4: Enhanced color saturation with vibrance
    const saturation = 1 + (factor * 0.5);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const maxChannel = Math.max(r, g, b);
      const minChannel = Math.min(r, g, b);
      const chromaDiff = maxChannel - minChannel;
      
      // Apply vibrance (affects less saturated colors more)
      const vibranceFactor = 1 - (chromaDiff / 255);
      const adjustedSat = 1 + (saturation - 1) * vibranceFactor;
      
      data[i] = Math.max(0, Math.min(255, gray + (r - gray) * adjustedSat));
      data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * adjustedSat));
      data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * adjustedSat));
    }

    // Step 5: Edge enhancement for extra clarity
    if (factor > 0.6) {
      const edgeStrength = (factor - 0.6) * 2.5;
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          for (let c = 0; c < 3; c++) {
            const idx = (y * width + x) * 4 + c;
            const center = data[idx];
            
            // Calculate gradient
            const left = data[((y) * width + (x - 1)) * 4 + c];
            const right = data[((y) * width + (x + 1)) * 4 + c];
            const top = data[((y - 1) * width + x) * 4 + c];
            const bottom = data[((y + 1) * width + x) * 4 + c];
            
            const gradient = Math.abs(right - left) + Math.abs(bottom - top);
            const enhancement = gradient * edgeStrength * 0.1;
            
            data[idx] = Math.max(0, Math.min(255, center + enhancement));
          }
        }
      }
    }

    return imageData;
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setEnhancedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const enhanceImage = async () => {
    if (!originalImage) return;

    setIsEnhancing(true);
    
    try {
      const level = enhancementLevel[0];
      
      // Step 1: Apply canvas-based enhancements first
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      // Create canvas for processing
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data and apply enhancements
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const enhancedData = applyCanvasEnhancements(imageData, level);
      ctx.putImageData(enhancedData, 0, 0);

      // Get the canvas-enhanced image
      const canvasEnhanced = canvas.toDataURL("image/png");

      // Step 2: Only use AI for final polish at very high levels (>75)
      if (level > 75) {
        toast({
          title: "Applying minimal AI polish...",
          description: "Just smoothing final details",
        });

        const aiPrompt = "Very subtle final polish only: smooth any minor artifacts, blend slight imperfections. Make minimal changes, preserve all the existing quality and enhancements. Only fix obvious flaws.";

        const { data, error } = await supabase.functions.invoke("enhance-image", {
          body: {
            image: canvasEnhanced,
            enhancementLevel: 30, // AI only contributes 30%
            prompt: aiPrompt,
          },
        });

        if (error) throw error;

        if (data?.enhancedImage) {
          setEnhancedImage(data.enhancedImage);
          toast({
            title: "Enhancement complete!",
            description: "70% canvas algorithms + 30% AI polish",
          });
        }
      } else {
        // For lower levels, just use canvas processing (100% local)
        setEnhancedImage(canvasEnhanced);
        toast({
          title: "Enhancement complete!",
          description: "100% client-side processing (instant)",
        });
      }
    } catch (error) {
      console.error("Error enhancing image:", error);
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const downloadImage = () => {
    if (!enhancedImage) return;

    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = "enhanced-image.png";
    link.click();
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
            Image Enhancer
          </h1>
          <p className="text-muted-foreground">Enhance your images with AI</p>
        </div>

        <Card className="p-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <label 
                htmlFor="image-upload"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="w-full"
              >
                <div className={`cursor-pointer border-2 border-dashed rounded-lg p-12 transition-all ${
                  isDragging 
                    ? "border-primary bg-primary/5 scale-105" 
                    : "border-border hover:border-primary"
                }`}>
                  <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    {isDragging ? "Drop your image here" : "Drag and drop an image here"}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    or click to browse
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {originalImage && (
              <>
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Enhancement Level: {enhancementLevel[0]}%
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {enhancementLevel[0] >= 75
                      ? "Maximum: Advanced algorithms (70%) + AI polish (30%)"
                      : enhancementLevel[0] >= 50
                      ? "High: Advanced canvas processing (100% local, instant)"
                      : enhancementLevel[0] >= 25
                      ? "Medium: Canvas enhancements (100% local, instant)"
                      : "Low: Basic improvements (100% local, instant)"}
                  </p>
                  <Slider
                    value={enhancementLevel}
                    onValueChange={setEnhancementLevel}
                    min={0}
                    max={100}
                    step={25}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={enhanceImage}
                    disabled={isEnhancing}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    {isEnhancing ? "Enhancing..." : "Enhance Image"}
                  </Button>
                  {enhancedImage && (
                    <Button
                      onClick={downloadImage}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {enhancedImage ? (
                    <div>
                      <h3 className="text-sm font-medium mb-4 text-center">
                        Drag the slider to compare before and after
                      </h3>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <ReactCompareSlider
                          itemOne={
                            <ReactCompareSliderImage
                              src={originalImage}
                              alt="Original"
                            />
                          }
                          itemTwo={
                            <ReactCompareSliderImage
                              src={enhancedImage}
                              alt="Enhanced"
                            />
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground text-center">
                        <div>← Original</div>
                        <div>Enhanced →</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Preview</h3>
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ImageEnhancer;
