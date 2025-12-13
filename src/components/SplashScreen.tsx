import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'bg-gradient-to-br from-primary via-secondary to-accent',
        'transition-opacity duration-500',
        isFading ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-6xl animate-float-slow" style={{ top: '10%', left: '10%' }}>📚</span>
        <span className="absolute text-5xl animate-float-slow" style={{ top: '15%', right: '15%', animationDelay: '0.5s' }}>✏️</span>
        <span className="absolute text-6xl animate-float-slow" style={{ bottom: '20%', left: '15%', animationDelay: '1s' }}>🎨</span>
        <span className="absolute text-5xl animate-float-slow" style={{ bottom: '15%', right: '10%', animationDelay: '1.5s' }}>⭐</span>
        <span className="absolute text-4xl animate-float-slow" style={{ top: '40%', left: '5%', animationDelay: '0.3s' }}>🌈</span>
        <span className="absolute text-4xl animate-float-slow" style={{ top: '35%', right: '8%', animationDelay: '0.8s' }}>🎵</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-scale-in">
        {/* Logo/Icon */}
        <div className="text-9xl animate-bounce-slow">
          🎮
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-wider">
            EduPlay
          </h1>
          <p className="text-xl text-white/90 mt-2 font-medium">
            Belajar Sambil Bermain
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-2 mt-6">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
