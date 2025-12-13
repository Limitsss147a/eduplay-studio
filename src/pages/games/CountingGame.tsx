import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { FloatingIcons } from '@/components/game/FloatingIcons';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  type: 'count' | 'addition' | 'subtraction';
  visual: string[];
  question: string;
  answer: number;
  options: number[];
}

const generateQuestions = (level: number): Question[] => {
  const questions: Question[] = [];
  const emojis = ['🍎', '🌟', '🎈', '🐱', '🌸', '🍕', '🚗', '🎁', '🍌', '🐶', '⚽', '🎂', '🍦', '🦋', '🌈'];
  
  for (let i = 0; i < 7; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const maxNum = Math.min(5 + level * 2, 15);
    
    if (i < 3) {
      // Counting questions
      const count = Math.floor(Math.random() * maxNum) + 1;
      const visual = Array(count).fill(emoji);
      questions.push({
        id: i,
        type: 'count',
        visual,
        question: `Berapa banyak ${emoji}?`,
        answer: count,
        options: generateOptions(count, maxNum),
      });
    } else if (i < 5) {
      // Addition
      const num1 = Math.floor(Math.random() * Math.min(5, maxNum / 2)) + 1;
      const num2 = Math.floor(Math.random() * Math.min(5, maxNum / 2)) + 1;
      const visual = [...Array(num1).fill('🔵'), ...Array(num2).fill('🔴')];
      questions.push({
        id: i,
        type: 'addition',
        visual,
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        options: generateOptions(num1 + num2, maxNum + 5),
      });
    } else {
      // Subtraction
      const num1 = Math.floor(Math.random() * maxNum) + 3;
      const num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      const visual = [...Array(num1 - num2).fill('⭐'), ...Array(num2).fill('❌')];
      questions.push({
        id: i,
        type: 'subtraction',
        visual,
        question: `${num1} - ${num2} = ?`,
        answer: num1 - num2,
        options: generateOptions(num1 - num2, maxNum),
      });
    }
  }
  
  return questions;
};

const generateOptions = (correctAnswer: number, max: number): number[] => {
  const options = new Set<number>();
  options.add(correctAnswer);
  
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const option = Math.max(0, Math.min(max, correctAnswer + offset));
    if (option !== correctAnswer) {
      options.add(option);
    }
    if (options.size < 4) {
      options.add(Math.floor(Math.random() * max) + 1);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const CountingGame = () => {
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false);

  const initGame = useCallback(() => {
    setQuestions(generateQuestions(progress.counting.level));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setHasCompletedLevel(false);
  }, [progress.counting.level]);

  useEffect(() => {
    initGame();
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  const addStarsRef = useRef(addStars);
  addStarsRef.current = addStars;

  const handleAnswer = (answer: number) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].answer;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('counting', 1);
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
        completeLevel('counting');
        setHasCompletedLevel(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length, playLevelComplete, hasCompletedLevel, completeLevel]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const starsEarned = correctCount >= 6 ? 3 : correctCount >= 4 ? 2 : correctCount >= 1 ? 1 : 0;

  return (
    <div className="min-h-screen gradient-game-bg flex flex-col relative">
      <FloatingIcons variant="counting" />
      
      <GameHeader 
        title="Berhitung"
        stars={progress.counting.stars}
        variant="counting"
        isMuted={isMuted}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleMute={toggleMute}
        onToggleBgMusic={toggleBgMusic}
      />
      
      <ProgressBar 
        current={currentIndex + 1} 
        total={questions.length} 
        variant="counting"
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Visual display */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-card p-6 mb-6 w-full max-w-sm min-h-[180px] flex flex-wrap items-center justify-center gap-2 border-2 border-primary/20">
          {currentQuestion.visual.map((item, i) => (
            <span 
              key={i} 
              className="text-4xl animate-pop"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {item}
            </span>
          ))}
        </div>
        
        {/* Question */}
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center bg-card/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md">
          {currentQuestion.question}
        </h2>
        
        {/* Options */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={cn(
                'py-6 px-4 text-3xl font-bold rounded-2xl transition-all duration-200',
                'hover:scale-105 active:scale-95',
                'shadow-card hover:shadow-lg',
                selectedAnswer === option
                  ? option === currentQuestion.answer
                    ? 'bg-success text-success-foreground'
                    : 'bg-destructive text-destructive-foreground animate-shake'
                  : selectedAnswer !== null && option === currentQuestion.answer
                    ? 'bg-success text-success-foreground'
                    : 'bg-card/95 backdrop-blur-sm text-foreground hover:bg-primary/10 border-2 border-primary/20'
              )}
            >
              {option}
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
          variant="counting"
          onReplay={initGame}
          onContinue={initGame}
        />
      )}
    </div>
  );
};

export default CountingGame;