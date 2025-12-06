import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import Index from "./pages/Index";
import CountingGame from "./pages/games/CountingGame";
import WordArrangeGame from "./pages/games/WordArrangeGame";
import WritingGame from "./pages/games/WritingGame";
import DrawingGame from "./pages/games/DrawingGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game/counting" element={<CountingGame />} />
            <Route path="/game/reading" element={<WordArrangeGame />} />
            <Route path="/game/writing" element={<WritingGame />} />
            <Route path="/game/drawing" element={<DrawingGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
