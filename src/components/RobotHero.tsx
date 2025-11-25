import { useEffect, useState } from "react";
import robotImage from "@/assets/robot.jpg";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

const RobotHero = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsProcessing(true);
        const img = await loadImage(robotImage);
        const blob = await removeBackground(img);
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
      } catch (error) {
        console.error("Failed to process image:", error);
        // Fallback to original image
        setProcessedImage(robotImage);
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();
  }, []);

  return (
    <div className="flex items-center justify-center mb-8">
      {isProcessing ? (
        <div className="w-32 h-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      ) : (
        <img
          src={processedImage || robotImage}
          alt="AI Robot"
          className="w-32 h-32 object-contain"
        />
      )}
    </div>
  );
};

export default RobotHero;
