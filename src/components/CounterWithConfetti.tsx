import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface CounterProps {
  current: number;
  target: number;
  onTargetReached: () => void;
}

const CounterWithConfetti: React.FC<CounterProps> = ({ current, target, onTargetReached }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);

  useEffect(() => {
    const increment = (current - displayValue) / 60;
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        const newValue = prev + increment;
        if (newValue >= current) {
          if (current >= target && !hasReachedTarget) {
            setHasReachedTarget(true);
            onTargetReached();
            triggerConfetti();
          }
          return current;
        }
        return newValue;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [current, target, displayValue, hasReachedTarget, onTargetReached]);

  const triggerConfetti = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Create confetti particles
    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: Math.random() * 8 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confetti.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.rotation += particle.rotationSpeed;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        ctx.restore();
        
        // Remove particles that fall off screen
        if (particle.y > canvas.height + 10) {
          confetti.splice(index, 1);
        }
      });
      
      if (confetti.length > 0) {
        requestAnimationFrame(animateConfetti);
      }
    };

    animateConfetti();
  };

  const percentage = (displayValue / target) * 100;

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ display: hasReachedTarget ? 'block' : 'none' }}
      />
      
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            ${Math.floor(displayValue).toLocaleString()}
          </div>
          <div className="text-xl text-gray-600">
            sur ${target.toLocaleString()} objectif
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold">{percentage.toFixed(1)}% atteint</span>
          </div>
          <div className="text-gray-500">
            ${(target - displayValue).toLocaleString()} restants
          </div>
        </div>

        {hasReachedTarget && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-bounce">
            <p className="text-green-800 font-semibold">🎉 Objectif atteint ! Merci pour votre soutien !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterWithConfetti;