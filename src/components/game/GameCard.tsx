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
  counting: 'from-primary to-warning hover:shadow-primary/40',
  reading: 'from-secondary to-[hsl(195,80%,50%)] hover:shadow-secondary/40',
  writing: 'from-game-writing to-accent hover:shadow-game-writing/40',
  drawing: 'from-accent to-[hsl(340,80%,60%)] hover:shadow-accent/40',
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
