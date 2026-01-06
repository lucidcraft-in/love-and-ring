import { motion } from "framer-motion";
import ringLogo from "@/assets/ring-logo.png";

interface FloatingBrandLogoProps {
  className?: string;
}

/**
 * Floating brand logo component for hero sections.
 * Displays subtle, animated brand logos with glow effects.
 * Respects reduced-motion user preferences.
 */
const FloatingBrandLogo = ({ className = "" }: FloatingBrandLogoProps) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* Top-left floating logo */}
      <motion.div
        className="absolute top-24 left-4 sm:left-10 opacity-10 sm:opacity-15"
        initial={{ y: 0 }}
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(0 0 20px hsl(270 65% 70% / 0.4))",
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
        className="absolute bottom-24 right-4 sm:right-10 opacity-10 sm:opacity-[0.12]"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        style={{
          filter: "drop-shadow(0 0 25px hsl(220 70% 65% / 0.5))",
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
