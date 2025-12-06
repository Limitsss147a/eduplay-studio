import { useCallback, useEffect, useRef, useState } from 'react';

// Simple sound URLs using Web Audio API generated tones
const createOscillator = (
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const bgMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    // Happy ascending tones
    createOscillator(ctx, 523.25, 0.15, 'sine'); // C5
    setTimeout(() => createOscillator(ctx, 659.25, 0.15, 'sine'), 100); // E5
    setTimeout(() => createOscillator(ctx, 783.99, 0.2, 'sine'), 200); // G5
  }, [isMuted, getAudioContext]);

  const playWrong = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    // Sad descending tones
    createOscillator(ctx, 311.13, 0.2, 'triangle'); // Eb4
    setTimeout(() => createOscillator(ctx, 277.18, 0.3, 'triangle'), 150); // Db4
  }, [isMuted, getAudioContext]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    createOscillator(ctx, 800, 0.05, 'square');
  }, [isMuted, getAudioContext]);

  const playSelect = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    createOscillator(ctx, 600, 0.08, 'sine');
  }, [isMuted, getAudioContext]);

  const playStar = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    // Sparkle sound
    createOscillator(ctx, 1200, 0.1, 'sine');
    setTimeout(() => createOscillator(ctx, 1400, 0.1, 'sine'), 50);
    setTimeout(() => createOscillator(ctx, 1600, 0.15, 'sine'), 100);
  }, [isMuted, getAudioContext]);

  const playLevelComplete = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, 0.2, 'sine'), i * 150);
    });
  }, [isMuted, getAudioContext]);

  const startBgMusic = useCallback(() => {
    if (isMuted || isBgMusicPlaying) return;
    
    setIsBgMusicPlaying(true);
    const ctx = getAudioContext();
    
    // Fun children's melody - more varied and cheerful
    const melodies = [
      // Melody 1: Twinkle-like
      [
        { freq: 523, dur: 0.25 }, // C5
        { freq: 523, dur: 0.25 }, // C5
        { freq: 784, dur: 0.25 }, // G5
        { freq: 784, dur: 0.25 }, // G5
        { freq: 880, dur: 0.25 }, // A5
        { freq: 880, dur: 0.25 }, // A5
        { freq: 784, dur: 0.5 },  // G5
        { freq: 698, dur: 0.25 }, // F5
        { freq: 698, dur: 0.25 }, // F5
        { freq: 659, dur: 0.25 }, // E5
        { freq: 659, dur: 0.25 }, // E5
        { freq: 587, dur: 0.25 }, // D5
        { freq: 587, dur: 0.25 }, // D5
        { freq: 523, dur: 0.5 },  // C5
      ],
      // Melody 2: Happy bounce
      [
        { freq: 392, dur: 0.2 },  // G4
        { freq: 440, dur: 0.2 },  // A4
        { freq: 523, dur: 0.3 },  // C5
        { freq: 440, dur: 0.2 },  // A4
        { freq: 523, dur: 0.2 },  // C5
        { freq: 659, dur: 0.4 },  // E5
        { freq: 587, dur: 0.2 },  // D5
        { freq: 523, dur: 0.2 },  // C5
        { freq: 440, dur: 0.3 },  // A4
        { freq: 392, dur: 0.4 },  // G4
      ],
    ];
    
    const currentMelody = melodies[Math.floor(Math.random() * melodies.length)];
    let noteIndex = 0;
    
    const playNextNote = () => {
      const note = currentMelody[noteIndex % currentMelody.length];
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';
      
      // Softer background volume
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.dur);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + note.dur);
      
      noteIndex++;
    };
    
    bgMusicIntervalRef.current = setInterval(playNextNote, 350);
    playNextNote();
  }, [isMuted, isBgMusicPlaying, getAudioContext]);

  const stopBgMusic = useCallback(() => {
    setIsBgMusicPlaying(false);
    if (bgMusicIntervalRef.current) {
      clearInterval(bgMusicIntervalRef.current);
      bgMusicIntervalRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) {
        stopBgMusic();
      }
      return !prev;
    });
  }, [stopBgMusic]);

  const toggleBgMusic = useCallback(() => {
    if (isBgMusicPlaying) {
      stopBgMusic();
    } else {
      startBgMusic();
    }
  }, [isBgMusicPlaying, startBgMusic, stopBgMusic]);

  useEffect(() => {
    return () => {
      stopBgMusic();
    };
  }, [stopBgMusic]);

  return {
    playCorrect,
    playWrong,
    playClick,
    playSelect,
    playStar,
    playLevelComplete,
    startBgMusic,
    stopBgMusic,
    toggleBgMusic,
    toggleMute,
    isMuted,
    isBgMusicPlaying,
  };
};
