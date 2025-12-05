import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { RotateCcw, Check } from 'lucide-react';

interface Question {
  id: number;
  letter: string;
  guide: string;
}

const letters = [
  { letter: 'A', guide: 'Garis miring ke kanan, ke kiri, lalu garis horizontal' },
  { letter: 'B', guide: 'Garis lurus ke bawah, lalu dua lengkungan' },
  { letter: 'C', guide: 'Lengkungan seperti bulan sabit' },
  { letter: 'D', guide: 'Garis lurus ke bawah, lalu lengkungan besar' },
  { letter: 'E', guide: 'Garis ke bawah dan tiga garis horizontal' },
  { letter: 'O', guide: 'Lingkaran penuh' },
  { letter: 'L', guide: 'Garis ke bawah dan ke kanan' },
  { letter: 'I', guide: 'Garis lurus ke bawah' },
];

const numbers = [
  { letter: '1', guide: 'Garis lurus ke bawah' },
  { letter: '2', guide: 'Lengkungan atas dan garis bawah' },
  { letter: '3', guide: 'Dua lengkungan ke kanan' },
  { letter: '4', guide: 'Garis ke bawah, ke kanan, lalu ke bawah lagi' },
  { letter: '5', guide: 'Garis ke kiri, ke bawah, dan lengkungan' },
];

const generateQuestions = (level: number): Question[] => {
  const allChars = [...letters, ...numbers];
  const shuffled = allChars.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((item, i) => ({
    id: i,
    letter: item.letter,
    guide: item.guide,
  }));
};

export const WritingGame = () => {
  const { progress, addStars } = useGame();
  const { 
    playCorrect, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic 
  } = useSound();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const initGame = useCallback(() => {
    setQuestions(generateQuestions(progress.writing.level));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setHasDrawn(false);
  }, [progress.writing.level]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    clearCanvas();
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide letter in background
    if (questions[currentIndex]) {
      ctx.font = 'bold 200px Nunito';
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(questions[currentIndex].letter, canvas.width / 2, canvas.height / 2);
    }
    
    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = () => {
    if (!hasDrawn) return;
    
    playClick();
    // For simplicity, we'll accept any drawing as "correct"
    // In a real app, you'd use ML to verify the drawing
    playCorrect();
    setCorrectCount(prev => prev + 1);
    addStars('writing', 1);
    setFeedback(true);
  };

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
        title="Menulis"
        stars={progress.writing.stars}
        variant="writing"
        isMuted={isMuted}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleMute={toggleMute}
        onToggleBgMusic={toggleBgMusic}
      />
      
      <ProgressBar 
        current={currentIndex + 1} 
        total={questions.length} 
        variant="writing"
      />
      
      <main className="flex-1 flex flex-col items-center p-4">
        {/* Target letter display */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Tulis huruf/angka ini:</p>
          <span className="text-6xl font-bold text-game-writing">{currentQuestion.letter}</span>
          <p className="text-xs text-muted-foreground mt-2">{currentQuestion.guide}</p>
        </div>
        
        {/* Drawing canvas */}
        <div className="bg-card rounded-3xl shadow-card p-2 mb-4 touch-none">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-2xl border-2 border-dashed border-muted cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={clearCanvas}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-colors active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Hapus</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasDrawn}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold rounded-2xl transition-all active:scale-95',
              hasDrawn
                ? 'bg-gradient-to-r from-game-writing to-accent text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Check className="w-5 h-5" />
            <span>Selesai</span>
          </button>
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
          variant="writing"
          onReplay={initGame}
        />
      )}
    </div>
  );
};

export default WritingGame;
