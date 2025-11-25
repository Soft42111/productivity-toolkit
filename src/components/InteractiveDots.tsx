import { useEffect, useRef } from "react";

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
      const spacing = isMobile ? 40 : 25; // Larger spacing on mobile for performance
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
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const mouse = mouseRef.current;
      const interactionRadius = window.innerWidth < 768 ? 80 : 120;
      const repelForce = 0.4;
      const springForce = 0.08;
      const damping = 0.92;

      dotsRef.current.forEach((dot) => {
        if (mouse.isActive) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius) {
            const force = ((interactionRadius - distance) / interactionRadius) * repelForce;
            dot.vx += (dx / distance) * force;
            dot.vy += (dy / distance) * force;
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

        // Draw dot
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--muted-foreground")
          .trim() || "hsl(215 20% 65%)";
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
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
        const clickRadius = 150;

        if (distance < clickRadius) {
          const force = ((clickRadius - distance) / clickRadius) * 1.2;
          dot.vx += (dx / distance) * force;
          dot.vy += (dy / distance) * force;
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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ isolation: "isolate" }}
    />
  );
};

export default InteractiveDots;
