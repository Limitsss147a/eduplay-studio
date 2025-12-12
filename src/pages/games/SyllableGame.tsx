import React, { useEffect } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';

const syllables = [
  // Vocal A
  ['BA', 'BI', 'BU', 'BE', 'BO'],
  ['CA', 'CI', 'CU', 'CE', 'CO'],
  ['DA', 'DI', 'DU', 'DE', 'DO'],
  ['FA', 'FI', 'FU', 'FE', 'FO'],
  ['GA', 'GI', 'GU', 'GE', 'GO'],
  ['HA', 'HI', 'HU', 'HE', 'HO'],
  ['JA', 'JI', 'JU', 'JE', 'JO'],
  ['KA', 'KI', 'KU', 'KE', 'KO'],
  ['LA', 'LI', 'LU', 'LE', 'LO'],
  ['MA', 'MI', 'MU', 'ME', 'MO'],
  ['NA', 'NI', 'NU', 'NE', 'NO'],
  ['PA', 'PI', 'PU', 'PE', 'PO'],
  ['RA', 'RI', 'RU', 'RE', 'RO'],
  ['SA', 'SI', 'SU', 'SE', 'SO'],
  ['TA', 'TI', 'TU', 'TE', 'TO'],
  ['WA', 'WI', 'WU', 'WE', 'WO'],
  ['YA', 'YI', 'YU', 'YE', 'YO'],
];

const colors = [
  'bg-primary',
  'bg-secondary', 
  'bg-game-writing',
  'bg-accent',
  'bg-warning',
];

export const SyllableGame = () => {
  const { progress } = useGame();
  const { playClick, isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic } = useSound();
  const { speak } = useSpeech();
  const [activeRow, setActiveRow] = React.useState(0);

  useEffect(() => {
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  const handleSyllablePress = (syllable: string) => {
    playClick();
    speak(syllable, 0.7);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader 
        title="Jembatan Bunyi"
        stars={progress.reading.stars}
        variant="reading"
        isMuted={isMuted}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleMute={toggleMute}
        onToggleBgMusic={toggleBgMusic}
      />
      
      <main className="flex-1 flex flex-col p-4 overflow-auto">
        {/* Instructions */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-4 text-center">
          <p className="text-lg font-bold text-foreground mb-1">Ketuk untuk mendengar bunyi! 🔊</p>
          <p className="text-sm text-muted-foreground">Tekan tombol suku kata untuk mendengar cara membacanya</p>
        </div>

        {/* Row selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {syllables.map((row, index) => (
            <button
              key={index}
              onClick={() => {
                playClick();
                setActiveRow(index);
              }}
              className={cn(
                'px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all',
                activeRow === index 
                  ? 'bg-primary text-primary-foreground shadow-button' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {row[0][0]}
            </button>
          ))}
        </div>

        {/* Syllable grid */}
        <div className="grid grid-cols-5 gap-3">
          {syllables[activeRow].map((syllable, index) => (
            <button
              key={syllable}
              onClick={() => handleSyllablePress(syllable)}
              className={cn(
                'aspect-square rounded-2xl text-2xl font-bold text-primary-foreground',
                'shadow-card hover:scale-105 active:scale-95 transition-all',
                'flex items-center justify-center',
                colors[index % colors.length]
              )}
            >
              {syllable}
            </button>
          ))}
        </div>

        {/* Vowels section */}
        <div className="mt-6">
          <p className="text-sm font-bold text-muted-foreground mb-3">Huruf Vokal:</p>
          <div className="flex gap-3 justify-center">
            {['A', 'I', 'U', 'E', 'O'].map((vowel, index) => (
              <button
                key={vowel}
                onClick={() => handleSyllablePress(vowel)}
                className={cn(
                  'w-16 h-16 rounded-2xl text-3xl font-bold text-primary-foreground',
                  'shadow-card hover:scale-105 active:scale-95 transition-all',
                  colors[index]
                )}
              >
                {vowel}
              </button>
            ))}
          </div>
        </div>

        {/* Common syllables */}
        <div className="mt-6">
          <p className="text-sm font-bold text-muted-foreground mb-3">Suku Kata Umum:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['NG', 'NY', 'AN', 'IN', 'UN', 'EN', 'ON', 'AR', 'IR', 'UR', 'ER', 'OR'].map((syllable) => (
              <button
                key={syllable}
                onClick={() => handleSyllablePress(syllable)}
                className="px-4 py-3 bg-card rounded-xl text-lg font-bold text-foreground shadow-card hover:scale-105 active:scale-95 transition-all border border-border"
              >
                {syllable}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SyllableGame;
