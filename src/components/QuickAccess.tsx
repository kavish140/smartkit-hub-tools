import { Star, Clock } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Import the tools array (we'll need to export it from ToolsGrid)
const toolsData = [
  { title: "Calculator", path: "/calculator" },
  { title: "Unit Converter", path: "/unit-converter" },
  { title: "QR Code Generator", path: "/qr-generator" },
  { title: "Password Generator", path: "/password-generator" },
  { title: "Age Calculator", path: "/age-calculator" },
  { title: "Text Counter", path: "/text-counter" },
  { title: "Color Picker", path: "/color-picker" },
  { title: "Hash Generator", path: "/hash-generator" },
  { title: "JSON Formatter", path: "/json-formatter" },
  { title: "Base64 Encoder", path: "/base64-encoder" },
  { title: "Email Validator", path: "/email-validator" },
  { title: "UUID Generator", path: "/uuid-generator" },
  { title: "Link Shortener", path: "/link-shortener" },
  { title: "GPA Calculator", path: "/gpa-calculator" },
  { title: "Pomodoro Timer", path: "/pomodoro-timer" },
  { title: "Weather Forecast", path: "/weather-forecast" },
  { title: "Crypto Prices", path: "/crypto-prices" },
  { title: "News Feed", path: "/news-feed" },
  { title: "Image Compressor", path: "/image-compressor" },
  { title: "IP Lookup", path: "/ip-lookup" },
  { title: "World Clock", path: "/world-clock" },
  { title: "Currency Converter", path: "/currency-converter" },
  { title: "RGB to HEX", path: "/rgb-to-hex" },
  { title: "Device Info", path: "/device-info" },
  { title: "Code Beautifier", path: "/code-beautifier" },
  { title: "Chart Generator", path: "/chart-generator" },
  { title: "YouTube Downloader", path: "/youtube-downloader" },
  { title: "Audio Converter", path: "/audio-converter" },
  { title: "File Converter", path: "/file-converter" },
  { title: "Isomer Diagrams", path: "/isomer-diagrams" },
];

const QuickAccess = () => {
  const { favorites } = useFavorites();
  const { recentTools } = useRecentTools();
  const navigate = useNavigate();

  const favoriteToolsData = toolsData.filter(tool => favorites.includes(tool.title));
  const recentToolsData = recentTools
    .map(recent => toolsData.find(tool => tool.title === recent.title))
    .filter(Boolean)
    .slice(0, 5);

  if (favoriteToolsData.length === 0 && recentToolsData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Favorites */}
          {favoriteToolsData.length > 0 && (
            <Card className="border-primary/20 bg-card/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-lg font-semibold">Your Favorites</h3>
                </div>
                <div className="space-y-2">
                  {favoriteToolsData.map(tool => (
                    <Button
                      key={tool.title}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(tool.path)}
                    >
                      {tool.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Tools */}
          {recentToolsData.length > 0 && (
            <Card className="border-primary/20 bg-card/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Recently Used</h3>
                </div>
                <div className="space-y-2">
                  {recentToolsData.map(tool => tool && (
                    <Button
                      key={tool.title}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(tool.path)}
                    >
                      {tool.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
