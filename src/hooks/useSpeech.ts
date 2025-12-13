import { useCallback, useRef, useEffect } from 'react';

export const useSpeech = () => {
  const isSpeakingRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    // Ensure speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Use requestAnimationFrame + setTimeout for better timing
    requestAnimationFrame(() => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = rate;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        // Try to find Indonesian voice
        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find(voice => 
          voice.lang.includes('id') || voice.lang.includes('ID')
        );
        if (indonesianVoice) {
          utterance.voice = indonesianVoice;
        }
        
        utterance.onstart = () => {
          isSpeakingRef.current = true;
        };
        
        utterance.onend = () => {
          isSpeakingRef.current = false;
        };
        
        utterance.onerror = (e) => {
          console.log('Speech error:', e);
          isSpeakingRef.current = false;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  }, []);

  const speakSyllables = useCallback((word: string, syllables: string[]) => {
    // Speak each syllable with pause, then the full word
    const syllableText = syllables.join('... ');
    const fullText = syllableText + '... ' + word;
    speak(fullText, 0.7);
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
  }, []);

  return { speak, speakSyllables, stop };
};
