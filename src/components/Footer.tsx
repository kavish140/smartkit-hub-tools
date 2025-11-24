import { Code2, Mail, Github, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, memo } from "react";

const Footer = () => {
  const navigate = useNavigate();
  
  const navigateToAbout = useCallback(() => navigate('/about'), [navigate]);
  const navigateToPrivacy = useCallback(() => navigate('/privacy-policy'), [navigate]);
  const navigateToTerms = useCallback(() => navigate('/terms'), [navigate]);
  const navigateToContact = useCallback(() => navigate('/contact'), [navigate]);
  
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SmartKit.tech</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your all-in-one productivity toolkit. Simplifying daily tasks with powerful, 
              easy-to-use web utilities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <span>•</span>
                  <span>Browse All Tools</span>
                </a>
              </li>
              <li>
                <button onClick={navigateToAbout} className="text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2">
                  <span>•</span>
                  <span>About SmartKit</span>
                </button>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <span>•</span>
                  <span>Get Support</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={navigateToPrivacy}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToTerms}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={navigateToContact}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} SmartKit.tech. All rights reserved.</p>
          <p className="text-xs">
            Made with ❤️ for productivity enthusiasts • All tools are free and always will be
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
