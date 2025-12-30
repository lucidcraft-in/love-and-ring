import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import partnershipIllustration from "@/assets/partnership-illustration.png";

const ClientRegistrationCTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 border border-border rounded-2xl p-8 sm:p-12 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5 sm:space-y-6 text-center lg:text-left"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Become a Matchmaking Partner
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join our trusted network of matchmaking professionals who help families 
              and individuals find meaningful connections for marriage. As a partner, 
              you'll play a vital role in building lasting relationships based on trust, 
              respect, and shared values.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We value responsibility and relationship-building at the heart of what we do. 
              Partner with Love & Ring to make a positive impact in people's lives while 
              being part of a premium, respected platform.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-sm sm:text-base px-6 sm:px-8"
              >
                <Link to="/client-terms">Know More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end order-first lg:order-last"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
              <img
                src={partnershipIllustration}
                alt="Partnership illustration"
                className="relative w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientRegistrationCTA;
