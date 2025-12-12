import { useCallback, useRef } from 'react';

export const useSpeech = () => {
  const isSpeakingRef = useRef(false);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
    };
    
    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakSyllables = useCallback((word: string, syllables: string[]) => {
    // Speak each syllable with pause, then the full word
    const fullText = syllables.join('... ') + '... ' + word;
    speak(fullText, 0.7);
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
  }, []);

  return { speak, speakSyllables, stop };
};
