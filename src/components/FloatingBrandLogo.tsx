import { motion } from "framer-motion";
import ringLogo from "@/assets/ring-logo.png";

interface FloatingBrandLogoProps {
  className?: string;
  /** 
   * Variant for different page contexts:
   * - "hero": Two floating logos (top-left + bottom-right) for Home page
   * - "auth": Single subtle logo in bottom-right above WhatsApp for auth pages
   */
  variant?: "hero" | "auth";
}

/**
 * Floating brand logo component for hero sections.
 * Displays subtle, animated brand logos with glow effects.
 * Respects reduced-motion user preferences.
 */
const FloatingBrandLogo = ({ className = "", variant = "hero" }: FloatingBrandLogoProps) => {
  // CSS filter to convert purple logo to light lavender/white
  const lightLogoFilter = "brightness(0) invert(1) sepia(1) saturate(0.3) hue-rotate(200deg) brightness(1.5)";
  
  // Auth variant: single subtle logo in bottom-right, above WhatsApp button
  if (variant === "auth") {
    return (
      <div className={`pointer-events-none select-none ${className}`}>
        <motion.div
          className="absolute bottom-32 right-4 sm:right-6 opacity-40 sm:opacity-45"
          initial={{ y: 0 }}
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: `${lightLogoFilter} drop-shadow(0 0 20px hsl(270 65% 70% / 0.4))`,
          }}
        >
          <img
            src={ringLogo}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 sm:h-14 sm:w-14 object-contain motion-reduce:animate-none"
          />
        </motion.div>
      </div>
    );
  }

  // Hero variant: two floating logos for Home page
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* Top-left floating logo */}
      <motion.div
        className="absolute top-24 left-4 sm:left-10 opacity-20 sm:opacity-25"
        initial={{ y: 0 }}
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: `${lightLogoFilter} drop-shadow(0 0 30px hsl(270 65% 70% / 0.6)) drop-shadow(0 0 60px hsl(270 65% 70% / 0.3))`,
        }}
      >
        <img
          src={ringLogo}
          alt=""
          aria-hidden="true"
          className="h-12 w-12 sm:h-20 sm:w-20 object-contain motion-reduce:animate-none"
        />
      </motion.div>

      {/* Bottom-right floating logo */}
      <motion.div
        className="absolute bottom-24 right-4 sm:right-10 opacity-15 sm:opacity-20"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        style={{
          filter: `${lightLogoFilter} drop-shadow(0 0 35px hsl(220 70% 75% / 0.5)) drop-shadow(0 0 70px hsl(270 65% 70% / 0.25))`,
        }}
      >
        <img
          src={ringLogo}
          alt=""
          aria-hidden="true"
          className="h-14 w-14 sm:h-24 sm:w-24 object-contain motion-reduce:animate-none"
        />
      </motion.div>
    </div>
  );
};

export default FloatingBrandLogo;
