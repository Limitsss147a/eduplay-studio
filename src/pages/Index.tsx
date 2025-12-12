import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from '@/components/game/GameCard';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { Calculator, BookOpen, PenTool, Palette, Star, Volume2, VolumeX, Music, Music2, RotateCcw, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const { progress, totalStars, playerName, resetProgress } = useGame();
  const { playSelect, playClick, isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic } = useSound();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleGameSelect = (path: string) => {
    playSelect();
    navigate(path);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 shadow-soft">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-button">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Halo,</p>
              <h1 className="text-lg font-bold text-foreground">{playerName}! 👋</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBgMusic}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                'bg-muted hover:bg-muted/80'
              )}
            >
              {isBgMusicPlaying ? (
                <Music className="w-5 h-5 text-foreground" />
              ) : (
                <Music2 className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                'bg-muted hover:bg-muted/80'
              )}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-foreground" />
              )}
            </button>
            <div className="flex items-center gap-1 bg-warning/20 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="font-bold text-foreground">{totalStars}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Welcome Banner */}
        <div className="bg-card rounded-3xl shadow-card p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-primary/10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 -ml-6 -mb-6 bg-secondary/10 rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ayo Belajar Sambil Bermain! 🚀
            </h2>
            <p className="text-muted-foreground">
              Pilih permainan favoritmu dan kumpulkan bintang sebanyak-banyaknya!
            </p>
          </div>
        </div>

        {/* Literacy Section - For kids learning to read */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Belajar Membaca
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <GameCard
              title="Jembatan Bunyi"
              description="Belajar suku kata dasar"
              icon={<MessageSquare className="w-8 h-8 text-primary-foreground" />}
              variant="reading"
              stars={0}
              onClick={() => handleGameSelect('/game/syllable')}
            />
            
            <GameCard
              title="Susun Kata"
              description="Susun suku kata menjadi kata"
              icon={<BookOpen className="w-8 h-8 text-primary-foreground" />}
              variant="reading"
              stars={progress.reading.stars}
              onClick={() => handleGameSelect('/game/reading')}
            />
            
            <GameCard
              title="Baca & Cocokkan"
              description="Baca kata dan pilih gambar"
              icon={<BookOpen className="w-8 h-8 text-primary-foreground" />}
              variant="reading"
              stars={progress.reading.stars}
              onClick={() => handleGameSelect('/game/readmatch')}
            />
          </div>
        </div>

        {/* Other Games Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            Game Lainnya
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <GameCard
              title="Berhitung"
              description="Belajar angka dan matematika dasar"
              icon={<Calculator className="w-8 h-8 text-primary-foreground" />}
              variant="counting"
              stars={progress.counting.stars}
              onClick={() => handleGameSelect('/game/counting')}
            />
            
            <GameCard
              title="Menulis"
              description="Latihan menulis huruf dan angka"
              icon={<PenTool className="w-8 h-8 text-primary-foreground" />}
              variant="writing"
              stars={progress.writing.stars}
              onClick={() => handleGameSelect('/game/writing')}
            />
            
            <GameCard
              title="Menggambar"
              description="Gambar sesuai petunjuk yang diberikan"
              icon={<Palette className="w-8 h-8 text-primary-foreground" />}
              variant="drawing"
              stars={progress.drawing.stars}
              onClick={() => handleGameSelect('/game/drawing')}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-3xl shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Progres Belajarmu 📊</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatItem 
              label="Berhitung" 
              value={progress.counting.completed} 
              color="bg-primary" 
              icon="🔢"
            />
            <StatItem 
              label="Membaca" 
              value={progress.reading.completed} 
              color="bg-secondary" 
              icon="📝"
            />
            <StatItem 
              label="Menulis" 
              value={progress.writing.completed} 
              color="bg-game-writing" 
              icon="✍️"
            />
            <StatItem 
              label="Menggambar" 
              value={progress.drawing.completed} 
              color="bg-accent" 
              icon="🎨"
            />
          </div>
        </div>

        {/* Guide Section */}
        <div className="mt-6 bg-card rounded-3xl shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-3">Panduan Bermain 📖</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Pilih permainan yang ingin dimainkan
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Ketuk tombol 🔊 untuk mendengar kata
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              Jawab soal atau ikuti petunjuk dengan benar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              Dapatkan bintang untuk setiap jawaban benar
            </li>
          </ul>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={() => {
            playClick();
            setShowResetConfirm(true);
          }}
          className="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 bg-destructive/10 text-destructive font-bold rounded-2xl hover:bg-destructive/20 transition-colors active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset Progres</span>
        </button>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-md p-4">
          <div className="bg-card rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center animate-pop">
            <span className="text-5xl block mb-4">⚠️</span>
            <h2 className="text-xl font-bold text-foreground mb-2">Reset Progres?</h2>
            <p className="text-muted-foreground mb-6">
              Semua bintang dan progres belajarmu akan dihapus. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-colors active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 px-4 bg-destructive text-destructive-foreground font-bold rounded-2xl hover:bg-destructive/90 transition-colors active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => (
  <div className="bg-muted rounded-2xl p-4 text-center relative overflow-hidden">
    <div className={cn('absolute top-0 left-0 w-full h-1', color)} />
    <span className="text-2xl block mb-1">{icon}</span>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default Index;
