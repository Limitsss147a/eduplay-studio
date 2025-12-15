import { useCallback, useState, useEffect } from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      // Di Android (Native), kita asumsikan support karena pakai Plugin
      if (Capacitor.isNativePlatform()) {
        setIsSupported(true);
      } else {
        // Di Web Browser biasa, kita cek fitur bawaan
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          setIsSupported(true);
        }
      }
    };
    checkSupport();
  }, []);

  const speak = useCallback(async (text: string, rate: number = 1.0) => {
    if (!text) return;

    try {
      // Hentikan suara sebelumnya (agar tidak tumpang tindih)
      await stop();

      if (Capacitor.isNativePlatform()) {
        // --- LOGIKA UNTUK HP (ANDROID/IOS) ---
        await TextToSpeech.speak({
          text: text,
          lang: 'id-ID',    // Pakai Bahasa Indonesia
          rate: rate,       // Kecepatan (0.5 - 2.0)
          pitch: 1.0,       // Nada
          volume: 1.0,
          category: 'ambient',
        });
      } else {
        // --- LOGIKA UNTUK WEB BROWSER (FALLBACK) ---
        // Ini tetap kita simpan agar bisa dites di Chrome laptop
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = rate;
        
        // Cari suara Indonesia di browser
        const voices = window.speechSynthesis.getVoices();
        const indoVoice = voices.find(v => v.lang.includes('id'));
        if (indoVoice) utterance.voice = indoVoice;

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Gagal memutar suara:", error);
    }
  }, []);

  // Fungsi speakSyllables dihapus karena ejaan terdeteksi bahasa Inggris
  // Langsung baca kata saja dengan rate lambat

  const stop = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      // Abaikan error saat stop
    }
  }, []);

  return { 
    speak, 
    stop, // alias cancel
    cancel: stop,
    isSupported 
  };
};