import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Award } from "lucide-react";

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
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold">Our Mission</h2>
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
              <Card className="p-8 glass-card">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <Card className="p-8 glass-card">
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
              <h2 className="text-4xl font-bold">Our Vision</h2>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-lg transition-all text-center">
                  <value.icon className="h-12 w-12 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h2 className="text-4xl font-bold">Why Trust MatrimonyHub?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 10,000 successful marriages and counting, MatrimonyHub has established itself as a leader 
              in the matrimony industry. Our commitment to verification, privacy, and genuine connections sets us apart.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
                <div className="text-muted-foreground">Happy Marriages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">50,000+</div>
                <div className="text-muted-foreground">Verified Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">99%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
