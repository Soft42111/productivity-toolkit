import { useEffect, useState } from "react";

const Beams = () => {
  const [beams, setBeams] = useState<{ id: number; delay: number; duration: number; left: string }[]>([]);

  useEffect(() => {
    const generateBeams = () => {
      const newBeams = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
        left: `${Math.random() * 100}%`,
      }));
      setBeams(newBeams);
    };

    generateBeams();
    const interval = setInterval(generateBeams, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {beams.map((beam) => (
        <div
          key={beam.id}
          className="absolute top-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent"
          style={{
            left: beam.left,
            height: "100%",
            animation: `beam-flash ${beam.duration}s linear ${beam.delay}s infinite`,
            opacity: 0,
            filter: "blur(1px)",
          }}
        />
      ))}
      <style>{`
        @keyframes beam-flash {
          0%, 100% { opacity: 0; transform: translateY(-100%); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default Beams;
