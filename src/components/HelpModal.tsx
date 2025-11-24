import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Keyboard, Star, Clock, Search } from "lucide-react";

const HelpModal = memo(() => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Use SmartKit.tech</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Focus search</span>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border">K</kbd>
                  <span className="text-muted-foreground">or</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border">/</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Clear search</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Features
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <strong>Favorites:</strong> Click the star icon on any tool card to save it to your favorites for quick access.
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <strong>Recent Tools:</strong> Your last 5 used tools are automatically tracked and displayed for quick access.
                </div>
              </div>
              <div className="flex gap-3">
                <Search className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <strong>Smart Search:</strong> Search by tool name, description, or category. Use filters to narrow down results.
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-200">
              🔒 Your Privacy Matters
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              All tools process data locally in your browser. We don't collect, store, or transmit your data to any servers. 
              Your favorites and recent tools are stored only in your browser's local storage.
            </p>
          </div>

          {/* Tips */}
          <div>
            <h3 className="font-semibold text-lg mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              <li>Bookmark frequently used tools for instant access</li>
              <li>Use the category filter to quickly find related tools</li>
              <li>Most tools work offline after the first load</li>
              <li>Try the dark mode toggle for comfortable viewing</li>
              <li>Share tool links with colleagues for easy collaboration</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

HelpModal.displayName = 'HelpModal';

export default HelpModal;
