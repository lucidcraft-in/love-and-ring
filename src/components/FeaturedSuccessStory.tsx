import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AthiraandVishih from "@/assets/Athiraandvishish.jpg";
import AibnandBasil from "@/assets/aibnaandbasil.jpg";


interface SuccessStory {
  names: string;
  images: string[];
  story: string;
  date: string;
  fullStory: string;
}

interface FeaturedSuccessStoryProps {
  stories: SuccessStory[];
}

const FeaturedSuccessStory = ({ stories }: FeaturedSuccessStoryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeStory = stories[activeIndex];

  const scrollPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [stories.length]);

  const scrollNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  const scrollTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  return (
    <div 
      className="w-full"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Featured Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8  items-stretch lg:h-[500px] border border-border rounded-2xl p-6 lg:p-8">
        {/* Left - Featured Image */}
        <div className="relative h-[320px] sm:h-[340px] lg:h-[430px]">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={activeStory.images[0]}
                alt={activeStory.names}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>
            
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Right - Testimonial Content */}
        <div className="flex flex-col justify-center space-y-3 lg:space-y-4 py-1 lg:py-2">
          {/* Quote Icon */}
          <div className="hidden sm:block">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Quote className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
            </div>
          </div>

          {/* Testimonial Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-3 lg:space-y-4"
            >
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-normal italic">
                "{activeStory.fullStory}"
              </p>

              {/* Read More Link */}
              <Link 
                to="/success-stories" 
                className="inline-flex items-center text-primary font-medium hover:underline text-sm sm:text-base group"
              >
                Read More
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Couple Name and Date */}
              <div className="pt-3 lg:pt-4 border-t border-border/50">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">
                  {activeStory.names}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {activeStory.date}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mt-6 lg:mt-8 ">
        <div className="flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-all hover:scale-105"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Thumbnail Images */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide py-2 pl-2 pr-2">
            {stories.map((story, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-15 lg:h-15 rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300",
                  activeIndex === index
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                )}
                aria-label={`View ${story.names}'s story`}
              >
                <img
                  src={story.images[0]}
                  alt={story.names}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-all hover:scale-105"
            aria-label="Next story"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSuccessStory;
