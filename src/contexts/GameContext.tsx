import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameProgress {
  wordArrange: { stars: number; level: number; completed: number };
  readMatch: { stars: number; level: number; completed: number };
  story: { stars: number; level: number; completed: number };
  sentence: { stars: number; level: number; completed: number };
  // Legacy keys for backward compatibility
  counting: { stars: number; level: number; completed: number };
  reading: { stars: number; level: number; completed: number };
  writing: { stars: number; level: number; completed: number };
  drawing: { stars: number; level: number; completed: number };
}

interface GameContextType {
  progress: GameProgress;
  totalStars: number;
  addStars: (game: keyof GameProgress, amount: number) => void;
  completeLevel: (game: keyof GameProgress) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  resetProgress: () => void;
}

const defaultProgress: GameProgress = {
  wordArrange: { stars: 0, level: 1, completed: 0 },
  readMatch: { stars: 0, level: 1, completed: 0 },
  story: { stars: 0, level: 1, completed: 0 },
  sentence: { stars: 0, level: 1, completed: 0 },
  // Legacy
  counting: { stars: 0, level: 1, completed: 0 },
  reading: { stars: 0, level: 1, completed: 0 },
  writing: { stars: 0, level: 1, completed: 0 },
  drawing: { stars: 0, level: 1, completed: 0 },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem('eduGameProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default to ensure new keys exist
      return { ...defaultProgress, ...parsed };
    }
    return defaultProgress;
  });
  
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('eduGamePlayerName') || 'Teman';
  });

  const totalStars = Object.values(progress).reduce((sum, game) => sum + game.stars, 0);

  const addStars = (game: keyof GameProgress, amount: number) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [game]: {
          ...prev[game],
          stars: prev[game].stars + amount,
        },
      };
      localStorage.setItem('eduGameProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const completeLevel = (game: keyof GameProgress) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [game]: {
          ...prev[game],
          completed: prev[game].completed + 1,
          level: prev[game].level + 1,
        },
      };
      localStorage.setItem('eduGameProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const handleSetPlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('eduGamePlayerName', name);
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.setItem('eduGameProgress', JSON.stringify(defaultProgress));
  };

  return (
    <GameContext.Provider value={{ 
      progress, 
      totalStars, 
      addStars, 
      completeLevel, 
      playerName, 
      setPlayerName: handleSetPlayerName,
      resetProgress
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
