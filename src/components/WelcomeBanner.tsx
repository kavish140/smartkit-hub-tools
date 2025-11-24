import { memo, useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeBanner = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-primary text-primary-foreground py-3 px-4 relative animate-slide-down">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Welcome to SmartKit.tech!</strong> 
            <span className="hidden sm:inline"> Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs mx-1">Ctrl+K</kbd> or <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs mx-1">/</kbd> to quickly search tools.</span>
            <span className="sm:hidden"> Tap the star to save favorites!</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-primary-foreground hover:bg-white/10 h-8 w-8 p-0"
          aria-label="Dismiss welcome message"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

WelcomeBanner.displayName = 'WelcomeBanner';

export default WelcomeBanner;
