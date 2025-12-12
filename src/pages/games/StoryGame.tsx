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

interface StoryQuestion {
  id: number;
  story: string;
  question: string;
  options: { text: string; image: string }[];
  correctIndex: number;
}

const storyBank: StoryQuestion[] = [
  {
    id: 1,
    story: 'Ani pergi ke pasar. Ani membeli buah apel.',
    question: 'Ani membeli apa?',
    options: [
      { text: 'Apel', image: '🍎' },
      { text: 'Pisang', image: '🍌' },
      { text: 'Jeruk', image: '🍊' },
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    story: 'Budi punya kucing. Kucing Budi berwarna putih.',
    question: 'Apa warna kucing Budi?',
    options: [
      { text: 'Hitam', image: '🐈‍⬛' },
      { text: 'Putih', image: '🐱' },
      { text: 'Coklat', image: '🟤' },
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    story: 'Ibu memasak nasi goreng. Ayah makan nasi goreng.',
    question: 'Siapa yang memasak?',
    options: [
      { text: 'Ayah', image: '👨' },
      { text: 'Kakak', image: '👦' },
      { text: 'Ibu', image: '👩' },
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    story: 'Dina bermain bola di halaman. Dina bermain bersama Rudi.',
    question: 'Dina bermain dengan siapa?',
    options: [
      { text: 'Rudi', image: '👦' },
      { text: 'Siti', image: '👧' },
      { text: 'Sendiri', image: '🧍' },
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    story: 'Rina punya lima pensil. Rina memberi dua pensil untuk Tono.',
    question: 'Berapa pensil yang Rina beri?',
    options: [
      { text: 'Satu', image: '1️⃣' },
      { text: 'Dua', image: '2️⃣' },
      { text: 'Tiga', image: '3️⃣' },
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    story: 'Kakak pergi ke sekolah naik sepeda. Adik pergi naik mobil.',
    question: 'Kakak naik apa?',
    options: [
      { text: 'Mobil', image: '🚗' },
      { text: 'Bus', image: '🚌' },
      { text: 'Sepeda', image: '🚲' },
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    story: 'Hari ini hujan deras. Ani membawa payung biru.',
    question: 'Ani membawa apa?',
    options: [
      { text: 'Tas', image: '🎒' },
      { text: 'Payung', image: '☂️' },
      { text: 'Buku', image: '📚' },
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    story: 'Nenek tinggal di desa. Nenek menanam padi di sawah.',
    question: 'Nenek menanam apa?',
    options: [
      { text: 'Jagung', image: '🌽' },
      { text: 'Bunga', image: '🌸' },
      { text: 'Padi', image: '🌾' },
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    story: 'Siti suka makan roti. Siti makan roti setiap pagi.',
    question: 'Siti suka makan apa?',
    options: [
      { text: 'Roti', image: '🍞' },
      { text: 'Nasi', image: '🍚' },
      { text: 'Mie', image: '🍜' },
    ],
    correctIndex: 0,
  },
  {
    id: 10,
    story: 'Tono bermain di taman. Tono melihat burung di pohon.',
    question: 'Tono melihat apa?',
    options: [
      { text: 'Kucing', image: '🐱' },
      { text: 'Burung', image: '🐦' },
      { text: 'Kelinci', image: '🐰' },
    ],
    correctIndex: 1,
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (count: number = 5): StoryQuestion[] => {
  return shuffleArray(storyBank).slice(0, count);
};

export const StoryGame = () => {
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  const { speak } = useSpeech();
  
  const [questions, setQuestions] = useState<StoryQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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

  const handleSpeakStory = () => {
    playClick();
    const current = questions[currentIndex];
    speak(current.story + '. ' + current.question, 0.8);
  };

  const handleAnswer = (index: number) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentIndex].correctIndex;
    
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
        title="Soal Cerita"
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
        {/* Story Card */}
        <div className="bg-card rounded-3xl shadow-card p-6 w-full max-w-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">Baca cerita ini:</p>
            <button
              onClick={handleSpeakStory}
              className="p-3 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors active:scale-95"
            >
              <Volume2 className="w-5 h-5 text-primary" />
            </button>
          </div>
          
          <p className="text-xl font-medium text-foreground leading-relaxed mb-4">
            {currentQuestion.story}
          </p>
          
          <div className="border-t border-border pt-4">
            <p className="text-lg font-bold text-primary">
              {currentQuestion.question}
            </p>
          </div>
        </div>
        
        {/* Answer Options */}
        <div className="w-full max-w-sm space-y-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card',
                'transition-all duration-200 hover:scale-[1.02] active:scale-95',
                selectedAnswer === i
                  ? i === currentQuestion.correctIndex
                    ? 'ring-4 ring-success bg-success/10'
                    : 'ring-4 ring-destructive bg-destructive/10 animate-shake'
                  : selectedAnswer !== null && i === currentQuestion.correctIndex
                    ? 'ring-4 ring-success bg-success/10'
                    : 'hover:shadow-lg'
              )}
            >
              <span className="text-4xl">{option.image}</span>
              <span className="text-xl font-bold text-foreground">{option.text}</span>
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

export default StoryGame;
