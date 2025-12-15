import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: 'wordArrange' | 'readMatch' | 'story' | 'sentence';
  stars: number;
  onClick: () => void;
}

const variantStyles = {
  wordArrange: 'from-[hsl(280,75%,55%)] via-[hsl(300,70%,50%)] to-[hsl(330,80%,55%)] hover:shadow-[hsl(280,75%,55%)]/50', // Purple-Magenta-Pink
  readMatch: 'from-[hsl(170,80%,40%)] via-[hsl(190,85%,45%)] to-[hsl(210,80%,50%)] hover:shadow-[hsl(170,80%,40%)]/50', // Teal-Cyan-Blue
  story: 'from-[hsl(25,90%,55%)] via-[hsl(35,95%,50%)] to-[hsl(45,90%,50%)] hover:shadow-[hsl(25,90%,55%)]/50', // Orange-Amber-Yellow
  sentence: 'from-[hsl(140,70%,45%)] via-[hsl(160,75%,40%)] to-[hsl(180,70%,45%)] hover:shadow-[hsl(140,70%,45%)]/50', // Green-Emerald-Teal
};

export const GameCard = ({ title, description, icon, variant, stars, onClick }: GameCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full p-6 rounded-3xl bg-gradient-to-br text-primary-foreground',
        'transform transition-all duration-300 ease-out',
        'hover:scale-[1.03] hover:-translate-y-3 hover:rotate-1 active:scale-95 active:rotate-0',
        'shadow-lg hover:shadow-2xl',
        'focus:outline-none focus:ring-4 focus:ring-white/30',
        'overflow-hidden group',
        variantStyles[variant]
      )}
    >
      {/* Animated background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 bg-white/10 rounded-full transform group-hover:scale-150 group-hover:rotate-45 transition-all duration-700 ease-out" />
      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-8 -mb-8 bg-white/10 rounded-full transform group-hover:scale-150 group-hover:-rotate-45 transition-all duration-700 ease-out" />
      <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-white/5 rounded-full transform scale-0 group-hover:scale-[3] transition-transform duration-500 ease-out" />
      
      {/* Sparkle effects on hover */}
      <div className="absolute top-6 left-1/4 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
      <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100" />
      
      {/* Stars badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full transform group-hover:scale-110 transition-transform duration-300">
        <Star className="w-4 h-4 fill-warning text-warning animate-pulse" />
        <span className="text-sm font-bold">{stars}</span>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-start text-left">
        <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-4 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">{description}</p>
      </div>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
    </button>
  );
};
