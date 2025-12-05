import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'counting' | 'reading' | 'writing' | 'drawing' | 'default';
}

const variantStyles = {
  counting: 'from-primary to-warning',
  reading: 'from-secondary to-[hsl(195,80%,50%)]',
  writing: 'from-game-writing to-accent',
  drawing: 'from-accent to-[hsl(340,80%,60%)]',
  default: 'from-primary to-secondary',
};

export const ProgressBar = ({ current, total, variant = 'default' }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>Soal {current} dari {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full bg-gradient-to-r rounded-full transition-all duration-500 ease-out',
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
