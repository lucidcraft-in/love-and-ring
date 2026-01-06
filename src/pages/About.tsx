import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Award } from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize your safety with verified profiles and secure data handling",
    },
    {
      icon: Heart,
      title: "Genuine Profiles",
      description: "Helping people find meaningful relationships based on shared values",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a community that is welcoming, supportive and spreading human spirit",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to bring best match finding experience ",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        
        {/* Floating Brand Logo */}
        <FloatingBrandLogo variant="hero" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              About <span className="gradient-text">Love & Ring</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your trusted partner in finding the perfect life match
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Love & Ring, our mission is to help individuals find their perfect life partner through a secure, 
                trustworthy, and culturally sensitive platform. We believe that every person deserves to find true love 
                and companionship.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We combine cutting-edge technology with traditional values to create meaningful connections that last a lifetime.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Happy couple"
                  className="w-full rounded-lg"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <Card className="p-4 glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop"
                  alt="Vision"
                  className="w-full rounded-lg"
                />
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-4xl font-bold text-foreground">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a world where finding your life partner is a joyful, secure, and empowering experience. 
                Through innovation and empathy, we strive to be the most trusted matrimony platform globally.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our vision is to create millions of happy marriages by connecting compatible individuals from diverse 
                backgrounds while respecting cultural traditions and modern values.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full glass-card shadow-md hover:shadow-lg transition-all duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl font-bold text-foreground">Why Trust Love & Ring?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 10,000 successful marriages and counting, Love & Ring has established itself as a leader 
              in the matrimony industry. Our commitment to verification, privacy, and genuine connections sets us apart.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8">
              <Card className="p-6 glass-card text-center shadow-md">
                <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
                <div className="text-muted-foreground font-medium">Happy Marriages</div>
              </Card>
              <Card className="p-6 glass-card text-center shadow-md">
                <div className="text-4xl font-bold gradient-text mb-2">50,000+</div>
                <div className="text-muted-foreground font-medium">Verified Profiles</div>
              </Card>
              <Card className="p-6 glass-card text-center shadow-md">
                <div className="text-4xl font-bold gradient-text mb-2">99%</div>
                <div className="text-muted-foreground font-medium">Satisfaction Rate</div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
