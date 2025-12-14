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

interface SentenceData {
  sentence: string;
  image: string;
  hint: string;
  words: string[];
}

interface SentenceQuestion extends SentenceData {
  id: number;
}

const sentenceBank: SentenceData[] = [
  // Kalimat 3 kata (mudah)
  { sentence: 'Ibu memasak nasi', image: '👩‍🍳', hint: 'Kegiatan di dapur', words: ['Ibu', 'memasak', 'nasi'] },
  { sentence: 'Ayah membaca koran', image: '📰', hint: 'Kegiatan pagi hari', words: ['Ayah', 'membaca', 'koran'] },
  { sentence: 'Adik minum susu', image: '🥛', hint: 'Minuman bergizi', words: ['Adik', 'minum', 'susu'] },
  { sentence: 'Kucing makan ikan', image: '🐱', hint: 'Hewan makan', words: ['Kucing', 'makan', 'ikan'] },
  { sentence: 'Kakak pergi sekolah', image: '🏫', hint: 'Kegiatan belajar', words: ['Kakak', 'pergi', 'sekolah'] },
  { sentence: 'Burung terbang tinggi', image: '🐦', hint: 'Hewan di langit', words: ['Burung', 'terbang', 'tinggi'] },
  { sentence: 'Anak bermain bola', image: '⚽', hint: 'Olahraga favorit', words: ['Anak', 'bermain', 'bola'] },
  { sentence: 'Nenek merajut syal', image: '🧶', hint: 'Kegiatan nenek', words: ['Nenek', 'merajut', 'syal'] },
  { sentence: 'Kelinci suka wortel', image: '🐰', hint: 'Makanan kelinci', words: ['Kelinci', 'suka', 'wortel'] },
  { sentence: 'Petani menanam padi', image: '🌾', hint: 'Kegiatan di sawah', words: ['Petani', 'menanam', 'padi'] },
  { sentence: 'Dokter memeriksa pasien', image: '👨‍⚕️', hint: 'Di rumah sakit', words: ['Dokter', 'memeriksa', 'pasien'] },
  { sentence: 'Guru mengajar murid', image: '👩‍🏫', hint: 'Di sekolah', words: ['Guru', 'mengajar', 'murid'] },
  { sentence: 'Sapi makan rumput', image: '🐄', hint: 'Hewan ternak', words: ['Sapi', 'makan', 'rumput'] },
  { sentence: 'Nelayan menangkap ikan', image: '🎣', hint: 'Di laut', words: ['Nelayan', 'menangkap', 'ikan'] },
  { sentence: 'Rina menulis surat', image: '✉️', hint: 'Berkirim kabar', words: ['Rina', 'menulis', 'surat'] },
  { sentence: 'Budi menggambar rumah', image: '🏠', hint: 'Kegiatan seni', words: ['Budi', 'menggambar', 'rumah'] },
  { sentence: 'Anjing menjaga rumah', image: '🐕', hint: 'Hewan peliharaan', words: ['Anjing', 'menjaga', 'rumah'] },
  { sentence: 'Koki membuat kue', image: '🧁', hint: 'Di dapur', words: ['Koki', 'membuat', 'kue'] },
  { sentence: 'Monyet memanjat pohon', image: '🐒', hint: 'Di hutan', words: ['Monyet', 'memanjat', 'pohon'] },
  { sentence: 'Lebah membuat madu', image: '🐝', hint: 'Hewan kecil rajin', words: ['Lebah', 'membuat', 'madu'] },
  // Kalimat 4 kata (sedang)
  { sentence: 'Polisi mengatur lalu lintas', image: '👮', hint: 'Di jalan raya', words: ['Polisi', 'mengatur', 'lalu', 'lintas'] },
  { sentence: 'Pilot menerbangkan pesawat terbang', image: '✈️', hint: 'Di langit', words: ['Pilot', 'menerbangkan', 'pesawat', 'terbang'] },
  { sentence: 'Kakek menyiram tanaman bunga', image: '🌱', hint: 'Di kebun', words: ['Kakek', 'menyiram', 'tanaman', 'bunga'] },
  { sentence: 'Ibu mencuci baju kotor', image: '👕', hint: 'Kegiatan rumah', words: ['Ibu', 'mencuci', 'baju', 'kotor'] },
  { sentence: 'Pemadam memadamkan api besar', image: '🚒', hint: 'Saat kebakaran', words: ['Pemadam', 'memadamkan', 'api', 'besar'] },
  { sentence: 'Anak membaca buku cerita', image: '📚', hint: 'Kegiatan belajar', words: ['Anak', 'membaca', 'buku', 'cerita'] },
  { sentence: 'Ayah memperbaiki sepeda rusak', image: '🔧', hint: 'Di garasi', words: ['Ayah', 'memperbaiki', 'sepeda', 'rusak'] },
  { sentence: 'Ibu membeli sayur segar', image: '🥬', hint: 'Di pasar', words: ['Ibu', 'membeli', 'sayur', 'segar'] },
  { sentence: 'Anak menggambar pemandangan indah', image: '🎨', hint: 'Kegiatan seni', words: ['Anak', 'menggambar', 'pemandangan', 'indah'] },
  { sentence: 'Kakak bermain musik gitar', image: '🎸', hint: 'Hobi musik', words: ['Kakak', 'bermain', 'musik', 'gitar'] },
  { sentence: 'Nenek memasak sup ayam', image: '🍲', hint: 'Di dapur', words: ['Nenek', 'memasak', 'sup', 'ayam'] },
  { sentence: 'Adik menonton film kartun', image: '📺', hint: 'Di ruang tamu', words: ['Adik', 'menonton', 'film', 'kartun'] },
  { sentence: 'Petani memanen buah mangga', image: '🥭', hint: 'Di kebun', words: ['Petani', 'memanen', 'buah', 'mangga'] },
  { sentence: 'Dokter memberikan obat pasien', image: '💊', hint: 'Di rumah sakit', words: ['Dokter', 'memberikan', 'obat', 'pasien'] },
  { sentence: 'Guru menjelaskan pelajaran matematika', image: '📐', hint: 'Di kelas', words: ['Guru', 'menjelaskan', 'pelajaran', 'matematika'] },
  // Kalimat 5 kata (sulit)
  { sentence: 'Anak bermain bola di lapangan', image: '⚽', hint: 'Olahraga outdoor', words: ['Anak', 'bermain', 'bola', 'di', 'lapangan'] },
  { sentence: 'Ibu memasak makanan yang lezat', image: '🍳', hint: 'Di dapur rumah', words: ['Ibu', 'memasak', 'makanan', 'yang', 'lezat'] },
  { sentence: 'Ayah pergi bekerja setiap hari', image: '💼', hint: 'Kegiatan rutin', words: ['Ayah', 'pergi', 'bekerja', 'setiap', 'hari'] },
  { sentence: 'Kakak belajar dengan sangat rajin', image: '📖', hint: 'Anak pintar', words: ['Kakak', 'belajar', 'dengan', 'sangat', 'rajin'] },
  { sentence: 'Adik tidur siang di kamar', image: '🛏️', hint: 'Waktu istirahat', words: ['Adik', 'tidur', 'siang', 'di', 'kamar'] },
  { sentence: 'Kucing berlari mengejar tikus kecil', image: '🐱', hint: 'Berburu mangsa', words: ['Kucing', 'berlari', 'mengejar', 'tikus', 'kecil'] },
  { sentence: 'Burung berkicau di atas pohon', image: '🌳', hint: 'Pagi yang cerah', words: ['Burung', 'berkicau', 'di', 'atas', 'pohon'] },
  { sentence: 'Anak makan buah yang segar', image: '🍎', hint: 'Makanan sehat', words: ['Anak', 'makan', 'buah', 'yang', 'segar'] },
  { sentence: 'Ibu menyapu halaman rumah pagi', image: '🧹', hint: 'Bersih-bersih', words: ['Ibu', 'menyapu', 'halaman', 'rumah', 'pagi'] },
  { sentence: 'Ayah mengajarkan adik naik sepeda', image: '🚴', hint: 'Belajar keterampilan', words: ['Ayah', 'mengajarkan', 'adik', 'naik', 'sepeda'] },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (count: number = 5): SentenceQuestion[] => {
  const shuffled = shuffleArray(sentenceBank);
  return shuffled.slice(0, count).map((sentence, index) => ({
    ...sentence,
    id: index,
  }));
};

export const SentenceArrangeGame = () => {
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playSelect, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  const { speak } = useSpeech();
  
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
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

  const initQuestion = (question: SentenceQuestion) => {
    const words = question.words;
    const shuffled = shuffleArray(words);
    setShuffledWords(shuffled);
    setSelectedWords([]);
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

  const handleSpeakSentence = useCallback(() => {
    playClick();
    if (questions.length > 0 && currentIndex < questions.length) {
      const current = questions[currentIndex];
      speak(current.sentence);
    }
  }, [questions, currentIndex, playClick, speak]);

  const handleWordSelect = (index: number) => {
    if (feedback !== null) return;
    
    playSelect();
    const word = shuffledWords[index];
    setSelectedWords(prev => [...prev, word]);
    setAvailableIndices(prev => prev.filter(i => i !== index));
  };

  const handleWordRemove = (selectedIndex: number) => {
    if (feedback !== null) return;
    
    playClick();
    const word = selectedWords[selectedIndex];
    
    const matchingIndices = shuffledWords
      .map((w, i) => ({ word: w, index: i }))
      .filter(item => item.word === word && !availableIndices.includes(item.index));
    
    if (matchingIndices.length > 0) {
      setAvailableIndices(prev => [...prev, matchingIndices[0].index].sort((a, b) => a - b));
    }
    
    setSelectedWords(prev => prev.filter((_, i) => i !== selectedIndex));
  };

  const handleReset = () => {
    if (feedback !== null) return;
    playClick();
    initQuestion(questions[currentIndex]);
  };

  const addStarsRef = useRef(addStars);
  addStarsRef.current = addStars;

  const checkAnswer = useCallback(() => {
    const answer = selectedWords.join(' ');
    const correctAnswer = questions[currentIndex].words.join(' ');
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('sentence', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  }, [selectedWords, questions, currentIndex, playCorrect, playWrong]);

  useEffect(() => {
    if (questions.length > 0 && selectedWords.length === questions[currentIndex]?.words.length) {
      const timer = setTimeout(checkAnswer, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedWords, questions, currentIndex, checkAnswer]);

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    
    if (currentIndex + 1 >= questions.length) {
      playLevelComplete();
      setIsComplete(true);
      if (!hasCompletedLevel) {
        completeLevel('sentence');
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
        title="Susun Kalimat"
        stars={progress.sentence.stars}
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
          {/* Audio Button - Fixed click area */}
          <button
            onClick={handleSpeakSentence}
            className="absolute top-4 right-4 w-12 h-12 bg-secondary/20 rounded-full hover:bg-secondary/30 transition-colors active:scale-95 shadow-md flex items-center justify-center"
            aria-label="Dengarkan kalimat"
          >
            <Volume2 className="w-6 h-6 text-secondary pointer-events-none" />
          </button>
          
          <span className="text-8xl animate-float block mb-2">{currentQuestion.image}</span>
          <p className="text-muted-foreground text-sm">{currentQuestion.hint}</p>
          <p className="text-xs text-muted-foreground mt-1">Ketuk 🔊 untuk mendengar kalimat</p>
        </div>
        
        {/* Answer Area */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-card p-4 w-full max-w-sm min-h-[80px] flex items-center justify-center gap-2 flex-wrap border-2 border-primary/20">
          {selectedWords.length === 0 ? (
            <span className="text-muted-foreground">Ketuk kata untuk menyusun kalimat</span>
          ) : (
            selectedWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordRemove(index)}
                disabled={feedback !== null}
                className={cn(
                  'px-4 py-3 text-lg font-bold rounded-xl transition-all duration-200',
                  'shadow-md hover:scale-105 active:scale-95',
                  feedback === true
                    ? 'bg-success text-success-foreground animate-bounce'
                    : feedback === false
                    ? 'bg-destructive text-destructive-foreground animate-shake'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {word}
              </button>
            ))
          )}
        </div>
        
        {/* Word Options */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
          {shuffledWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordSelect(index)}
              disabled={!availableIndices.includes(index) || feedback !== null}
              className={cn(
                'px-5 py-4 text-xl font-bold rounded-2xl transition-all duration-200',
                'shadow-card hover:shadow-lg',
                availableIndices.includes(index)
                  ? 'bg-primary text-primary-foreground hover:scale-110 active:scale-95'
                  : 'bg-muted text-muted-foreground opacity-30 cursor-not-allowed'
              )}
            >
              {word}
            </button>
          ))}
        </div>
        
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={feedback !== null || selectedWords.length === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            (feedback !== null || selectedWords.length === 0) && 'opacity-50 cursor-not-allowed'
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

export default SentenceArrangeGame;
