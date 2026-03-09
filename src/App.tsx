import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import WordArrangeGame from "./pages/games/WordArrangeGame";
import ReadMatchGame from "./pages/games/ReadMatchGame";
import StoryGame from "./pages/games/StoryGame";
import SentenceArrangeGame from "./pages/games/SentenceArrangeGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/game/reading" element={<PageTransition><WordArrangeGame /></PageTransition>} />
        <Route path="/game/readmatch" element={<PageTransition><ReadMatchGame /></PageTransition>} />
        <Route path="/game/story" element={<PageTransition><StoryGame /></PageTransition>} />
        <Route path="/game/sentence" element={<PageTransition><SentenceArrangeGame /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <Toaster />
          <Sonner />
          <HashRouter>
            <AnimatedRoutes />
          </HashRouter>
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
