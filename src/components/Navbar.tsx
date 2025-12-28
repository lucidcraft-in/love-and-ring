import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import coupleLogo from "@/assets/couple-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Detect scroll position for hero-aware navbar
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection && isHomePage) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsScrolled(window.scrollY > heroBottom - 80);
      } else {
        setIsScrolled(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Dynamic styles based on scroll state
  const navbarBg = isScrolled || !isHomePage
    ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
    : "bg-transparent backdrop-blur-sm";

  const textColor = isScrolled || !isHomePage
    ? "text-foreground"
    : "text-white";

  const logoTextClass = isScrolled || !isHomePage
    ? "gradient-text"
    : "text-white drop-shadow-md";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navbarBg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={coupleLogo} alt="Love & Ring" className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-md" />
            <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${logoTextClass}`}>Love & Ring</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${textColor} hover:text-primary transition-colors duration-300 font-medium text-sm xl:text-base drop-shadow-sm`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant={isScrolled || !isHomePage ? "ghost" : "outline"} 
                onClick={handleLogout} 
                className={`gap-2 transition-colors duration-300 ${!isScrolled && isHomePage ? "text-white border-white/30 hover:bg-white/10" : ""}`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                variant={isScrolled || !isHomePage ? "ghost" : "outline"} 
                asChild
                className={`transition-colors duration-300 ${!isScrolled && isHomePage ? "text-white border-white/30 hover:bg-white/10" : ""}`}
              >
                <Link to="/">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${textColor}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden pb-4 ${!isScrolled && isHomePage ? "bg-black/50 backdrop-blur-md -mx-4 px-4 rounded-b-lg" : ""}`}
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${textColor} hover:text-primary transition-colors duration-300 font-medium`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className={`flex flex-col space-y-2 pt-4 border-t ${!isScrolled && isHomePage ? "border-white/20" : "border-border"}`}>
                  {isAuthenticated ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className={`gap-2 justify-start ${!isScrolled && isHomePage ? "text-white hover:bg-white/10" : ""}`}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      asChild
                      className={`${!isScrolled && isHomePage ? "text-white hover:bg-white/10" : ""}`}
                    >
                      <Link to="/" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
