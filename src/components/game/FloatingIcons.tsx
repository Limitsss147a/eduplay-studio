import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingIconsProps {
  variant?: 'counting' | 'reading' | 'default';
}

const iconSets = {
  counting: ['🔢', '➕', '➖', '✖️', '➗', '🎯', '⭐', '🌟', '💯', '🎲'],
  reading: ['📚', '✏️', '📖', '🔤', '📝', '🎨', '🌈', '⭐', '💡', '🎯'],
  default: ['⭐', '🌟', '✨', '💫', '🎈', '🎉', '🌈', '🎯', '💡', '🎮'],
};

export const FloatingIcons: React.FC<FloatingIconsProps> = ({ variant = 'default' }) => {
  const icons = iconSets[variant];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((icon, index) => (
        <span
          key={index}
          className={cn(
            'absolute text-2xl md:text-3xl opacity-20 animate-float-slow',
            'select-none'
          )}
          style={{
            left: `${(index * 10) + 5}%`,
            top: `${(index * 8) + 10}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${6 + (index % 3)}s`,
          }}
        >
          {icon}
        </span>
      ))}
    </div>
  );
};

export default FloatingIcons;