import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import SuccessStoryCarousel from "@/components/SuccessStoryCarousel";

const SuccessStories = () => {
  const stories = [
    {
      names: "Rahul & Priya",
      images: [
        "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop",
      ],
      story: "We found each other on MatrimonyHub and it's been a beautiful journey ever since. From the first conversation, we knew there was something special. The platform made it so easy to connect and understand each other.",
      date: "Married: June 2024",
      location: "Mumbai, India",
    },
    {
      names: "Amit & Sneha",
      images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"],
      story: "Thanks to MatrimonyHub, we found our perfect match. Couldn't be happier! The advanced matching algorithm really understood what we were looking for in a life partner.",
      date: "Married: March 2024",
      location: "Delhi, India",
    },
    {
      names: "Vikram & Anjali",
      images: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop"],
      story: "From first message to forever, MatrimonyHub made our dream come true. We appreciate the privacy controls and verified profiles that made us feel secure throughout our journey.",
      date: "Married: January 2024",
      location: "Bangalore, India",
    },
    {
      names: "Karan & Meera",
      images: ["https://images.unsplash.com/photo-1529634597939-b1e7cda5a4d1?w=600&h=600&fit=crop"],
      story: "Our families are so grateful to MatrimonyHub for bringing us together. The cultural sensitivity and attention to traditional values made the whole process comfortable for everyone involved.",
      date: "Married: December 2023",
      location: "Pune, India",
    },
    {
      names: "Rohan & Divya",
      images: ["https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop"],
      story: "We were both skeptical about online matrimony, but MatrimonyHub changed our minds completely. The verification process gave us confidence, and the matching was spot on!",
      date: "Married: October 2023",
      location: "Hyderabad, India",
    },
    {
      names: "Arjun & Kavya",
      images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop"],
      story: "Found my soulmate through MatrimonyHub! The platform's focus on compatibility and shared values helped us build a strong foundation for our relationship.",
      date: "Married: September 2023",
      location: "Chennai, India",
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
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-primary fill-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              Success <span className="gradient-text">Stories</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real couples, real happiness - read their inspiring journeys to finding true love
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden glass-card hover:shadow-xl transition-all h-full">
                  <div className="relative">
                    {story.images.length > 1 ? (
                      <SuccessStoryCarousel images={story.images} names={story.names} />
                    ) : (
                      <img
                        src={story.images[0]}
                        alt={story.names}
                        className="w-full h-72 object-cover object-center"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      <h3 className="text-2xl font-bold text-white mb-1">{story.names}</h3>
                      <p className="text-white/90 text-sm">{story.location}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{story.story}"
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold text-primary">{story.date}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-bold">Write Your Own Success Story</h2>
            <p className="text-xl opacity-90">
              Join thousands of happy couples who found their perfect match on MatrimonyHub
            </p>
            <div className="pt-4">
              <a href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all"
                >
                  Start Your Journey
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
