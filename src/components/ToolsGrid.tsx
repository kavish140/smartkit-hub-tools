import { 
  Calculator, 
  Ruler, 
  QrCode, 
  Link, 
  GraduationCap, 
  Timer, 
  Key, 
  Cloud, 
  TrendingUp, 
  Newspaper,
  Calendar,
  FileText,
  Palette,
  Image as ImageIcon,
  Hash,
  Globe,
  Music,
  Video,
  Download,
  FileJson,
  Binary,
  Clock,
  DollarSign,
  Lightbulb,
  Search,
  Mail,
  Smartphone,
  Code2,
  BarChart3,
  Atom
} from "lucide-react";
import ToolCard from "./ToolCard";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useState } from "react";

const tools = [
  {
    title: "Calculator",
    description: "Powerful scientific calculator for complex computations",
    icon: Calculator,
    category: "Math",
    path: "/calculator"
  },
  {
    title: "Unit Converter",
    description: "Convert between various units of measurement",
    icon: Ruler,
    category: "Converter",
    path: "/unit-converter"
  },
  {
    title: "QR Code Generator",
    description: "Create custom QR codes for URLs, text, and more",
    icon: QrCode,
    category: "Generator",
    path: "/qr-generator"
  },
  {
    title: "Password Generator",
    description: "Generate secure random passwords instantly",
    icon: Key,
    category: "Security",
    path: "/password-generator"
  },
  {
    title: "Age Calculator",
    description: "Calculate age and time differences precisely",
    icon: Calendar,
    category: "Math",
    path: "/age-calculator"
  },
  {
    title: "Text Counter",
    description: "Count words, characters, and analyze text",
    icon: FileText,
    category: "Utility",
    path: "/text-counter"
  },
  {
    title: "Color Picker",
    description: "Pick and convert colors across formats",
    icon: Palette,
    category: "Design",
    path: "/color-picker"
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes",
    icon: Hash,
    category: "Security",
    path: "/hash-generator"
  },
  {
    title: "JSON Formatter",
    description: "Format and validate JSON data beautifully",
    icon: FileJson,
    category: "Developer",
    path: "/json-formatter"
  },
  {
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings",
    icon: Binary,
    category: "Developer",
    path: "/base64-encoder"
  },
  {
    title: "Email Validator",
    description: "Validate email addresses and check format",
    icon: Mail,
    category: "Utility",
    path: "/email-validator"
  },
  {
    title: "UUID Generator",
    description: "Generate unique identifiers (UUIDs)",
    icon: Search,
    category: "Developer",
    path: "/uuid-generator"
  },
  {
    title: "Link Shortener",
    description: "Shorten long URLs into compact, shareable links",
    icon: Link,
    category: "Utility",
    path: "/link-shortener"
  },
  {
    title: "GPA Calculator",
    description: "Calculate your GPA and track academic performance",
    icon: GraduationCap,
    category: "Education",
    path: "/gpa-calculator"
  },
  {
    title: "Pomodoro Timer",
    description: "Boost productivity with focused work sessions",
    icon: Timer,
    category: "Productivity",
    path: "/pomodoro-timer"
  },
  {
    title: "Weather Forecast",
    description: "Real-time weather data for any location",
    icon: Cloud,
    category: "API Tool",
    path: "/weather-forecast"
  },
  {
    title: "Crypto Prices",
    description: "Track live cryptocurrency prices and trends",
    icon: TrendingUp,
    category: "API Tool",
    path: "/crypto-prices"
  },
  {
    title: "News Feed",
    description: "Get the latest news from various sources",
    icon: Newspaper,
    category: "API Tool",
    path: "/news-feed"
  },
  {
    title: "Image Compressor",
    description: "Reduce image file sizes without quality loss",
    icon: ImageIcon,
    category: "Utility",
    path: "/image-compressor"
  },
  {
    title: "IP Lookup",
    description: "Find geolocation info for any IP address",
    icon: Globe,
    category: "Network",
    path: "/ip-lookup"
  },
  {
    title: "World Clock",
    description: "View time across different time zones",
    icon: Clock,
    category: "Utility",
    path: "/world-clock"
  },
  {
    title: "Currency Converter",
    description: "Convert between world currencies with live rates",
    icon: DollarSign,
    category: "Converter",
    path: "/currency-converter"
  },
  {
    title: "RGB to HEX",
    description: "Convert RGB colors to HEX and vice versa",
    icon: Lightbulb,
    category: "Design",
    path: "/rgb-to-hex"
  },
  {
    title: "Device Info",
    description: "Detect browser and device information",
    icon: Smartphone,
    category: "Network",
    path: "/device-info"
  },
  {
    title: "Code Beautifier",
    description: "Format HTML, CSS, and JavaScript code",
    icon: Code2,
    category: "Developer",
    path: "/code-beautifier"
  },
  {
    title: "Chart Generator",
    description: "Create beautiful charts from your data",
    icon: BarChart3,
    category: "Productivity",
    path: "/chart-generator"
  },
  {
    title: "YouTube Downloader",
    description: "Download YouTube videos in various formats",
    icon: Video,
    category: "Media",
    path: "/youtube-downloader"
  },
  {
    title: "Audio Converter",
    description: "Convert audio files between formats",
    icon: Music,
    category: "Media",
    path: "/audio-converter"
  },
  {
    title: "File Converter",
    description: "Convert files between different formats",
    icon: Download,
    category: "Utility",
    path: "/file-converter"
  },
  {
    title: "Isomer Diagrams",
    description: "Generate hydrocarbon isomer structures",
    icon: Atom,
    category: "Education",
    path: "/isomer-diagrams"
  }
];

const ToolsGrid = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleToolClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="bg-gradient-primary bg-clip-text text-transparent">Smart Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover a comprehensive collection of utilities designed to simplify your workflow
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-primary/20 focus:border-primary shadow-elegant"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <div key={tool.title} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ToolCard {...tool} onClick={() => handleToolClick(tool.path)} />
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolsGrid;
