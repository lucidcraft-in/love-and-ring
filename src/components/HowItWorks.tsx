import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, MessageCircleHeart } from "lucide-react";

// Import step images
import stepImage1 from "@/assets/how-it-works-step1.png";
import stepImage2 from "@/assets/how-it-works-step2.png";
import stepImage3 from "@/assets/how-it-works-step3.png";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and build your detailed profile with photos, preferences, and personal details to showcase who you are.",
    icon: UserPlus,
    image: stepImage1,
  },
  {
    number: "02",
    title: "Find Your Match",
    description: "Browse verified profiles and use our smart matching algorithm to discover compatible partners tailored to your preferences.",
    icon: Search,
    image: stepImage2,
  },
  {
    number: "03",
    title: "Connect Securely",
    description: "Express interest, chat securely, and take the first step towards building a meaningful relationship with complete privacy.",
    icon: MessageCircleHeart,
    image: stepImage3,
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate steps every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            How Love & Ring Works
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find your perfect match in three simple steps
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Steps (Mobile: accordion style with embedded images) */}
          <div 
            className="lg:col-span-5 space-y-3 md:space-y-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleStepClick(index)}
                  className={`
                    relative rounded-2xl cursor-pointer transition-all duration-300
                    ${isActive 
                      ? "bg-card shadow-lg border border-primary/20" 
                      : "bg-card/50 md:bg-transparent md:hover:bg-card/50"
                    }
                  `}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-6 md:top-1/2 md:-translate-y-1/2 w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className={`p-4 md:p-6 ${isActive ? '' : 'py-3 md:py-6'}`}>
                    <div className="flex items-start gap-4">
                      {/* Number Badge */}
                      <div 
                        className={`
                          flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-base md:text-lg
                          transition-all duration-300
                          ${isActive 
                            ? "bg-gradient-to-br from-primary to-secondary text-white shadow-md" 
                            : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {step.number}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon 
                            className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`} 
                          />
                          <h3 
                            className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                              isActive ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>
                        </div>
                        {/* Description - hidden on mobile for inactive steps */}
                        <motion.p 
                          initial={false}
                          animate={{ 
                            opacity: isActive ? 1 : 0.7,
                            height: isActive ? 'auto' : 0
                          }}
                          className={`text-sm leading-relaxed transition-colors duration-300 overflow-hidden md:!h-auto md:!opacity-70 ${
                            isActive 
                              ? "text-muted-foreground" 
                              : "text-muted-foreground/70"
                          }`}
                        >
                          {step.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Mobile: Embedded image inside active card */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="md:hidden mt-4 overflow-hidden"
                        >
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-auto max-h-[280px] object-contain rounded-xl"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Progress bar for active step */}
                  {isActive && !isPaused && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-2xl">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        key={activeStep}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Side - Images (Hidden on mobile, visible on tablet+) */}
          <div className="hidden md:block lg:col-span-7">
            <div 
              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Image Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    className="w-full h-[380px] object-cover object-center rounded-3xl mt-10"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Step indicator dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${activeStep === index 
                        ? "bg-white w-6" 
                        : "bg-white/50 hover:bg-white/70"
                      }
                    `}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
