import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  onClick?: () => void;
}

const ToolCard = ({ title, description, icon: Icon, category, onClick }: ToolCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-3 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {category}
          </span>
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
};

export default ToolCard;
