import robotImage from "@/assets/robot.jpg";

const RobotHero = () => {
  return (
    <div className="flex items-center justify-center">
      <img
        src={robotImage}
        alt="AI Robot"
        className="w-64 h-64 object-contain drop-shadow-2xl animate-fade-in"
        style={{ 
          mixBlendMode: "screen",
          filter: "drop-shadow(0 0 40px rgba(255, 120, 50, 0.3))"
        }}
      />
    </div>
  );
};

export default RobotHero;
