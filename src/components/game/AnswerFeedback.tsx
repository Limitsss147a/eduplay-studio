import React, { useEffect, useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerFeedbackProps {
  isCorrect: boolean | null;
  starsEarned?: number;
  onComplete?: () => void;
}

export const AnswerFeedback = ({ isCorrect, starsEarned = 1, onComplete }: AnswerFeedbackProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isCorrect !== null) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, onComplete]);

  if (!show || isCorrect === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm animate-pop">
      <div className={cn(
        'flex flex-col items-center p-8 rounded-3xl shadow-2xl',
        isCorrect ? 'bg-success' : 'bg-destructive'
      )}>
        <div className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center mb-4',
          isCorrect ? 'bg-white/20' : 'bg-white/20'
        )}>
          {isCorrect ? (
            <Check className="w-14 h-14 text-primary-foreground" />
          ) : (
            <X className="w-14 h-14 text-primary-foreground" />
          )}
        </div>
        
        <p className="text-2xl font-bold text-primary-foreground mb-2">
          {isCorrect ? 'Hebat! 🎉' : 'Coba Lagi! 💪'}
        </p>
        
        {isCorrect && starsEarned > 0 && (
          <div className="flex gap-1 mt-2">
            {Array.from({ length: starsEarned }).map((_, i) => (
              <Star 
                key={i} 
                className="w-8 h-8 fill-warning text-warning animate-bounce-soft"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
