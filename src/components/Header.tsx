import { Code2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const handleAuth = () => {
    if (userEmail) {
      // If logged in, show profile or logout
      const confirmLogout = window.confirm("Do you want to sign out?");
      if (confirmLogout) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        setUserEmail(null);
      }
    } else {
      // Navigate to auth page
      navigate('/auth');
    }
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
            <a href="/#tools" className="text-foreground/70 hover:text-foreground transition-colors">
              Tools
            </a>
            <a href="/#about" className="text-foreground/70 hover:text-foreground transition-colors">
              About
            </a>
            <a href="/#contact" className="text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          <Button 
            variant="default" 
            className="bg-gradient-primary border-0"
            onClick={handleAuth}
          >
            {userEmail ? (
              <>
                <User className="h-4 w-4 mr-2" />
                {userEmail.split('@')[0]}
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
