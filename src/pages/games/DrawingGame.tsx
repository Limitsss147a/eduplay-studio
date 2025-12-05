import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { AnswerFeedback } from '@/components/game/AnswerFeedback';
import { LevelComplete } from '@/components/game/LevelComplete';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { RotateCcw, Check, Palette } from 'lucide-react';

interface Question {
  id: number;
  prompt: string;
  emoji: string;
  hint: string;
}

const drawingPrompts: Question[] = [
  { id: 1, prompt: 'Gambar LINGKARAN', emoji: '⭕', hint: 'Bulat seperti bola' },
  { id: 2, prompt: 'Gambar SEGITIGA', emoji: '🔺', hint: 'Punya 3 sisi' },
  { id: 3, prompt: 'Gambar KOTAK', emoji: '⬛', hint: 'Punya 4 sisi sama panjang' },
  { id: 4, prompt: 'Gambar BINTANG', emoji: '⭐', hint: 'Bersinar di langit malam' },
  { id: 5, prompt: 'Gambar HATI', emoji: '❤️', hint: 'Simbol cinta' },
  { id: 6, prompt: 'Gambar MATAHARI', emoji: '☀️', hint: 'Lingkaran dengan garis-garis' },
  { id: 7, prompt: 'Gambar RUMAH', emoji: '🏠', hint: 'Kotak dengan segitiga di atas' },
  { id: 8, prompt: 'Gambar BUNGA', emoji: '🌸', hint: 'Kelopak di sekitar lingkaran' },
  { id: 9, prompt: 'Gambar POHON', emoji: '🌳', hint: 'Batang coklat dan daun hijau' },
  { id: 10, prompt: 'Gambar AWAN', emoji: '☁️', hint: 'Bulat-bulat mengembang' },
];

const colors = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#000000', // Black
];

const generateQuestions = (): Question[] => {
  return drawingPrompts.sort(() => Math.random() - 0.5).slice(0, 5);
};

export const DrawingGame = () => {
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
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showColors, setShowColors] = useState(false);

  const initGame = useCallback(() => {
    setQuestions(generateQuestions());
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setHasDrawn(false);
  }, []);

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ('touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left) * scaleX;
    const y = ('touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 6;
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ('touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left) * scaleX;
    const y = ('touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = () => {
    if (!hasDrawn) return;
    
    playClick();
    playCorrect();
    setCorrectCount(prev => prev + 1);
    addStars('drawing', 1);
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
        title="Menggambar"
        stars={progress.drawing.stars}
        variant="drawing"
        isMuted={isMuted}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleMute={toggleMute}
        onToggleBgMusic={toggleBgMusic}
      />
      
      <ProgressBar 
        current={currentIndex + 1} 
        total={questions.length} 
        variant="drawing"
      />
      
      <main className="flex-1 flex flex-col items-center p-4">
        {/* Prompt card */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-4 text-center w-full max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">{currentQuestion.emoji}</span>
            <div className="text-left">
              <p className="text-lg font-bold text-foreground">{currentQuestion.prompt}</p>
              <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
            </div>
          </div>
        </div>
        
        {/* Color palette */}
        <div className="relative mb-3">
          <button
            onClick={() => setShowColors(!showColors)}
            className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-card hover:shadow-lg transition-all"
          >
            <div 
              className="w-6 h-6 rounded-full border-2 border-muted"
              style={{ backgroundColor: selectedColor }}
            />
            <Palette className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {showColors && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card rounded-2xl shadow-lg p-3 flex gap-2 z-10">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setShowColors(false);
                    playClick();
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                    selectedColor === color ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Drawing canvas */}
        <div className="bg-card rounded-3xl shadow-card p-2 mb-4 touch-none">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-2xl border-2 border-dashed border-muted cursor-crosshair w-full max-w-[300px]"
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
                ? 'bg-gradient-to-r from-accent to-[hsl(340,80%,60%)] text-primary-foreground hover:opacity-90'
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
          variant="drawing"
          onReplay={initGame}
        />
      )}
    </div>
  );
};

export default DrawingGame;
