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
    <div className="flex items-center justify-center">
      {isProcessing ? (
        <div className="w-64 h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      ) : (
        <img
          src={processedImage || robotImage}
          alt="AI Robot"
          className="w-64 h-64 object-contain drop-shadow-2xl"
        />
      )}
    </div>
  );
};

export default RobotHero;
