import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

interface Question {
  id: number;
  type: 'letter' | 'word' | 'syllable';
  display: string;
  question: string;
  answer: string;
  options: string[];
  image?: string;
}

const words = [
  { word: 'APEL', syllables: 'A-PEL', image: '🍎' },
  { word: 'BUKU', syllables: 'BU-KU', image: '📚' },
  { word: 'KUCING', syllables: 'KU-CING', image: '🐱' },
  { word: 'RUMAH', syllables: 'RU-MAH', image: '🏠' },
  { word: 'MATAHARI', syllables: 'MA-TA-HA-RI', image: '☀️' },
  { word: 'BUNGA', syllables: 'BU-NGA', image: '🌸' },
  { word: 'PISANG', syllables: 'PI-SANG', image: '🍌' },
  { word: 'AYAM', syllables: 'A-YAM', image: '🐔' },
];

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const generateQuestions = (level: number): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < 2) {
      // Letter recognition
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const wrongLetters = letters.filter(l => l !== letter).sort(() => Math.random() - 0.5).slice(0, 3);
      questions.push({
        id: i,
        type: 'letter',
        display: letter,
        question: 'Huruf apa ini?',
        answer: letter,
        options: [letter, ...wrongLetters].sort(() => Math.random() - 0.5),
      });
    } else if (i < 4) {
      // Word-image matching
      const wordObj = words[Math.floor(Math.random() * words.length)];
      const wrongWords = words.filter(w => w.word !== wordObj.word).sort(() => Math.random() - 0.5).slice(0, 3);
      questions.push({
        id: i,
        type: 'word',
        display: wordObj.image!,
        question: 'Apa nama gambar ini?',
        answer: wordObj.word,
        options: [wordObj.word, ...wrongWords.map(w => w.word)].sort(() => Math.random() - 0.5),
        image: wordObj.image,
      });
    } else {
      // Syllable reading
      const wordObj = words[Math.floor(Math.random() * words.length)];
      const wrongSyllables = words.filter(w => w.word !== wordObj.word).sort(() => Math.random() - 0.5).slice(0, 3);
      questions.push({
        id: i,
        type: 'syllable',
        display: wordObj.syllables,
        question: 'Gabungkan suku kata ini!',
        answer: wordObj.word,
        options: [wordObj.word, ...wrongSyllables.map(w => w.word)].sort(() => Math.random() - 0.5),
      });
    }
  }
  
  return questions;
};

export const ReadingGame = () => {
  const { progress, addStars } = useGame();
  const { 
    playCorrect, playWrong, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic 
  } = useSound();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const initGame = useCallback(() => {
    setQuestions(generateQuestions(progress.reading.level));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setSelectedAnswer(null);
  }, [progress.reading.level]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answer: string) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].answer;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStars('reading', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    
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
        title="Membaca"
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
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Display card */}
        <div className="bg-card rounded-3xl shadow-card p-8 mb-6 w-full max-w-sm text-center relative">
          <button
            onClick={() => speakText(currentQuestion.display)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
          >
            <Volume2 className="w-6 h-6 text-secondary" />
          </button>
          
          {currentQuestion.type === 'word' ? (
            <span className="text-8xl animate-float">{currentQuestion.display}</span>
          ) : currentQuestion.type === 'letter' ? (
            <span className="text-9xl font-bold text-secondary animate-pop">{currentQuestion.display}</span>
          ) : (
            <span className="text-4xl font-bold text-secondary tracking-widest">{currentQuestion.display}</span>
          )}
        </div>
        
        {/* Question */}
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          {currentQuestion.question}
        </h2>
        
        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={cn(
                'py-4 px-4 text-lg font-bold rounded-2xl transition-all duration-200',
                'hover:scale-105 active:scale-95',
                'shadow-card hover:shadow-lg',
                selectedAnswer === option
                  ? option === currentQuestion.answer
                    ? 'bg-success text-success-foreground'
                    : 'bg-destructive text-destructive-foreground animate-shake'
                  : selectedAnswer !== null && option === currentQuestion.answer
                    ? 'bg-success text-success-foreground'
                    : 'bg-card text-foreground hover:bg-secondary/10'
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
          variant="reading"
          onReplay={initGame}
        />
      )}
    </div>
  );
};

export default ReadingGame;
