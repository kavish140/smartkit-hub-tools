import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools');
    toolsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SmartKit.tech
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-foreground/70 hover:text-foreground transition-colors">
              Tools
            </a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="default" className="bg-gradient-primary border-0" onClick={scrollToTools}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
