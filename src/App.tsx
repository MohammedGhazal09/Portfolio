import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SmoothScrollProvider } from "./components/SmoothScrollProvider";
import { ScrollProgress } from "./components/ScrollProgress";
import { GrainOverlay } from "./components/GrainOverlay";
import { Cursor } from "./components/Cursor";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Plugins are registered as a side effect of importing this module
import "./lib/gsap";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScrollProvider>
          <GrainOverlay />
          <ScrollProgress />
          <Cursor />
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScrollProvider>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
