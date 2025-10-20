import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb, Keyboard, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Step {
  title: string;
  description: string;
}

interface Tip {
  text: string;
}

interface Shortcut {
  keys: string;
  action: string;
}

interface HowToUseProps {
  steps: Step[];
  tips?: Tip[];
  shortcuts?: Shortcut[];
}

const HowToUse: React.FC<HowToUseProps> = ({ steps, tips, shortcuts }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">How to Use</CardTitle>
                <Badge variant="secondary" className="text-xs">Guide</Badge>
              </div>
              <ChevronDown 
                className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </span>
                Steps
              </h4>
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            {shortcuts && shortcuts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-blue-500" />
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default HowToUse;
