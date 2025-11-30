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

const ImageEnhancer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementLevel, setEnhancementLevel] = useState([50]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke("enhance-image", {
        body: {
          image: originalImage,
          enhancementLevel: enhancementLevel[0],
        },
      });

      if (error) throw error;

      if (data?.enhancedImage) {
        setEnhancedImage(data.enhancedImage);
        toast({
          title: "Image enhanced!",
          description: "Your image has been enhanced successfully",
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
                  <Slider
                    value={enhancementLevel}
                    onValueChange={setEnhancementLevel}
                    min={0}
                    max={100}
                    step={10}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Original</h3>
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full rounded-lg border border-border"
                    />
                  </div>
                  {enhancedImage && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Enhanced</h3>
                      <img
                        src={enhancedImage}
                        alt="Enhanced"
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
