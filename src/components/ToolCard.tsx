import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ToolCard = memo(({ title, description, icon: Icon, category, onClick, isFavorite, onToggleFavorite }: ToolCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-3 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              {category}
            </span>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star 
                  className={`h-4 w-4 transition-all ${isFavorite ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-muted-foreground'}`} 
                />
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="ghost" 
          className="w-full justify-between group/btn"
          onClick={onClick}
        >
          Open Tool
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
});

ToolCard.displayName = 'ToolCard';

export default ToolCard;
