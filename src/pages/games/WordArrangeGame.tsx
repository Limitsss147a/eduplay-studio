import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface WordData {
  word: string;
  image: string;
  hint: string;
}

interface WordQuestion extends WordData {
  id: number;
}

const wordBank: WordData[] = [
  { word: 'APEL', image: '🍎', hint: 'Buah merah yang segar' },
  { word: 'BUKU', image: '📚', hint: 'Untuk membaca' },
  { word: 'KUCING', image: '🐱', hint: 'Hewan berbulu lembut' },
  { word: 'RUMAH', image: '🏠', hint: 'Tempat tinggal' },
  { word: 'BUNGA', image: '🌸', hint: 'Tumbuhan yang indah' },
  { word: 'PISANG', image: '🍌', hint: 'Buah kuning' },
  { word: 'AYAM', image: '🐔', hint: 'Hewan berkokok' },
  { word: 'IKAN', image: '🐟', hint: 'Hewan di air' },
  { word: 'BOLA', image: '⚽', hint: 'Untuk bermain' },
  { word: 'KUDA', image: '🐴', hint: 'Hewan berkaki empat' },
  { word: 'SAPI', image: '🐄', hint: 'Hewan penghasil susu' },
  { word: 'PANDA', image: '🐼', hint: 'Hewan hitam putih' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (count: number = 5): WordQuestion[] => {
  const shuffled = shuffleArray(wordBank);
  return shuffled.slice(0, count).map((word, index) => ({
    ...word,
    id: index,
  }));
};

export const WordArrangeGame = () => {
  const { progress, addStars } = useGame();
  const { 
    playCorrect, playWrong, playClick, playSelect, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  
  const [questions, setQuestions] = useState<WordQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initGame = useCallback(() => {
    const newQuestions = generateQuestions(5);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    
    if (newQuestions.length > 0) {
      initQuestion(newQuestions[0]);
    }
  }, []);

  const initQuestion = (question: WordQuestion) => {
    const letters = question.word.split('');
    const shuffled = shuffleArray(letters);
    setShuffledLetters(shuffled);
    setSelectedLetters([]);
    setAvailableIndices(shuffled.map((_, i) => i));
  };

  useEffect(() => {
    initGame();
    // Auto-start background music when game loads
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      initQuestion(questions[currentIndex]);
    }
  }, [currentIndex, questions]);

  const handleLetterSelect = (index: number) => {
    if (feedback !== null) return;
    
    playSelect();
    const letter = shuffledLetters[index];
    setSelectedLetters(prev => [...prev, letter]);
    setAvailableIndices(prev => prev.filter(i => i !== index));
  };

  const handleLetterRemove = (selectedIndex: number) => {
    if (feedback !== null) return;
    
    playClick();
    const letter = selectedLetters[selectedIndex];
    
    // Find the original index in shuffledLetters
    const originalIndex = shuffledLetters.findIndex((l, i) => 
      l === letter && !availableIndices.includes(i) && 
      !selectedLetters.slice(0, selectedIndex).filter(sl => sl === letter).length
    );
    
    // Simple approach: find first matching unavailable index
    const matchingIndices = shuffledLetters
      .map((l, i) => ({ letter: l, index: i }))
      .filter(item => item.letter === letter && !availableIndices.includes(item.index));
    
    if (matchingIndices.length > 0) {
      setAvailableIndices(prev => [...prev, matchingIndices[0].index].sort((a, b) => a - b));
    }
    
    setSelectedLetters(prev => prev.filter((_, i) => i !== selectedIndex));
  };

  const handleReset = () => {
    if (feedback !== null) return;
    playClick();
    initQuestion(questions[currentIndex]);
  };

  const checkAnswer = useCallback(() => {
    const answer = selectedLetters.join('');
    const isCorrect = answer === questions[currentIndex].word;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStars('reading', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  }, [selectedLetters, questions, currentIndex, playCorrect, playWrong, addStars]);

  useEffect(() => {
    if (questions.length > 0 && selectedLetters.length === questions[currentIndex]?.word.length) {
      // Small delay before checking
      const timer = setTimeout(checkAnswer, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedLetters, questions, currentIndex, checkAnswer]);

  const handleNextQuestion = () => {
    setFeedback(null);
    
    if (currentIndex + 1 >= questions.length) {
      playLevelComplete();
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const starsEarned = correctCount >= 4 ? 3 : correctCount >= 3 ? 2 : correctCount >= 1 ? 1 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader 
        title="Susun Kata"
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
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        {/* Image Display */}
        <div className="bg-card rounded-3xl shadow-card p-6 w-full max-w-sm text-center">
          <span className="text-8xl animate-float block mb-2">{currentQuestion.image}</span>
          <p className="text-muted-foreground text-sm">{currentQuestion.hint}</p>
        </div>
        
        {/* Answer Area */}
        <div className="bg-card rounded-2xl shadow-card p-4 w-full max-w-sm min-h-[60px] flex items-center justify-center gap-2 flex-wrap">
          {selectedLetters.length === 0 ? (
            <span className="text-muted-foreground">Ketuk huruf untuk menyusun kata</span>
          ) : (
            selectedLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleLetterRemove(index)}
                disabled={feedback !== null}
                className={cn(
                  'w-12 h-12 text-xl font-bold rounded-xl transition-all duration-200',
                  'shadow-md hover:scale-105 active:scale-95',
                  feedback === true
                    ? 'bg-success text-success-foreground animate-bounce'
                    : feedback === false
                    ? 'bg-destructive text-destructive-foreground animate-shake'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {letter}
              </button>
            ))
          )}
        </div>
        
        {/* Letter Options */}
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterSelect(index)}
              disabled={!availableIndices.includes(index) || feedback !== null}
              className={cn(
                'w-14 h-14 text-2xl font-bold rounded-2xl transition-all duration-200',
                'shadow-card hover:shadow-lg',
                availableIndices.includes(index)
                  ? 'bg-primary text-primary-foreground hover:scale-110 active:scale-95'
                  : 'bg-muted text-muted-foreground opacity-30 cursor-not-allowed'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
        
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={feedback !== null || selectedLetters.length === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            (feedback !== null || selectedLetters.length === 0) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Ulangi</span>
        </button>
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
        />
      )}
    </div>
  );
};

export default WordArrangeGame;
