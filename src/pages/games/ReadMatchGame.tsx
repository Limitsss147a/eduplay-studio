import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { FloatingIcons } from '@/components/game/FloatingIcons';
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
  // Kata dasar
  { word: 'BUKU', image: '📚', syllables: ['BU', 'KU'] },
  { word: 'KUDA', image: '🐴', syllables: ['KU', 'DA'] },
  { word: 'KURSI', image: '🪑', syllables: ['KUR', 'SI'] },
  { word: 'BOLA', image: '⚽', syllables: ['BO', 'LA'] },
  { word: 'SAPI', image: '🐄', syllables: ['SA', 'PI'] },
  { word: 'TOPI', image: '🎩', syllables: ['TO', 'PI'] },
  { word: 'ROTI', image: '🍞', syllables: ['RO', 'TI'] },
  { word: 'KAKI', image: '🦶', syllables: ['KA', 'KI'] },
  { word: 'MATA', image: '👁️', syllables: ['MA', 'TA'] },
  { word: 'GIGI', image: '🦷', syllables: ['GI', 'GI'] },
  { word: 'PADI', image: '🌾', syllables: ['PA', 'DI'] },
  { word: 'NASI', image: '🍚', syllables: ['NA', 'SI'] },
  { word: 'APEL', image: '🍎', syllables: ['A', 'PEL'] },
  { word: 'PISANG', image: '🍌', syllables: ['PI', 'SANG'] },
  { word: 'JERUK', image: '🍊', syllables: ['JE', 'RUK'] },
  { word: 'KUCING', image: '🐱', syllables: ['KU', 'CING'] },
  { word: 'ANJING', image: '🐶', syllables: ['AN', 'JING'] },
  { word: 'BURUNG', image: '🐦', syllables: ['BU', 'RUNG'] },
  { word: 'IKAN', image: '🐟', syllables: ['I', 'KAN'] },
  { word: 'BUNGA', image: '🌸', syllables: ['BU', 'NGA'] },
  { word: 'RUMAH', image: '🏠', syllables: ['RU', 'MAH'] },
  { word: 'MOBIL', image: '🚗', syllables: ['MO', 'BIL'] },
  { word: 'PESAWAT', image: '✈️', syllables: ['PE', 'SA', 'WAT'] },
  { word: 'KAPAL', image: '🚢', syllables: ['KA', 'PAL'] },
  { word: 'SEPEDA', image: '🚲', syllables: ['SE', 'PE', 'DA'] },
  { word: 'PAYUNG', image: '☂️', syllables: ['PA', 'YUNG'] },
  { word: 'LAMPU', image: '💡', syllables: ['LAM', 'PU'] },
  { word: 'BINTANG', image: '⭐', syllables: ['BIN', 'TANG'] },
  { word: 'BULAN', image: '🌙', syllables: ['BU', 'LAN'] },
  { word: 'HUJAN', image: '🌧️', syllables: ['HU', 'JAN'] },
  // Kata tambahan
  { word: 'GAJAH', image: '🐘', syllables: ['GA', 'JAH'] },
  { word: 'SINGA', image: '🦁', syllables: ['SI', 'NGA'] },
  { word: 'ZEBRA', image: '🦓', syllables: ['ZE', 'BRA'] },
  { word: 'KELINCI', image: '🐰', syllables: ['KE', 'LIN', 'CI'] },
  { word: 'HARIMAU', image: '🐯', syllables: ['HA', 'RI', 'MAU'] },
  { word: 'BEBEK', image: '🦆', syllables: ['BE', 'BEK'] },
  { word: 'AYAM', image: '🐔', syllables: ['A', 'YAM'] },
  { word: 'KAMBING', image: '🐐', syllables: ['KAM', 'BING'] },
  { word: 'DOMBA', image: '🐑', syllables: ['DOM', 'BA'] },
  { word: 'KERBAU', image: '🐃', syllables: ['KER', 'BAU'] },
  { word: 'SEMUT', image: '🐜', syllables: ['SE', 'MUT'] },
  { word: 'LEBAH', image: '🐝', syllables: ['LE', 'BAH'] },
  { word: 'WORTEL', image: '🥕', syllables: ['WOR', 'TEL'] },
  { word: 'TOMAT', image: '🍅', syllables: ['TO', 'MAT'] },
  { word: 'MANGGA', image: '🥭', syllables: ['MANG', 'GA'] },
  { word: 'ANGGUR', image: '🍇', syllables: ['ANG', 'GUR'] },
  { word: 'SEMANGKA', image: '🍉', syllables: ['SE', 'MANG', 'KA'] },
  { word: 'STROBERI', image: '🍓', syllables: ['STRO', 'BE', 'RI'] },
  { word: 'LEMON', image: '🍋', syllables: ['LE', 'MON'] },
  { word: 'KELAPA', image: '🥥', syllables: ['KE', 'LA', 'PA'] },
  { word: 'JAGUNG', image: '🌽', syllables: ['JA', 'GUNG'] },
  { word: 'KENTANG', image: '🥔', syllables: ['KEN', 'TANG'] },
  { word: 'BROKOLI', image: '🥦', syllables: ['BRO', 'KO', 'LI'] },
  { word: 'TERONG', image: '🍆', syllables: ['TE', 'RONG'] },
  { word: 'PENSIL', image: '✏️', syllables: ['PEN', 'SIL'] },
  { word: 'SEPATU', image: '👟', syllables: ['SE', 'PA', 'TU'] },
  { word: 'KOMPUTER', image: '💻', syllables: ['KOM', 'PU', 'TER'] },
  { word: 'TELEVISI', image: '📺', syllables: ['TE', 'LE', 'VI', 'SI'] },
  { word: 'HELIKOPTER', image: '🚁', syllables: ['HE', 'LI', 'KOP', 'TER'] },
  { word: 'AMBULANS', image: '🚑', syllables: ['AM', 'BU', 'LANS'] },
  { word: 'JERAPAH', image: '🦒', syllables: ['JE', 'RA', 'PAH'] },
  { word: 'PINGUIN', image: '🐧', syllables: ['PI', 'NGU', 'IN'] },
  { word: 'GORILA', image: '🦍', syllables: ['GO', 'RI', 'LA'] },
  { word: 'BADAK', image: '🦏', syllables: ['BA', 'DAK'] },
  { word: 'GURITA', image: '🐙', syllables: ['GU', 'RI', 'TA'] },
  { word: 'KEPITING', image: '🦀', syllables: ['KE', 'PI', 'TING'] },
  { word: 'KUPU-KUPU', image: '🦋', syllables: ['KU', 'PU', 'KU', 'PU'] },
  { word: 'PELANGI', image: '🌈', syllables: ['PE', 'LA', 'NGI'] },
  { word: 'MATAHARI', image: '☀️', syllables: ['MA', 'TA', 'HA', 'RI'] },
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
  const { speak } = useSpeech();
  
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

  const handleSpeakWord = useCallback(() => {
    playClick();
    if (questions.length > 0 && currentIndex < questions.length) {
      const current = questions[currentIndex];
      speak(current.word, 0.7); // Rate lambat agar mudah didengar anak
    }
  }, [questions, currentIndex, playClick, speak]);

  const handleAnswer = (selectedImage: string) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(selectedImage);
    const isCorrect = selectedImage === questions[currentIndex].correctImage;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('readMatch', 1);
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
        completeLevel('readMatch');
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
    <div className="min-h-screen gradient-game-bg flex flex-col relative">
      <FloatingIcons variant="reading" />
      
      <GameHeader 
        title="Baca & Cocokkan"
        stars={progress.readMatch.stars}
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
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6 relative z-10">
        {/* Word Display */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-card p-6 w-full max-w-sm text-center border-2 border-secondary/20">
          <p className="text-sm text-muted-foreground mb-2">Baca kata ini:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-foreground tracking-wider">
              {currentQuestion.word}
            </span>
            <button
              onClick={handleSpeakWord}
              className="w-12 h-12 bg-secondary/20 rounded-full hover:bg-secondary/30 transition-colors active:scale-95 shadow-md flex items-center justify-center"
              aria-label="Dengarkan kata"
            >
              <Volume2 className="w-6 h-6 text-secondary pointer-events-none" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ketuk 🔊 untuk mendengar
          </p>
        </div>
        
        {/* Instruction */}
        <p className="text-lg font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full">
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
                'aspect-square rounded-2xl bg-card/95 backdrop-blur-sm shadow-card p-4 flex items-center justify-center',
                'transition-all duration-200 hover:scale-105 active:scale-95',
                'border-2',
                selectedAnswer === option.image
                  ? option.image === currentQuestion.correctImage
                    ? 'ring-4 ring-success bg-success/10 border-success'
                    : 'ring-4 ring-destructive bg-destructive/10 border-destructive animate-shake'
                  : selectedAnswer !== null && option.image === currentQuestion.correctImage
                    ? 'ring-4 ring-success bg-success/10 border-success'
                    : 'border-primary/20 hover:shadow-lg hover:border-primary/40'
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