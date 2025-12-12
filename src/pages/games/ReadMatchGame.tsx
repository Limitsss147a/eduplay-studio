import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

interface WordData {
  word: string;
  image: string;
  syllables: string[];
}

const wordBank: WordData[] = [
  { word: 'BUKU', image: '📚', syllables: ['BU', 'KU'] },
  { word: 'KUDA', image: '🐴', syllables: ['KU', 'DA'] },
  { word: 'MEJA', image: '🪑', syllables: ['ME', 'JA'] },
  { word: 'BOLA', image: '⚽', syllables: ['BO', 'LA'] },
  { word: 'SAPI', image: '🐄', syllables: ['SA', 'PI'] },
  { word: 'TOPI', image: '🎩', syllables: ['TO', 'PI'] },
  { word: 'ROTI', image: '🍞', syllables: ['RO', 'TI'] },
  { word: 'KAKI', image: '🦶', syllables: ['KA', 'KI'] },
  { word: 'MATA', image: '👁️', syllables: ['MA', 'TA'] },
  { word: 'GIGI', image: '🦷', syllables: ['GI', 'GI'] },
  { word: 'PADI', image: '🌾', syllables: ['PA', 'DI'] },
  { word: 'NASI', image: '🍚', syllables: ['NA', 'SI'] },
];

const allImages = wordBank.map(w => ({ word: w.word, image: w.image }));

interface Question {
  id: number;
  word: string;
  syllables: string[];
  correctImage: string;
  options: { word: string; image: string }[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (count: number = 5): Question[] => {
  const shuffled = shuffleArray(wordBank);
  return shuffled.slice(0, count).map((item, index) => {
    const wrongOptions = allImages
      .filter(img => img.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const options = shuffleArray([
      { word: item.word, image: item.image },
      ...wrongOptions
    ]);

    return {
      id: index,
      word: item.word,
      syllables: item.syllables,
      correctImage: item.image,
      options,
    };
  });
};

export const ReadMatchGame = () => {
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  const { speak, speakSyllables } = useSpeech();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false);

  const initGame = useCallback(() => {
    const newQuestions = generateQuestions(5);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setHasCompletedLevel(false);
  }, []);

  useEffect(() => {
    initGame();
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  const addStarsRef = useRef(addStars);
  addStarsRef.current = addStars;

  const handleSpeakWord = () => {
    playClick();
    const current = questions[currentIndex];
    speakSyllables(current.word, current.syllables);
  };

  const handleAnswer = (selectedImage: string) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(selectedImage);
    const isCorrect = selectedImage === questions[currentIndex].correctImage;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('reading', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  };

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    
    if (currentIndex + 1 >= questions.length) {
      playLevelComplete();
      setIsComplete(true);
      if (!hasCompletedLevel) {
        completeLevel('reading');
        setHasCompletedLevel(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length, playLevelComplete, hasCompletedLevel, completeLevel]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const starsEarned = correctCount >= 4 ? 3 : correctCount >= 3 ? 2 : correctCount >= 1 ? 1 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader 
        title="Baca & Cocokkan"
        stars={progress.reading.stars}
        variant="reading"
        isMuted={isMuted}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleMute={toggleMute}
        onToggleBgMusic={toggleBgMusic}
      />
      
      <ProgressBar 
        current={currentIndex + 1} 
        total={questions.length} 
        variant="reading"
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Word Display */}
        <div className="bg-card rounded-3xl shadow-card p-6 w-full max-w-sm text-center">
          <p className="text-sm text-muted-foreground mb-2">Baca kata ini:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-foreground tracking-wider">
              {currentQuestion.word}
            </span>
            <button
              onClick={handleSpeakWord}
              className="p-3 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors active:scale-95"
            >
              <Volume2 className="w-6 h-6 text-primary" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ketuk 🔊 untuk mendengar
          </p>
        </div>
        
        {/* Instruction */}
        <p className="text-lg font-medium text-muted-foreground">
          Pilih gambar yang cocok:
        </p>
        
        {/* Image Options */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option.image)}
              disabled={selectedAnswer !== null}
              className={cn(
                'aspect-square rounded-2xl bg-card shadow-card p-4 flex items-center justify-center',
                'transition-all duration-200 hover:scale-105 active:scale-95',
                selectedAnswer === option.image
                  ? option.image === currentQuestion.correctImage
                    ? 'ring-4 ring-success bg-success/10'
                    : 'ring-4 ring-destructive bg-destructive/10 animate-shake'
                  : selectedAnswer !== null && option.image === currentQuestion.correctImage
                    ? 'ring-4 ring-success bg-success/10'
                    : 'hover:shadow-lg'
              )}
            >
              <span className="text-6xl">{option.image}</span>
            </button>
          ))}
        </div>
      </main>
      
      <AnswerFeedback 
        isCorrect={feedback} 
        onComplete={handleNextQuestion}
      />
      
      {isComplete && (
        <LevelComplete
          starsEarned={starsEarned}
          totalQuestions={questions.length}
          correctAnswers={correctCount}
          variant="reading"
          onReplay={initGame}
          onContinue={initGame}
        />
      )}
    </div>
  );
};

export default ReadMatchGame;
