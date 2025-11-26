import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, Lock, CheckCircle, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import heroImage from "@/assets/hero-bg.jpg";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";

const Home = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      default:
        return <StepOne />;
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with industry-leading security measures",
    },
    {
      icon: Users,
      title: "Verified Profiles",
      description: "Every profile is manually verified to ensure authenticity",
    },
    {
      icon: Lock,
      title: "Privacy Control",
      description: "Complete control over who can view your profile and contact details",
    },
    {
      icon: CheckCircle,
      title: "Advanced Matching",
      description: "Smart algorithms to find your most compatible matches",
    },
  ];

  const successStories = [
    {
      names: "Rahul & Priya",
      image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=400&fit=crop",
      story: "We found each other on MatrimonyHub and it's been a beautiful journey ever since.",
      date: "Married: June 2024",
      location: "Mumbai, India",
    },
    {
      names: "Amit & Sneha",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
      story: "Thanks to MatrimonyHub, we found our perfect match. Couldn't be happier!",
      date: "Married: March 2024",
      location: "Delhi, India",
    },
    {
      names: "Vikram & Anjali",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop",
      story: "From first message to forever, MatrimonyHub made our dream come true.",
      date: "Married: January 2024",
      location: "Bangalore, India",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatePresence mode="wait">
            {!showRegistration ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto text-center space-y-8"
              >
                <h1 className="text-5xl md:text-7xl font-bold">
                  Find Your <span className="gradient-text">Perfect Match</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Join thousands of happy couples who found their life partner through our trusted matrimony platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setShowRegistration(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8"
                  >
                    Register Now
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/browse">Browse Profiles</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="registration"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Create Your <span className="gradient-text">Profile</span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Step {currentStep} of {totalSteps}: Complete your registration
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>Basic Details</span>
                    <span>Basic Info</span>
                    <span>Personal</span>
                    <span>Education</span>
                    <span>Additional</span>
                  </div>
                </div>

                {/* Form Card */}
                <Card className="p-8 glass-card">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <Button
                      onClick={nextStep}
                      disabled={currentStep === totalSteps}
                      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      {currentStep === totalSteps ? "Submit" : "Continue"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowRegistration(false);
                      setCurrentStep(1);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Home
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative floating elements */}
        {!showRegistration && (
          <>
            <div className="absolute top-20 left-10 opacity-20">
              <Heart className="h-16 w-16 text-primary animate-float" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-20">
              <Star className="h-20 w-20 text-secondary animate-float" style={{ animationDelay: "1s" }} />
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose MatrimonyHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide a secure, trusted platform to help you find your perfect life partner
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-lg transition-all">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real couples, real happiness - read their inspiring journeys
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden glass-card hover:shadow-xl transition-all">
                  <img
                    src={story.image}
                    alt={story.names}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-semibold gradient-text">{story.names}</h3>
                    <p className="text-muted-foreground italic">"{story.story}"</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{story.date}</p>
                      <p>{story.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/success-stories">View All Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">About MatrimonyHub</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                MatrimonyHub is a trusted matrimony platform dedicated to helping individuals find their perfect life partner. 
                With years of experience and thousands of success stories, we understand the importance of finding someone who 
                shares your values, culture, and aspirations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform combines advanced technology with personalized service to ensure you have the best experience 
                in your search for a life partner. Every profile is verified, and your privacy is our top priority.
              </p>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Find Your Match?</h2>
            <p className="text-xl opacity-90">
              Create your profile in just a few minutes and start your journey to find your perfect life partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              >
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
