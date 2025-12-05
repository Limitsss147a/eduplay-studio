import React from 'react';
import { Star, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LevelCompleteProps {
  starsEarned: number;
  totalQuestions: number;
  correctAnswers: number;
  variant?: 'counting' | 'reading' | 'writing' | 'drawing' | 'default';
  onReplay: () => void;
}

const variantStyles = {
  counting: 'from-primary to-warning',
  reading: 'from-secondary to-[hsl(195,80%,50%)]',
  writing: 'from-game-writing to-accent',
  drawing: 'from-accent to-[hsl(340,80%,60%)]',
  default: 'from-primary to-secondary',
};

export const LevelComplete = ({ 
  starsEarned, 
  totalQuestions, 
  correctAnswers, 
  variant = 'default',
  onReplay 
}: LevelCompleteProps) => {
  const navigate = useNavigate();
  const maxStars = 3;
  const percentage = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-md p-4">
      <div className="bg-card rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop">
        <h2 className="text-3xl font-bold text-foreground mb-2">Level Selesai! 🎉</h2>
        
        <div className="flex justify-center gap-2 my-6">
          {Array.from({ length: maxStars }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                'w-12 h-12 transition-all duration-300',
                i < starsEarned 
                  ? 'fill-warning text-warning animate-bounce-soft' 
                  : 'fill-muted text-muted'
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        
        <div className="bg-muted rounded-2xl p-4 mb-6">
          <p className="text-muted-foreground text-sm mb-2">Skor Kamu</p>
          <p className="text-4xl font-bold text-foreground">{correctAnswers}/{totalQuestions}</p>
          <p className="text-lg text-muted-foreground">{Math.round(percentage)}% Benar</p>
        </div>
        
        <p className="text-muted-foreground mb-6">
          {percentage >= 80 
            ? 'Luar biasa! Kamu sangat hebat! 🌟' 
            : percentage >= 60 
              ? 'Bagus sekali! Terus berlatih! 💪' 
              : 'Jangan menyerah! Coba lagi! 🤗'}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-colors active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>
          <button
            onClick={onReplay}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-all active:scale-95',
              variantStyles[variant]
            )}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
