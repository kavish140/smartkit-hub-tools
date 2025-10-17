import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PasswordGenerator from "./pages/PasswordGenerator";
import QRGenerator from "./pages/QRGenerator";
import Calculator from "./pages/Calculator";
import UnitConverter from "./pages/UnitConverter";
import AgeCalculator from "./pages/AgeCalculator";
import TextCounter from "./pages/TextCounter";
import ColorPicker from "./pages/ColorPicker";
import HashGenerator from "./pages/HashGenerator";
import JSONFormatter from "./pages/JSONFormatter";
import Base64Encoder from "./pages/Base64Encoder";
import EmailValidator from "./pages/EmailValidator";
import UUIDGenerator from "./pages/UUIDGenerator";
import PomodoroTimer from "./pages/PomodoroTimer";
import GPACalculator from "./pages/GPACalculator";
import WorldClock from "./pages/WorldClock";
import CurrencyConverter from "./pages/CurrencyConverter";
import WeatherForecast from "./pages/WeatherForecast";
import ImageCompressor from "./pages/ImageCompressor";
import DeviceInfo from "./pages/DeviceInfo";
import CodeBeautifier from "./pages/CodeBeautifier";
import LinkShortener from "./pages/LinkShortener";
import CryptoPrices from "./pages/CryptoPrices";
import NewsFeed from "./pages/NewsFeed";
import IPLookup from "./pages/IPLookup";
import RGBtoHEX from "./pages/RGBtoHEX";
import ChartGenerator from "./pages/ChartGenerator";
import YouTubeDownloader from "./pages/YouTubeDownloader";
import FileConverter from "./pages/FileConverter";
import AudioConverter from "./pages/AudioConverter";
import IsomerDiagrams from "./pages/IsomerDiagrams";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/text-counter" element={<TextCounter />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/base64-encoder" element={<Base64Encoder />} />
          <Route path="/email-validator" element={<EmailValidator />} />
          <Route path="/uuid-generator" element={<UUIDGenerator />} />
          <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="/world-clock" element={<WorldClock />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/weather-forecast" element={<WeatherForecast />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/device-info" element={<DeviceInfo />} />
          <Route path="/code-beautifier" element={<CodeBeautifier />} />
          <Route path="/link-shortener" element={<LinkShortener />} />
          <Route path="/crypto-prices" element={<CryptoPrices />} />
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/ip-lookup" element={<IPLookup />} />
          <Route path="/rgb-to-hex" element={<RGBtoHEX />} />
          <Route path="/chart-generator" element={<ChartGenerator />} />
          <Route path="/youtube-downloader" element={<YouTubeDownloader />} />
          <Route path="/file-converter" element={<FileConverter />} />
          <Route path="/audio-converter" element={<AudioConverter />} />
          <Route path="/isomer-diagrams" element={<IsomerDiagrams />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
