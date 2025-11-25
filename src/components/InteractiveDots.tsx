import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
}

const InteractiveDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const animationFrameRef = useRef<number>();
  const { theme, systemTheme } = useTheme();
  const [dotColor, setDotColor] = useState("#64748b");

  useEffect(() => {
    // Update dot color based on theme
    const currentTheme = theme === "system" ? systemTheme : theme;
    if (currentTheme === "dark") {
      setDotColor("#94a3b8"); // Lighter for dark mode
    } else {
      setDotColor("#64748b"); // Darker for light mode
    }
  }, [theme, systemTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initDots();
    };

    const initDots = () => {
      const isMobile = window.innerWidth < 768;
      const spacing = isMobile ? 35 : 20; // Tighter spacing for more dots
      const cols = Math.ceil(window.innerWidth / spacing);
      const rows = Math.ceil(window.innerHeight / spacing);

      dotsRef.current = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          dotsRef.current.push({
            x,
            y,
            originalX: x,
            originalY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const animate = () => {
      // Create trailing effect with semi-transparent clear
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const mouse = mouseRef.current;
      const interactionRadius = window.innerWidth < 768 ? 120 : 180;
      const repelForce = 1.2;
      const springForce = 0.15;
      const damping = 0.85;

      dotsRef.current.forEach((dot) => {
        if (mouse.isActive) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius && distance > 0) {
            const force = Math.pow((interactionRadius - distance) / interactionRadius, 2) * repelForce;
            const angle = Math.atan2(dy, dx);
            dot.vx += Math.cos(angle) * force;
            dot.vy += Math.sin(angle) * force;
          }
        }

        // Spring back to original position
        const dx = dot.originalX - dot.x;
        const dy = dot.originalY - dot.y;
        dot.vx += dx * springForce;
        dot.vy += dy * springForce;

        // Apply velocity with damping
        dot.vx *= damping;
        dot.vy *= damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Calculate velocity for color shift
        const velocity = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
        const maxVelocity = 10;
        const velocityRatio = Math.min(velocity / maxVelocity, 1);
        
        // Map velocity to hue (0-360 degrees for rainbow effect)
        const hue = velocityRatio * 280; // 0 = red/white, 280 = blue/purple
        const saturation = velocityRatio * 70; // More saturated when moving faster
        const lightness = 90 - velocityRatio * 20; // Slightly darker when moving
        
        // Calculate distance from original position for glow effect
        const distFromOrigin = Math.sqrt(
          Math.pow(dot.x - dot.originalX, 2) + Math.pow(dot.y - dot.originalY, 2)
        );
        const maxDist = 60;
        const glowAmount = Math.min(distFromOrigin / maxDist, 1);

        // Draw dot with velocity-based color and subtle glow
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.globalAlpha = 0.5 + glowAmount * 0.2;
        
        // Add subtle glow
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = 3 + glowAmount * 4;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for next dot
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const handleClick = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        isActive: true,
      };
      
      // Create a stronger pulse effect on click
      dotsRef.current.forEach((dot) => {
        const dx = dot.x - e.clientX;
        const dy = dot.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const clickRadius = 200;

        if (distance < clickRadius && distance > 0) {
          const force = Math.pow((clickRadius - distance) / clickRadius, 2) * 2.5;
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force;
          dot.vy += Math.sin(angle) * force;
        }
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          isActive: true,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isActive = false;
    };

    updateCanvasSize();
    animate();

    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default InteractiveDots;
