import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: 0,
      vy: 0,
      size: 2 + Math.random() * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 150;

        // Repel particles near cursor
        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          particle.vx += (dx / distance) * force * 2;
          particle.vy += (dy / distance) * force * 2;
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.vx *= -0.5;
          particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        }
        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.vy *= -0.5;
          particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
        }

        // Draw particle
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none"
    />
  );
};

export default InteractiveParticles;
