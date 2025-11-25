import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  hue: number;
}

const InteractiveDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false, lastX: 0, lastY: 0 });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

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
      const spacing = isMobile ? 50 : 45;
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
            hue: (i * 10 + j * 10) % 360,
          });
        }
      }
    };

    const animate = () => {
      timeRef.current += 0.005;
      
      // Very subtle trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const mouse = mouseRef.current;
      
      // Calculate cursor velocity to dampen fast movements
      const cursorVelocity = Math.sqrt(
        Math.pow(mouse.x - mouse.lastX, 2) + Math.pow(mouse.y - mouse.lastY, 2)
      );
      const velocityDamping = Math.min(1, 5 / Math.max(cursorVelocity, 5));
      
      const interactionRadius = window.innerWidth < 768 ? 120 : 150;
      const repelForce = 1.2 * velocityDamping;
      const springForce = 0.08;
      const damping = 0.90;

      dotsRef.current.forEach((dot) => {
        if (mouse.isActive) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius && distance > 0) {
            // Gentle exponential falloff
            const force = Math.pow((interactionRadius - distance) / interactionRadius, 3) * repelForce;
            const angle = Math.atan2(dy, dx);
            dot.vx += Math.cos(angle) * force;
            dot.vy += Math.sin(angle) * force;
          }
        }

        // Gentle spring back
        const dx = dot.originalX - dot.x;
        const dy = dot.originalY - dot.y;
        dot.vx += dx * springForce;
        dot.vy += dy * springForce;

        // Strong damping for smooth, calm movement
        dot.vx *= damping;
        dot.vy *= damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Very subtle idle animation
        const pulse = Math.sin(timeRef.current * 0.5 + dot.originalX * 0.005 + dot.originalY * 0.005) * 0.15 + 0.85;
        
        // Slow color rotation
        dot.hue = (dot.hue + 0.05) % 360;
        
        // Low contrast, muted colors
        const saturation = 15;
        const lightness = 70;
        
        // Draw dot with low opacity and minimal glow
        ctx.fillStyle = `hsl(${dot.hue}, ${saturation}%, ${lightness}%)`;
        ctx.globalAlpha = 0.25 * pulse;
        
        // Minimal glow
        ctx.shadowColor = `hsl(${dot.hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = 1;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      });

      // Update last mouse position for velocity calculation
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        ...mouseRef.current,
        x: e.clientX,
        y: e.clientY,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = {
          ...mouseRef.current,
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
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
