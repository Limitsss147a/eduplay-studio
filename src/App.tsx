import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import CountingGame from "./pages/games/CountingGame";
import WordArrangeGame from "./pages/games/WordArrangeGame";
import ReadMatchGame from "./pages/games/ReadMatchGame";
import StoryGame from "./pages/games/StoryGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game/counting" element={<CountingGame />} />
              <Route path="/game/reading" element={<WordArrangeGame />} />
              <Route path="/game/readmatch" element={<ReadMatchGame />} />
              <Route path="/game/story" element={<StoryGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
