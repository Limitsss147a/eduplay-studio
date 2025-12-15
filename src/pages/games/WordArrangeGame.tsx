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
import { RotateCcw, Volume2 } from 'lucide-react';

interface WordData {
  word: string;
  image: string;
  hint: string;
  syllables: string[];
}

interface WordQuestion extends WordData {
  id: number;
}

const wordBank: WordData[] = [
  // 2 suku kata (mudah)
  { word: 'APEL', image: '🍎', hint: 'Buah merah yang segar', syllables: ['A', 'PEL'] },
  { word: 'BUKU', image: '📚', hint: 'Untuk membaca', syllables: ['BU', 'KU'] },
  { word: 'KUCING', image: '🐱', hint: 'Hewan berbulu lembut', syllables: ['KU', 'CING'] },
  { word: 'RUMAH', image: '🏠', hint: 'Tempat tinggal', syllables: ['RU', 'MAH'] },
  { word: 'BUNGA', image: '🌸', hint: 'Tumbuhan yang indah', syllables: ['BU', 'NGA'] },
  { word: 'PISANG', image: '🍌', hint: 'Buah kuning', syllables: ['PI', 'SANG'] },
  { word: 'AYAM', image: '🐔', hint: 'Hewan berkokok', syllables: ['A', 'YAM'] },
  { word: 'IKAN', image: '🐟', hint: 'Hewan di air', syllables: ['I', 'KAN'] },
  { word: 'BOLA', image: '⚽', hint: 'Untuk bermain', syllables: ['BO', 'LA'] },
  { word: 'KUDA', image: '🐴', hint: 'Hewan berkaki empat', syllables: ['KU', 'DA'] },
  { word: 'SAPI', image: '🐄', hint: 'Hewan penghasil susu', syllables: ['SA', 'PI'] },
  { word: 'PANDA', image: '🐼', hint: 'Hewan hitam putih', syllables: ['PAN', 'DA'] },
  { word: 'KURSI', image: '🪑', hint: 'Tempat duduk', syllables: ['KUR', 'SI'] },
  { word: 'NASI', image: '🍚', hint: 'Makanan pokok', syllables: ['NA', 'SI'] },
  { word: 'TOPI', image: '🎩', hint: 'Pelindung kepala', syllables: ['TO', 'PI'] },
  { word: 'GAJAH', image: '🐘', hint: 'Hewan besar berbelalai', syllables: ['GA', 'JAH'] },
  { word: 'BURUNG', image: '🐦', hint: 'Hewan bersayap', syllables: ['BU', 'RUNG'] },
  { word: 'JERUK', image: '🍊', hint: 'Buah berwarna oranye', syllables: ['JE', 'RUK'] },
  { word: 'MANGGA', image: '🥭', hint: 'Buah manis kuning', syllables: ['MANG', 'GA'] },
  { word: 'SEMUT', image: '🐜', hint: 'Hewan kecil rajin', syllables: ['SE', 'MUT'] },
  { word: 'LEBAH', image: '🐝', hint: 'Hewan pembuat madu', syllables: ['LE', 'BAH'] },
  { word: 'BEBEK', image: '🦆', hint: 'Hewan yang berenang', syllables: ['BE', 'BEK'] },
  { word: 'SINGA', image: '🦁', hint: 'Raja hutan', syllables: ['SI', 'NGA'] },
  { word: 'ZEBRA', image: '🦓', hint: 'Hewan belang hitam putih', syllables: ['ZE', 'BRA'] },
  { word: 'WORTEL', image: '🥕', hint: 'Sayuran oranye', syllables: ['WOR', 'TEL'] },
  { word: 'TOMAT', image: '🍅', hint: 'Buah merah untuk masak', syllables: ['TO', 'MAT'] },
  { word: 'PAYUNG', image: '☂️', hint: 'Pelindung dari hujan', syllables: ['PA', 'YUNG'] },
  // 3 suku kata (sedang)
  { word: 'HARIMAU', image: '🐯', hint: 'Hewan loreng', syllables: ['HA', 'RI', 'MAU'] },
  { word: 'KELINCI', image: '🐰', hint: 'Hewan telinga panjang', syllables: ['KE', 'LIN', 'CI'] },
  { word: 'ANGGUR', image: '🍇', hint: 'Buah kecil berkelompok', syllables: ['ANG', 'GUR'] },
  { word: 'SEPATU', image: '👟', hint: 'Alas kaki', syllables: ['SE', 'PA', 'TU'] },
  { word: 'PENSIL', image: '✏️', hint: 'Alat untuk menulis', syllables: ['PEN', 'SIL'] },
  { word: 'JENDELA', image: '🪟', hint: 'Lubang cahaya di rumah', syllables: ['JEN', 'DE', 'LA'] },
  { word: 'MATAHARI', image: '☀️', hint: 'Bintang yang terang', syllables: ['MA', 'TA', 'HA', 'RI'] },
  { word: 'PELANGI', image: '🌈', hint: 'Lengkung warna di langit', syllables: ['PE', 'LA', 'NGI'] },
  { word: 'KUPU-KUPU', image: '🦋', hint: 'Serangga bersayap indah', syllables: ['KU', 'PU', 'KU', 'PU'] },
  { word: 'KAMBING', image: '🐐', hint: 'Hewan bertanduk', syllables: ['KAM', 'BING'] },
  { word: 'DOMBA', image: '🐑', hint: 'Hewan berbulu tebal', syllables: ['DOM', 'BA'] },
  { word: 'KERBAU', image: '🐃', hint: 'Hewan pembajak sawah', syllables: ['KER', 'BAU'] },
  { word: 'KEPITING', image: '🦀', hint: 'Hewan bercapit', syllables: ['KE', 'PI', 'TING'] },
  { word: 'GURITA', image: '🐙', hint: 'Hewan delapan lengan', syllables: ['GU', 'RI', 'TA'] },
  { word: 'LUMBA-LUMBA', image: '🐬', hint: 'Hewan pintar di laut', syllables: ['LUM', 'BA', 'LUM', 'BA'] },
  { word: 'PINGUIN', image: '🐧', hint: 'Burung yang tidak terbang', syllables: ['PI', 'NGU', 'IN'] },
  { word: 'JERAPAH', image: '🦒', hint: 'Hewan leher panjang', syllables: ['JE', 'RA', 'PAH'] },
  { word: 'BADAK', image: '🦏', hint: 'Hewan bercula', syllables: ['BA', 'DAK'] },
  { word: 'GORILA', image: '🦍', hint: 'Kera besar', syllables: ['GO', 'RI', 'LA'] },
  { word: 'KOMPUTER', image: '💻', hint: 'Alat elektronik', syllables: ['KOM', 'PU', 'TER'] },
  { word: 'TELEVISI', image: '📺', hint: 'Untuk menonton', syllables: ['TE', 'LE', 'VI', 'SI'] },
  { word: 'HANDPHONE', image: '📱', hint: 'Alat komunikasi', syllables: ['HAND', 'PHO', 'NE'] },
  { word: 'HELIKOPTER', image: '🚁', hint: 'Pesawat baling-baling', syllables: ['HE', 'LI', 'KOP', 'TER'] },
  { word: 'AMBULANS', image: '🚑', hint: 'Mobil rumah sakit', syllables: ['AM', 'BU', 'LANS'] },
  { word: 'SEMANGKA', image: '🍉', hint: 'Buah merah besar', syllables: ['SE', 'MANG', 'KA'] },
  { word: 'STROBERI', image: '🍓', hint: 'Buah merah kecil', syllables: ['STRO', 'BE', 'RI'] },
  { word: 'LEMON', image: '🍋', hint: 'Buah asam kuning', syllables: ['LE', 'MON'] },
  { word: 'KELAPA', image: '🥥', hint: 'Buah pohon tinggi', syllables: ['KE', 'LA', 'PA'] },
  { word: 'TERONG', image: '🍆', hint: 'Sayuran ungu', syllables: ['TE', 'RONG'] },
  { word: 'BROKOLI', image: '🥦', hint: 'Sayuran hijau seperti pohon', syllables: ['BRO', 'KO', 'LI'] },
  { word: 'JAGUNG', image: '🌽', hint: 'Tanaman berbiji kuning', syllables: ['JA', 'GUNG'] },
  { word: 'KENTANG', image: '🥔', hint: 'Umbi di tanah', syllables: ['KEN', 'TANG'] },
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
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playSelect, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  const { speak, speakSyllables } = useSpeech();
  
  const [questions, setQuestions] = useState<WordQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false);

  const initGame = useCallback(() => {
    const newQuestions = generateQuestions(5);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setHasCompletedLevel(false);
    
    if (newQuestions.length > 0) {
      initQuestion(newQuestions[0]);
    }
  }, []);

  const initQuestion = (question: WordQuestion) => {
    const syllables = question.syllables;
    const shuffled = shuffleArray(syllables);
    setShuffledSyllables(shuffled);
    setSelectedSyllables([]);
    setAvailableIndices(shuffled.map((_, i) => i));
  };

  useEffect(() => {
    initGame();
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      initQuestion(questions[currentIndex]);
    }
  }, [currentIndex, questions]);

  const handleSpeakWord = useCallback(() => {
    playClick();
    if (questions.length > 0 && currentIndex < questions.length) {
      const current = questions[currentIndex];
      speakSyllables(current.word, current.syllables);
    }
  }, [questions, currentIndex, playClick, speakSyllables]);

  const handleSyllableSelect = (index: number) => {
    if (feedback !== null) return;
    
    playSelect();
    const syllable = shuffledSyllables[index];
    setSelectedSyllables(prev => [...prev, syllable]);
    setAvailableIndices(prev => prev.filter(i => i !== index));
  };

  const handleSyllableRemove = (selectedIndex: number) => {
    if (feedback !== null) return;
    
    playClick();
    const syllable = selectedSyllables[selectedIndex];
    
    const matchingIndices = shuffledSyllables
      .map((s, i) => ({ syllable: s, index: i }))
      .filter(item => item.syllable === syllable && !availableIndices.includes(item.index));
    
    if (matchingIndices.length > 0) {
      setAvailableIndices(prev => [...prev, matchingIndices[0].index].sort((a, b) => a - b));
    }
    
    setSelectedSyllables(prev => prev.filter((_, i) => i !== selectedIndex));
  };

  const handleReset = () => {
    if (feedback !== null) return;
    playClick();
    initQuestion(questions[currentIndex]);
  };

  const addStarsRef = useRef(addStars);
  addStarsRef.current = addStars;

  const checkAnswer = useCallback(() => {
    const answer = selectedSyllables.join('');
    const correctAnswer = questions[currentIndex].syllables.join('');
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('wordArrange', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  }, [selectedSyllables, questions, currentIndex, playCorrect, playWrong]);

  useEffect(() => {
    if (questions.length > 0 && selectedSyllables.length === questions[currentIndex]?.syllables.length) {
      const timer = setTimeout(checkAnswer, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedSyllables, questions, currentIndex, checkAnswer]);

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    
    if (currentIndex + 1 >= questions.length) {
      playLevelComplete();
      setIsComplete(true);
      if (!hasCompletedLevel) {
        completeLevel('wordArrange');
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
        title="Susun Kata"
        stars={progress.wordArrange.stars}
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
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 relative z-10">
        {/* Image Display */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-card p-6 w-full max-w-sm text-center relative border-2 border-secondary/20">
          {/* Audio Button - PERBAIKAN DI SINI */}
          <button
            onClick={handleSpeakWord}
            // Tambahkan 'z-20' di class di bawah ini 👇
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-secondary/20 rounded-full hover:bg-secondary/30 transition-colors active:scale-95 shadow-md flex items-center justify-center"
            aria-label="Dengarkan kata"
          >
            <Volume2 className="w-6 h-6 text-secondary pointer-events-none" />
          </button>
          
          <span className="text-8xl animate-float block mb-2">{currentQuestion.image}</span>
          <p className="text-muted-foreground text-sm">{currentQuestion.hint}</p>
          <p className="text-xs text-muted-foreground mt-1">Ketuk 🔊 untuk mendengar</p>
        </div>
        
        {/* Answer Area */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-card p-4 w-full max-w-sm min-h-[70px] flex items-center justify-center gap-2 flex-wrap border-2 border-primary/20">
          {selectedSyllables.length === 0 ? (
            <span className="text-muted-foreground">Ketuk suku kata untuk menyusun</span>
          ) : (
            selectedSyllables.map((syllable, index) => (
              <button
                key={index}
                onClick={() => handleSyllableRemove(index)}
                disabled={feedback !== null}
                className={cn(
                  'px-4 py-3 text-xl font-bold rounded-xl transition-all duration-200',
                  'shadow-md hover:scale-105 active:scale-95',
                  feedback === true
                    ? 'bg-success text-success-foreground animate-bounce'
                    : feedback === false
                    ? 'bg-destructive text-destructive-foreground animate-shake'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {syllable}
              </button>
            ))
          )}
        </div>
        
        {/* Syllable Options */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
          {shuffledSyllables.map((syllable, index) => (
            <button
              key={index}
              onClick={() => handleSyllableSelect(index)}
              disabled={!availableIndices.includes(index) || feedback !== null}
              className={cn(
                'px-6 py-4 text-2xl font-bold rounded-2xl transition-all duration-200',
                'shadow-card hover:shadow-lg',
                availableIndices.includes(index)
                  ? 'bg-primary text-primary-foreground hover:scale-110 active:scale-95'
                  : 'bg-muted text-muted-foreground opacity-30 cursor-not-allowed'
              )}
            >
              {syllable}
            </button>
          ))}
        </div>
        
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={feedback !== null || selectedSyllables.length === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            (feedback !== null || selectedSyllables.length === 0) && 'opacity-50 cursor-not-allowed'
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
          onContinue={initGame}
        />
      )}
    </div>
  );
};

export default WordArrangeGame;