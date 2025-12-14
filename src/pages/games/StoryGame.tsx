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
import { Volume2 } from 'lucide-react';

interface StoryQuestion {
  id: number;
  title?: string;
  story: string;
  question: string;
  options: { text: string; image: string }[];
  correctIndex: number;
}

const storyBank: StoryQuestion[] = [
  // Cerita pendek (mudah)
  {
    id: 1,
    story: 'Rina pergi ke pasar. Rina membeli buah apel.',
    question: 'Rina membeli apa?',
    options: [
      { text: 'Apel', image: '🍎' },
      { text: 'Pisang', image: '🍌' },
      { text: 'Jeruk', image: '🍊' },
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    story: 'Budi punya kucing. Kucing Budi berwarna putih.',
    question: 'Apa warna kucing Budi?',
    options: [
      { text: 'Hitam', image: '🐈‍⬛' },
      { text: 'Putih', image: '🐱' },
      { text: 'Coklat', image: '🟤' },
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    story: 'Ibu memasak nasi goreng. Ayah makan nasi goreng.',
    question: 'Siapa yang memasak?',
    options: [
      { text: 'Ayah', image: '👨' },
      { text: 'Kakak', image: '👦' },
      { text: 'Ibu', image: '👩' },
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    story: 'Dina bermain bola di halaman. Dina bermain bersama Rudi.',
    question: 'Dina bermain dengan siapa?',
    options: [
      { text: 'Rudi', image: '👦' },
      { text: 'Maya', image: '👧' },
      { text: 'Sendiri', image: '🧍' },
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    story: 'Rina punya lima pensil. Rina memberi dua pensil untuk Tono.',
    question: 'Berapa pensil yang Rina beri?',
    options: [
      { text: 'Satu', image: '1️⃣' },
      { text: 'Dua', image: '2️⃣' },
      { text: 'Tiga', image: '3️⃣' },
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    story: 'Kakak pergi ke sekolah naik sepeda. Adik pergi naik mobil.',
    question: 'Kakak naik apa?',
    options: [
      { text: 'Mobil', image: '🚗' },
      { text: 'Bus', image: '🚌' },
      { text: 'Sepeda', image: '🚲' },
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    story: 'Hari ini hujan deras. Dewi membawa payung biru.',
    question: 'Dewi membawa apa?',
    options: [
      { text: 'Tas', image: '🎒' },
      { text: 'Payung', image: '☂️' },
      { text: 'Buku', image: '📚' },
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    story: 'Nenek tinggal di desa. Nenek menanam padi di sawah.',
    question: 'Nenek menanam apa?',
    options: [
      { text: 'Jagung', image: '🌽' },
      { text: 'Bunga', image: '🌸' },
      { text: 'Padi', image: '🌾' },
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    story: 'Maya suka makan roti. Maya makan roti setiap pagi.',
    question: 'Maya suka makan apa?',
    options: [
      { text: 'Roti', image: '🍞' },
      { text: 'Nasi', image: '🍚' },
      { text: 'Mie', image: '🍜' },
    ],
    correctIndex: 0,
  },
  {
    id: 10,
    story: 'Tono bermain di taman. Tono melihat burung di pohon.',
    question: 'Tono melihat apa?',
    options: [
      { text: 'Kucing', image: '🐱' },
      { text: 'Burung', image: '🐦' },
      { text: 'Kelinci', image: '🐰' },
    ],
    correctIndex: 1,
  },
  {
    id: 11,
    story: 'Rudi mempunyai anjing. Anjing Rudi suka bermain bola.',
    question: 'Anjing Rudi suka bermain apa?',
    options: [
      { text: 'Bola', image: '⚽' },
      { text: 'Boneka', image: '🧸' },
      { text: 'Tali', image: '🪢' },
    ],
    correctIndex: 0,
  },
  {
    id: 12,
    story: 'Ibu membeli sayuran di pasar. Ibu membeli wortel dan tomat.',
    question: 'Ibu membeli sayuran di mana?',
    options: [
      { text: 'Toko', image: '🏪' },
      { text: 'Pasar', image: '🏬' },
      { text: 'Rumah', image: '🏠' },
    ],
    correctIndex: 1,
  },
  {
    id: 13,
    story: 'Doni suka membaca buku cerita. Doni membaca setiap malam.',
    question: 'Doni suka membaca apa?',
    options: [
      { text: 'Koran', image: '📰' },
      { text: 'Komik', image: '📕' },
      { text: 'Buku cerita', image: '📚' },
    ],
    correctIndex: 2,
  },
  {
    id: 14,
    story: 'Kakek punya kebun buah. Di kebun ada pohon mangga.',
    question: 'Pohon apa yang ada di kebun kakek?',
    options: [
      { text: 'Mangga', image: '🥭' },
      { text: 'Apel', image: '🍎' },
      { text: 'Jeruk', image: '🍊' },
    ],
    correctIndex: 0,
  },
  {
    id: 15,
    story: 'Lisa menggambar bunga. Bunga yang Lisa gambar berwarna merah.',
    question: 'Apa warna bunga yang Lisa gambar?',
    options: [
      { text: 'Kuning', image: '🌻' },
      { text: 'Merah', image: '🌹' },
      { text: 'Biru', image: '🔵' },
    ],
    correctIndex: 1,
  },
  // Cerita pendek tambahan
  {
    id: 16,
    story: 'Andi bermain layang-layang. Layang-layang Andi terbang tinggi.',
    question: 'Apa yang dimainkan Andi?',
    options: [
      { text: 'Layang-layang', image: '🪁' },
      { text: 'Bola', image: '⚽' },
      { text: 'Boneka', image: '🧸' },
    ],
    correctIndex: 0,
  },
  {
    id: 17,
    story: 'Tina punya tiga boneka. Boneka kesukaan Tina berwarna pink.',
    question: 'Berapa boneka yang Tina punya?',
    options: [
      { text: 'Dua', image: '2️⃣' },
      { text: 'Tiga', image: '3️⃣' },
      { text: 'Empat', image: '4️⃣' },
    ],
    correctIndex: 1,
  },
  {
    id: 18,
    story: 'Pak Guru mengajar di kelas. Murid-murid belajar dengan rajin.',
    question: 'Siapa yang mengajar?',
    options: [
      { text: 'Pak Guru', image: '👨‍🏫' },
      { text: 'Bu Guru', image: '👩‍🏫' },
      { text: 'Murid', image: '👦' },
    ],
    correctIndex: 0,
  },
  {
    id: 19,
    story: 'Hari Minggu keluarga pergi ke pantai. Mereka bermain pasir.',
    question: 'Keluarga pergi ke mana?',
    options: [
      { text: 'Gunung', image: '⛰️' },
      { text: 'Pantai', image: '🏖️' },
      { text: 'Taman', image: '🌳' },
    ],
    correctIndex: 1,
  },
  {
    id: 20,
    story: 'Putri menyiram bunga setiap pagi. Bunganya tumbuh subur.',
    question: 'Kapan Putri menyiram bunga?',
    options: [
      { text: 'Siang', image: '☀️' },
      { text: 'Malam', image: '🌙' },
      { text: 'Pagi', image: '🌅' },
    ],
    correctIndex: 2,
  },
  // Cerita panjang (sedang)
  {
    id: 21,
    title: 'Kucing Malas',
    story: 'Kucing adalah hewan berbulu lembut yang suka tidur. Kucing bisa tidur sampai 16 jam sehari. Kucing suka makan ikan dan daging. Kucing juga suka bermain dengan bola benang. Kucing adalah hewan peliharaan yang lucu dan menggemaskan.',
    question: 'Berapa jam kucing bisa tidur dalam sehari?',
    options: [
      { text: '10 jam', image: '🔟' },
      { text: '16 jam', image: '🕐' },
      { text: '5 jam', image: '5️⃣' },
    ],
    correctIndex: 1,
  },
  {
    id: 22,
    title: 'Buah Pisang',
    story: 'Pisang adalah buah yang berwarna kuning. Pisang memiliki rasa manis dan lembut. Pisang baik untuk kesehatan karena mengandung banyak vitamin. Kita bisa makan pisang langsung atau dibuat jus. Pisang juga bisa dibuat menjadi keripik pisang yang renyah.',
    question: 'Apa warna buah pisang?',
    options: [
      { text: 'Merah', image: '🔴' },
      { text: 'Hijau', image: '🟢' },
      { text: 'Kuning', image: '🟡' },
    ],
    correctIndex: 2,
  },
  {
    id: 23,
    title: 'Gajah Besar',
    story: 'Gajah adalah hewan darat terbesar di dunia. Gajah memiliki belalai yang panjang. Belalai gajah digunakan untuk mengambil makanan dan minum air. Gajah suka makan rumput, daun, dan buah-buahan. Gajah hidup berkelompok bersama keluarganya.',
    question: 'Untuk apa gajah menggunakan belalainya?',
    options: [
      { text: 'Untuk terbang', image: '✈️' },
      { text: 'Untuk mengambil makanan', image: '🍃' },
      { text: 'Untuk berenang', image: '🏊' },
    ],
    correctIndex: 1,
  },
  {
    id: 24,
    title: 'Lebah Rajin',
    story: 'Lebah adalah serangga kecil yang sangat rajin. Lebah hidup di sarang bersama ribuan lebah lain. Lebah membuat madu dari nektar bunga. Madu sangat manis dan baik untuk kesehatan. Lebah terbang dari bunga ke bunga untuk mengumpulkan nektar.',
    question: 'Lebah membuat madu dari apa?',
    options: [
      { text: 'Air', image: '💧' },
      { text: 'Nektar bunga', image: '🌸' },
      { text: 'Daun', image: '🍃' },
    ],
    correctIndex: 1,
  },
  {
    id: 25,
    title: 'Matahari',
    story: 'Matahari adalah bintang yang sangat besar dan panas. Matahari memberikan cahaya dan panas untuk bumi. Tanpa matahari, bumi akan gelap dan dingin. Matahari terbit di timur dan terbenam di barat. Matahari sangat penting untuk kehidupan di bumi.',
    question: 'Matahari terbit dari arah mana?',
    options: [
      { text: 'Barat', image: '⬅️' },
      { text: 'Utara', image: '⬆️' },
      { text: 'Timur', image: '➡️' },
    ],
    correctIndex: 2,
  },
  {
    id: 26,
    title: 'Buah Semangka',
    story: 'Semangka adalah buah yang besar dan bulat. Kulit semangka berwarna hijau dengan garis-garis. Daging semangka berwarna merah dan rasanya manis. Semangka mengandung banyak air sehingga sangat segar. Semangka sangat nikmat dimakan saat cuaca panas.',
    question: 'Apa warna daging buah semangka?',
    options: [
      { text: 'Hijau', image: '🟢' },
      { text: 'Merah', image: '🔴' },
      { text: 'Kuning', image: '🟡' },
    ],
    correctIndex: 1,
  },
  {
    id: 27,
    title: 'Kelinci Lucu',
    story: 'Kelinci adalah hewan yang lucu dan menggemaskan. Kelinci memiliki telinga yang panjang dan bulu yang lembut. Kelinci suka makan wortel dan sayuran hijau. Kelinci bisa melompat dengan cepat. Banyak orang memelihara kelinci sebagai hewan peliharaan.',
    question: 'Makanan kesukaan kelinci adalah?',
    options: [
      { text: 'Wortel', image: '🥕' },
      { text: 'Daging', image: '🍖' },
      { text: 'Ikan', image: '🐟' },
    ],
    correctIndex: 0,
  },
  {
    id: 28,
    title: 'Hujan',
    story: 'Hujan turun dari awan di langit. Air hujan berasal dari uap air laut yang naik ke atas. Hujan membuat tanaman tumbuh subur. Saat hujan, kita perlu membawa payung agar tidak basah. Hujan juga membuat udara menjadi segar dan sejuk.',
    question: 'Air hujan berasal dari mana?',
    options: [
      { text: 'Sungai', image: '🏞️' },
      { text: 'Uap air laut', image: '🌊' },
      { text: 'Gunung', image: '⛰️' },
    ],
    correctIndex: 1,
  },
  {
    id: 29,
    title: 'Burung Merak',
    story: 'Burung merak adalah burung yang sangat indah. Burung merak jantan memiliki ekor yang besar dan berwarna-warni. Ekor merak bisa mengembang seperti kipas. Burung merak suka makan biji-bijian dan serangga. Burung merak berasal dari Asia.',
    question: 'Ekor burung merak bisa mengembang seperti apa?',
    options: [
      { text: 'Bola', image: '⚽' },
      { text: 'Kipas', image: '🪭' },
      { text: 'Kotak', image: '🔲' },
    ],
    correctIndex: 1,
  },
  {
    id: 30,
    title: 'Bintang di Langit',
    story: 'Bintang adalah benda langit yang bersinar di malam hari. Ada banyak sekali bintang di langit. Bintang terlihat kecil karena jaraknya sangat jauh dari bumi. Pada malam yang cerah, kita bisa melihat banyak bintang berkelip-kelip. Orang zaman dulu menggunakan bintang untuk petunjuk arah.',
    question: 'Kapan kita bisa melihat bintang?',
    options: [
      { text: 'Pagi hari', image: '🌅' },
      { text: 'Siang hari', image: '☀️' },
      { text: 'Malam hari', image: '🌙' },
    ],
    correctIndex: 2,
  },
  // Cerita panjang tambahan (sulit)
  {
    id: 31,
    title: 'Harimau Sumatra',
    story: 'Harimau Sumatra adalah harimau yang hidup di pulau Sumatra, Indonesia. Harimau ini memiliki bulu berwarna oranye dengan loreng hitam. Harimau Sumatra adalah pemangsa yang kuat. Mereka berburu rusa, babi hutan, dan hewan lainnya. Sayangnya, harimau Sumatra terancam punah karena hutan tempat tinggalnya banyak yang ditebang.',
    question: 'Di mana harimau Sumatra tinggal?',
    options: [
      { text: 'Pulau Jawa', image: '🏝️' },
      { text: 'Pulau Sumatra', image: '🌴' },
      { text: 'Pulau Kalimantan', image: '🌲' },
    ],
    correctIndex: 1,
  },
  {
    id: 32,
    title: 'Lumba-lumba Pintar',
    story: 'Lumba-lumba adalah mamalia laut yang sangat pintar. Lumba-lumba bernapas dengan paru-paru seperti manusia. Mereka harus naik ke permukaan untuk bernapas. Lumba-lumba berkomunikasi dengan suara-suara khusus. Lumba-lumba suka berenang berkelompok dan sangat ramah kepada manusia.',
    question: 'Bagaimana lumba-lumba bernapas?',
    options: [
      { text: 'Dengan insang', image: '🐟' },
      { text: 'Dengan paru-paru', image: '💨' },
      { text: 'Dengan kulit', image: '🦎' },
    ],
    correctIndex: 1,
  },
  {
    id: 33,
    title: 'Petualangan di Kebun',
    story: 'Rudi dan Maya pergi ke kebun kakek. Di sana mereka melihat banyak pohon buah. Ada pohon mangga, jeruk, dan rambutan. Rudi membantu kakek memetik mangga yang sudah matang. Maya mengumpulkan jeruk yang jatuh. Mereka sangat senang bisa membantu kakek.',
    question: 'Siapa yang membantu memetik mangga?',
    options: [
      { text: 'Maya', image: '👧' },
      { text: 'Rudi', image: '👦' },
      { text: 'Kakek', image: '👴' },
    ],
    correctIndex: 1,
  },
  {
    id: 34,
    title: 'Sekolah Baru',
    story: 'Hari pertama sekolah sangat menegangkan untuk Dina. Dina masuk ke kelas baru dan belum kenal siapa-siapa. Tiba-tiba seorang anak perempuan menyapa Dina dengan ramah. Namanya adalah Sari. Sari mengajak Dina duduk bersamanya. Sejak hari itu, Dina dan Sari menjadi teman baik.',
    question: 'Siapa nama teman baru Dina?',
    options: [
      { text: 'Maya', image: '👧' },
      { text: 'Rina', image: '👧' },
      { text: 'Sari', image: '👧' },
    ],
    correctIndex: 2,
  },
  {
    id: 35,
    title: 'Dokter Hewan',
    story: 'Pak Budi adalah seorang dokter hewan. Setiap hari, Pak Budi menolong hewan yang sakit. Hari ini ada seekor kucing yang kakinya terluka. Pak Budi dengan hati-hati membersihkan luka kucing itu. Setelah diberi obat, kucing itu merasa lebih baik. Pemilik kucing sangat berterima kasih kepada Pak Budi.',
    question: 'Apa pekerjaan Pak Budi?',
    options: [
      { text: 'Dokter manusia', image: '👨‍⚕️' },
      { text: 'Dokter hewan', image: '🩺' },
      { text: 'Guru', image: '👨‍🏫' },
    ],
    correctIndex: 1,
  },
  {
    id: 36,
    title: 'Penyu dan Laut',
    story: 'Penyu adalah reptil yang hidup di laut. Penyu memiliki cangkang keras untuk melindungi tubuhnya. Penyu betina bertelur di pantai berpasir. Anak penyu yang baru menetas langsung berlari menuju laut. Penyu bisa berenang sangat jauh dan hidup sangat lama, bahkan sampai seratus tahun.',
    question: 'Di mana penyu betina bertelur?',
    options: [
      { text: 'Di laut', image: '🌊' },
      { text: 'Di pantai', image: '🏖️' },
      { text: 'Di sungai', image: '🏞️' },
    ],
    correctIndex: 1,
  },
  {
    id: 37,
    title: 'Petani dan Sawah',
    story: 'Pak Tani bekerja di sawah setiap hari. Pagi-pagi, Pak Tani sudah pergi ke sawah membawa cangkul. Pak Tani menanam padi dengan tekun. Saat musim panen, padi yang ditanam Pak Tani berbuah lebat. Pak Tani menjual beras hasil panennya ke pasar. Uang hasil panen digunakan untuk kebutuhan keluarga.',
    question: 'Apa yang dibawa Pak Tani ke sawah?',
    options: [
      { text: 'Sapu', image: '🧹' },
      { text: 'Cangkul', image: '⛏️' },
      { text: 'Panci', image: '🍳' },
    ],
    correctIndex: 1,
  },
  {
    id: 38,
    title: 'Perpustakaan Sekolah',
    story: 'Di sekolah Tina ada perpustakaan yang besar. Perpustakaan itu memiliki ribuan buku. Tina suka membaca buku cerita dan ensiklopedia. Setiap istirahat, Tina pergi ke perpustakaan. Bu Librarian selalu ramah membantu Tina mencari buku. Tina ingin menjadi penulis buku ketika besar nanti.',
    question: 'Apa cita-cita Tina?',
    options: [
      { text: 'Guru', image: '👩‍🏫' },
      { text: 'Dokter', image: '👩‍⚕️' },
      { text: 'Penulis buku', image: '✍️' },
    ],
    correctIndex: 2,
  },
  {
    id: 39,
    title: 'Elang dan Tikus',
    story: 'Elang adalah burung pemangsa yang sangat tajam penglihatannya. Elang terbang tinggi di langit mencari mangsa. Dari atas, elang bisa melihat tikus kecil yang berjalan di tanah. Dengan cepat, elang menukik ke bawah. Tikus yang tidak waspada menjadi makanan elang. Begitulah cara elang berburu makanannya.',
    question: 'Apa yang dimangsa elang dalam cerita?',
    options: [
      { text: 'Ikan', image: '🐟' },
      { text: 'Tikus', image: '🐭' },
      { text: 'Kelinci', image: '🐰' },
    ],
    correctIndex: 1,
  },
  {
    id: 40,
    title: 'Musim Hujan',
    story: 'Bulan November adalah awal musim hujan di Indonesia. Langit sering mendung dan hujan turun hampir setiap hari. Anak-anak senang bermain hujan-hujanan. Namun, ibu selalu mengingatkan untuk memakai jas hujan agar tidak sakit. Petani juga senang karena sawah mereka mendapat banyak air. Musim hujan membawa berkah untuk semua.',
    question: 'Kapan musim hujan dimulai di Indonesia?',
    options: [
      { text: 'Bulan Mei', image: '5️⃣' },
      { text: 'Bulan November', image: '1️⃣1️⃣' },
      { text: 'Bulan Januari', image: '1️⃣' },
    ],
    correctIndex: 1,
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (count: number = 5): StoryQuestion[] => {
  return shuffleArray(storyBank).slice(0, count);
};

export const StoryGame = () => {
  const { progress, addStars, completeLevel } = useGame();
  const { 
    playCorrect, playWrong, playClick, playLevelComplete,
    isMuted, toggleMute, isBgMusicPlaying, toggleBgMusic, startBgMusic 
  } = useSound();
  const { speak } = useSpeech();
  
  const [questions, setQuestions] = useState<StoryQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCompletedLevel, setHasCompletedLevel] = useState(false);

  const initGame = useCallback(() => {
    const newQuestions = generateQuestions(5);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setHasCompletedLevel(false);
  }, []);

  useEffect(() => {
    initGame();
    if (!isBgMusicPlaying && !isMuted) {
      startBgMusic();
    }
  }, []);

  const addStarsRef = useRef(addStars);
  addStarsRef.current = addStars;

  const handleSpeakStory = useCallback(() => {
    playClick();
    if (questions.length > 0 && currentIndex < questions.length) {
      const current = questions[currentIndex];
      speak(current.story + '. ' + current.question, 0.8);
    }
  }, [questions, currentIndex, playClick, speak]);

  const handleAnswer = (index: number) => {
    if (feedback !== null || selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentIndex].correctIndex;
    
    if (isCorrect) {
      playCorrect();
      setCorrectCount(prev => prev + 1);
      addStarsRef.current('story', 1);
    } else {
      playWrong();
    }
    
    setFeedback(isCorrect);
  };

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    
    if (currentIndex + 1 >= questions.length) {
      playLevelComplete();
      setIsComplete(true);
      if (!hasCompletedLevel) {
        completeLevel('story');
        setHasCompletedLevel(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length, playLevelComplete, hasCompletedLevel, completeLevel]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const starsEarned = correctCount >= 4 ? 3 : correctCount >= 3 ? 2 : correctCount >= 1 ? 1 : 0;
  const isLongStory = currentQuestion.story.length > 100;

  return (
    <div className="min-h-screen gradient-game-bg flex flex-col relative">
      <FloatingIcons variant="reading" />
      
      <GameHeader 
        title="Soal Cerita"
        stars={progress.story.stars}
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
      
      <main className="flex-1 flex flex-col items-center justify-start p-4 gap-4 relative z-10 overflow-y-auto">
        {/* Story Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-card p-5 w-full max-w-sm border-2 border-secondary/20">
          <div className="flex items-start justify-between mb-3">
            <div>
              {currentQuestion.title && (
                <h3 className="text-lg font-bold text-primary mb-1">{currentQuestion.title}</h3>
              )}
              <p className="text-sm text-muted-foreground">
                {isLongStory ? 'Baca cerita ini dengan teliti:' : 'Baca cerita ini:'}
              </p>
            </div>
            <button
              onClick={handleSpeakStory}
              className="w-12 h-12 bg-secondary/20 rounded-full hover:bg-secondary/30 transition-colors active:scale-95 shadow-md flex items-center justify-center shrink-0"
              aria-label="Dengarkan cerita"
            >
              <Volume2 className="w-5 h-5 text-secondary pointer-events-none" />
            </button>
          </div>
          
          <p className={cn(
            "font-medium text-foreground leading-relaxed mb-4",
            isLongStory ? "text-base" : "text-xl"
          )}>
            {currentQuestion.story}
          </p>
          
          <div className="border-t-2 border-dashed border-border pt-4">
            <p className="text-lg font-bold text-primary">
              {currentQuestion.question}
            </p>
          </div>
        </div>
        
        {/* Answer Options */}
        <div className="w-full max-w-sm space-y-3 pb-4">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl bg-card/95 backdrop-blur-sm shadow-card',
                'transition-all duration-200 hover:scale-[1.02] active:scale-95',
                'border-2',
                selectedAnswer === i
                  ? i === currentQuestion.correctIndex
                    ? 'ring-4 ring-success bg-success/10 border-success'
                    : 'ring-4 ring-destructive bg-destructive/10 border-destructive animate-shake'
                  : selectedAnswer !== null && i === currentQuestion.correctIndex
                    ? 'ring-4 ring-success bg-success/10 border-success'
                    : 'border-primary/20 hover:shadow-lg hover:border-primary/40'
              )}
            >
              <span className="text-4xl">{option.image}</span>
              <span className="text-xl font-bold text-foreground">{option.text}</span>
            </button>
          ))}
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
          variant="reading"
          onReplay={initGame}
          onContinue={initGame}
        />
      )}
    </div>
  );
};

export default StoryGame;