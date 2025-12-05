import React from 'react';
import { ArrowLeft, Star, Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  title: string;
  stars: number;
  onBack?: () => void;
  isMuted?: boolean;
  isBgMusicPlaying?: boolean;
  onToggleMute?: () => void;
  onToggleBgMusic?: () => void;
  variant?: 'counting' | 'reading' | 'writing' | 'drawing' | 'default';
}

const variantStyles = {
  counting: 'from-primary to-warning',
  reading: 'from-secondary to-[hsl(195,80%,50%)]',
  writing: 'from-game-writing to-accent',
  drawing: 'from-accent to-[hsl(340,80%,60%)]',
  default: 'from-primary to-secondary',
};

export const GameHeader = ({ 
  title, 
  stars, 
  onBack, 
  isMuted, 
  isBgMusicPlaying,
  onToggleMute, 
  onToggleBgMusic,
  variant = 'default' 
}: GameHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 bg-gradient-to-r text-primary-foreground',
      'px-4 py-3 shadow-lg',
      variantStyles[variant]
    )}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-lg font-bold">{title}</h1>
        
        <div className="flex items-center gap-2">
          {/* Background music toggle */}
          {onToggleBgMusic && (
            <button
              onClick={onToggleBgMusic}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
            >
              {isBgMusicPlaying ? (
                <Music className="w-5 h-5" />
              ) : (
                <Music2 className="w-5 h-5 opacity-50" />
              )}
            </button>
          )}
          
          {/* Sound effects toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 opacity-50" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Stars display */}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
            <Star className="w-5 h-5 fill-warning text-warning" />
            <span className="font-bold">{stars}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
