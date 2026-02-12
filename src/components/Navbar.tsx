import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ringLogo from "@/assets/ring-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hero routes get special transparent/blur treatment
  const heroRoutes = ["/", "/login", "/register", "/client-terms", "/client-registration", "/about", "/success-stories", "/pricing", "/contact"];
  const isHeroRoute = heroRoutes.includes(location.pathname);

  // Detect scroll position for hero-aware navbar
  useEffect(() => {
    const handleScroll = () => {
      if (isHeroRoute) {
        const heroSection = document.getElementById("hero-section");
        if (heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          setIsScrolled(window.scrollY > heroBottom - 80);
        } else {
          // If no hero section found, consider scrolled after 100px
          setIsScrolled(window.scrollY > 100);
        }
      } else {
        // Non-hero routes are always "scrolled" (solid background)
        setIsScrolled(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHeroRoute, location.pathname]);

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

  // Determine if we should show hero-style navbar
  const showHeroStyle = isHeroRoute && !isScrolled;

  // Dynamic styles based on route and scroll state
  const navbarBg = showHeroStyle
    ? "bg-black/40 backdrop-blur-[6px] border-b border-white/10"
    : "bg-background border-b border-border shadow-sm";

  // Text styles for nav links
  const navLinkClass = showHeroStyle
    ? "text-white hover:text-white/80 transition-colors duration-300 font-medium text-sm xl:text-base drop-shadow-sm"
    : "text-foreground hover:text-primary transition-colors duration-300 font-medium text-sm xl:text-base";

  // Logo text styles
  const logoTextClass = showHeroStyle
    ? "text-white drop-shadow-md"
    : "gradient-text";

  // Auth button styles (pill-style)
  const authButtonClass = showHeroStyle
    ? "rounded-full px-5 shadow-md bg-black/30 backdrop-blur-sm text-white border border-white/20 hover:bg-black/40 transition-all duration-300"
    : "rounded-full px-5 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navbarBg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - always use ring logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={ringLogo} 
              alt="Love & Ring" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
            />
            <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${logoTextClass}`}>
              Love & Ring
            </span>
          </Link>

          {/* Desktop Navigation - plain text links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={navLinkClass}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons - pill-style only */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="secondary"
                onClick={handleLogout} 
                className={`gap-2 ${authButtonClass}`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="secondary"
                asChild
                className={authButtonClass}
              >
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${showHeroStyle ? "text-white" : "text-foreground"}`}
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
              className={`lg:hidden pb-4 ${showHeroStyle ? "bg-black/60 backdrop-blur-md -mx-4 px-4 rounded-b-lg" : ""}`}
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-300 py-2 ${
                      showHeroStyle 
                        ? "text-white hover:text-white/80" 
                        : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className={`flex flex-col space-y-2 pt-4 border-t ${showHeroStyle ? "border-white/20" : "border-border"}`}>
                  {isAuthenticated ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className={`gap-2 justify-start rounded-full ${
                        showHeroStyle 
                          ? "text-white bg-black/30 border border-white/20 hover:bg-black/40" 
                          : ""
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      asChild
                      className={`rounded-full ${
                        showHeroStyle 
                          ? "text-white bg-black/30 border border-white/20 hover:bg-black/40" 
                          : ""
                      }`}
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
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
