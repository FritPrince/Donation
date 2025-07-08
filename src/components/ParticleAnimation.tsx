import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ParticleAnimationProps {
  trigger: boolean;
  onComplete: () => void;
}

const ParticleAnimation: React.FC<ParticleAnimationProps> = ({ trigger, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Create particles
    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color: `hsl(${120 + Math.random() * 60}, 70%, 50%)`
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tree trunk
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 50);
      ctx.lineTo(centerX, centerY + 150);
      ctx.stroke();

      // Animate particles forming tree
      particles.forEach((particle, index) => {
        // Move towards tree formation
        const targetX = centerX + (index % 20 - 10) * 15;
        const targetY = centerY - (Math.floor(index / 20) * 20);
        
        particle.x += (targetX - particle.x) * 0.05;
        particle.y += (targetY - particle.y) * 0.05;
        particle.life -= 0.005;

        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      if (particles.some(p => p.life > 0)) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, onComplete]);

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
        trigger ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};

export default ParticleAnimation;