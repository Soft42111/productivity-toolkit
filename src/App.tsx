import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import TodoList from "./pages/TodoList";
import TypingTest from "./pages/TypingTest";
import TypingPractice from "./pages/TypingPractice";
import Stopwatch from "./pages/Stopwatch";
import UnitConverter from "./pages/UnitConverter";
import PasswordGenerator from "./pages/PasswordGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/typing-test" element={<TypingTest />} />
          <Route path="/typing-practice" element={<TypingPractice />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
