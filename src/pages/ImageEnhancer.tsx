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

  const applyBasicPreprocessing = (
    imageData: ImageData,
    level: number
  ): ImageData => {
    const data = imageData.data;
    const factor = level / 100;

    // Just basic brightness normalization (10% of the work)
    const brightnessFactor = 1 + (factor * 0.1);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] * brightnessFactor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * brightnessFactor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * brightnessFactor));
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
      
      // Step 1: Minimal preprocessing (10% of work)
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const preprocessed = applyBasicPreprocessing(imageData, level);
      ctx.putImageData(preprocessed, 0, 0);

      const preprocessedImage = canvas.toDataURL("image/png");

      // Step 2: Let AI do 80% of the work
      toast({
        title: "AI is enhancing...",
        description: "Applying professional enhancements",
      });

      let aiPrompt = "";
      
      if (level >= 75) {
        aiPrompt = "DRAMATICALLY transform this image into professional studio quality: maximize sharpness and crystal clarity, make colors incredibly vibrant and rich, perfect lighting with ideal exposure, remove ALL noise and blur completely, enhance fine details to be razor sharp, boost contrast for maximum impact, improve texture definition, make the image absolutely stunning and magazine-quality. Apply aggressive professional-grade enhancements.";
      } else if (level >= 50) {
        aiPrompt = "Significantly enhance this image to high quality: greatly improve sharpness and clarity, boost color vibrancy and saturation substantially, optimize brightness and contrast for visual impact, reduce noise effectively, enhance details and edges, improve overall image quality to look polished and professional. Apply strong enhancements.";
      } else if (level >= 25) {
        aiPrompt = "Enhance this image with noticeable improvements: improve sharpness and definition moderately, boost colors and make them more appealing, balance lighting and contrast better, reduce visible noise, enhance clarity and make the image look cleaner and more refined. Apply moderate enhancements.";
      } else {
        aiPrompt = "Apply gentle enhancements to this image: slightly improve sharpness, make subtle color improvements, adjust brightness for better balance, do minor noise reduction, enhance overall clarity subtly while keeping it natural. Apply light enhancements.";
      }

      const { data, error } = await supabase.functions.invoke("enhance-image", {
        body: {
          image: preprocessedImage,
          enhancementLevel: level,
          prompt: aiPrompt,
        },
      });

      if (error) throw error;

      if (data?.enhancedImage) {
        setEnhancedImage(data.enhancedImage);
        toast({
          title: "Enhancement complete!",
          description: "80% AI + 10% preprocessing = Pro results",
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
                      ? "Maximum: Aggressive AI enhancements (80%) + preprocessing (10%)"
                      : enhancementLevel[0] >= 50
                      ? "High: Strong AI improvements (80%) + preprocessing (10%)"
                      : enhancementLevel[0] >= 25
                      ? "Medium: Moderate AI enhancements (80%) + preprocessing (10%)"
                      : "Low: Gentle AI improvements (80%) + preprocessing (10%)"}
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
