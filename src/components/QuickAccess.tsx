import { Star, Clock, ChevronDown } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState, useMemo, useCallback, memo } from "react";

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
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const favoriteToolsData = useMemo(() => toolsData.filter(tool => favorites.includes(tool.title)), [favorites]);
  const recentToolsData = useMemo(() => recentTools
    .map(recent => toolsData.find(tool => tool.title === recent.title))
    .filter(Boolean)
    .slice(0, 5), [recentTools]);

  const handleNavigate = useCallback((path: string) => navigate(path), [navigate]);

  if (favoriteToolsData.length === 0 && recentToolsData.length === 0) {
    return (
      <section className="py-12 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-2">
                💡 <strong>Quick Tip:</strong> Click the star icon on any tool to add it to your favorites for quick access!
              </p>
              <p className="text-sm text-muted-foreground">
                Your recently used tools will also appear here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Favorites */}
          {favoriteToolsData.length > 0 && (
            <Card className="border-primary/20 bg-card/80 backdrop-blur">
              <Collapsible open={favoritesOpen} onOpenChange={setFavoritesOpen}>
                <CardContent className="pt-6">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-2 h-auto mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <h3 className="text-lg font-semibold">Your Favorites</h3>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${favoritesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2">
                      {favoriteToolsData.map(tool => (
                        <Button
                          key={tool.title}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigate(tool.path)}
                        >
                          {tool.title}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          )}

          {/* Recent Tools */}
          {recentToolsData.length > 0 && (
            <Card className="border-primary/20 bg-card/80 backdrop-blur">
              <Collapsible open={recentOpen} onOpenChange={setRecentOpen}>
                <CardContent className="pt-6">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-2 h-auto mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">Recently Used</h3>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${recentOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2">
                      {recentToolsData.map(tool => tool && (
                        <Button
                          key={tool.title}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigate(tool.path)}
                        >
                          {tool.title}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Collapsible>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(QuickAccess);
