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
import ChatGemini from "./pages/ChatGemini";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import NotesApp from "./pages/NotesApp";
import ExpenseTracker from "./pages/ExpenseTracker";
import PomodoroTimer from "./pages/PomodoroTimer";
import MarkdownEditor from "./pages/MarkdownEditor";
import ColorPicker from "./pages/ColorPicker";
import JSONFormatter from "./pages/JSONFormatter";
import Base64Tool from "./pages/Base64Tool";
import RandomGenerator from "./pages/RandomGenerator";
import BMICalculator from "./pages/BMICalculator";
import AgeCalculator from "./pages/AgeCalculator";
import WordCounter from "./pages/WordCounter";
import QuoteGenerator from "./pages/QuoteGenerator";
import CountdownTimer from "./pages/CountdownTimer";
import HabitTracker from "./pages/HabitTracker";
import UserProfile from "./pages/UserProfile";
import PinnedApps from "./pages/PinnedApps";
import WeatherDashboard from "./pages/WeatherDashboard";
import CurrencyConverter from "./pages/CurrencyConverter";
import VoiceRecorder from "./pages/VoiceRecorder";
import LinkShortener from "./pages/LinkShortener";
import IslamicStudies from "./pages/IslamicStudies";
import IslamicReminders from "./pages/IslamicReminders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pinned" element={<PinnedApps />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/typing-test" element={<TypingTest />} />
          <Route path="/typing-practice" element={<TypingPractice />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/chat-gemini" element={<ChatGemini />} />
          <Route path="/qr-generator" element={<QRCodeGenerator />} />
          <Route path="/notes" element={<NotesApp />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/markdown" element={<MarkdownEditor />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/random" element={<RandomGenerator />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/quotes" element={<QuoteGenerator />} />
          <Route path="/countdown" element={<CountdownTimer />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route path="/currency" element={<CurrencyConverter />} />
          <Route path="/voice-recorder" element={<VoiceRecorder />} />
          <Route path="/link-shortener" element={<LinkShortener />} />
          <Route path="/islamic-studies" element={<IslamicStudies />} />
          <Route path="/islamic-reminders" element={<IslamicReminders />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
