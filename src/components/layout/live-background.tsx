// @file components/layout/live-background.tsx
'use client';

import { useEffect, useRef } from 'react';

export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Configuration
    const particleCount = 60; // Adjust for density
    const connectionDistance = 150; // Distance to form a mesh line
    const particleSpeed = 0.4;
    const baseColor = 'rgba(255, 255, 255,'; // We will append opacity

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges smoothly
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor} 0.3)`;
        ctx.fill();
      }
    }

    const init = () => {
      // Set actual size in memory (scaled to account for pixel ratio).
      const r = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * r;
      canvas.height = window.innerHeight * r;
      
      // Normalize coordinate system to use css pixels.
      ctx.scale(r, r);

      particles = [];
      const count = Math.floor((window.innerWidth * window.innerHeight) / 25000); // Responsive count
      const clampedCount = Math.min(Math.max(count, 30), 120);

      for (let i = 0; i < clampedCount; i++) {
        particles.push(new Particle(window.innerWidth, window.innerHeight));
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw particles
      particles.forEach((p) => {
        p.update(window.innerWidth, window.innerHeight);
        p.draw(ctx);
      });

      // Draw mesh connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i]!.x - particles[j]!.x;
          const dy = particles[i]!.y - particles[j]!.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i]!.x, particles[i]!.y);
            ctx.lineTo(particles[j]!.x, particles[j]!.y);
            
            // Opacity scales by distance
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `${baseColor} ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ backgroundColor: '#000' }}>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
        style={{ width: '100vw', height: '100vh' }}
      />
      {/* Subtle ambient glows to keep it premium */}
      <div className="absolute top-1/4 left-1/4 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-white/[0.01] blur-[100px]" />
    </div>
  );
}
