import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import SuccessStoryCarousel from "@/components/SuccessStoryCarousel";

interface Story {
  names: string;
  images: string[];
  story: string;
  date: string;
  location: string;
}

const SuccessStories = () => {
  // Real stories will be added here
  const stories: Story[] = [];

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
      {stories.length > 0 && (
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
      )}

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
