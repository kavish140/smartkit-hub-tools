import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, memo } from "react";

const Hero = () => {
  const scrollToTools = useCallback(() => {
    const toolsSection = document.getElementById('tools');
    toolsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-12 md:py-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Your Productivity Companion</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            All Your Smart Tools
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              in One Place
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-3 max-w-2xl mx-auto">
            Access 30+ powerful utilities, converters, generators, and productivity tools 
            designed to make your daily tasks effortless and efficient.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-6 text-sm">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-3 py-1.5 rounded-full border border-border">
              <span className="text-green-500">✓</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
              <span className="text-green-500">✓</span>
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
              <span className="text-green-500">✓</span>
              <span>Privacy First</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary border-0 shadow-glow" onClick={scrollToTools}>
              Explore Tools
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToAbout}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
