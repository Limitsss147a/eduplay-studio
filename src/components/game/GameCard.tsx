import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: 'counting' | 'reading' | 'writing' | 'drawing';
  stars: number;
  onClick: () => void;
}

const variantStyles = {
  counting: 'from-[hsl(280,70%,55%)] to-[hsl(320,80%,60%)] hover:shadow-[hsl(280,70%,55%)]/40', // Purple to Pink
  reading: 'from-[hsl(170,70%,45%)] to-[hsl(200,80%,50%)] hover:shadow-[hsl(170,70%,45%)]/40', // Teal to Blue
  writing: 'from-[hsl(35,90%,55%)] to-[hsl(15,85%,55%)] hover:shadow-[hsl(35,90%,55%)]/40', // Orange to Red-Orange
  drawing: 'from-[hsl(340,75%,55%)] to-[hsl(280,70%,55%)] hover:shadow-[hsl(340,75%,55%)]/40', // Rose to Purple
};

export const GameCard = ({ title, description, icon, variant, stars, onClick }: GameCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full p-6 rounded-3xl bg-gradient-to-br text-primary-foreground',
        'transform transition-all duration-300 ease-out',
        'hover:scale-105 hover:-translate-y-2 active:scale-95',
        'shadow-game hover:shadow-2xl',
        'focus:outline-none focus:ring-4 focus:ring-primary/30',
        'overflow-hidden group',
        variantStyles[variant]
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 -ml-6 -mb-6 bg-white/10 rounded-full transform group-hover:scale-125 transition-transform duration-500" />
      
      {/* Stars badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
        <Star className="w-4 h-4 fill-warning text-warning" />
        <span className="text-sm font-bold">{stars}</span>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-start text-left">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  );
};
