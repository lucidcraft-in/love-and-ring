import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SuccessStoryCarousel from "@/components/SuccessStoryCarousel";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import successStoriesHeroBg from "@/assets/success-stories-hero-bg.jpg";
import abinaBasil1 from "@/assets/abina-basil-1.png";
import abinaBasil2 from "@/assets/abina-basil-2.png";
import molexRoshin1 from "@/assets/molex-roshin-1.png";
import molexRoshin2 from "@/assets/molex-roshin-2.png";
import molexRoshin3 from "@/assets/molex-roshin-3.png";
import sheenBibin1 from "@/assets/sheen-bibin-1.png";
import sheenBibin2 from "@/assets/sheen-bibin-2.png";
import athiraVisish1 from "@/assets/athira-visish-1.png";
import athiraVisish2 from "@/assets/athira-visish-2.png";
import athiraVisish3 from "@/assets/athira-visish-3.png";
import jesnaAlias1 from "@/assets/jesna-alias-1.png";
import nimishaJestin1 from "@/assets/nimisha-jestin-1.png";
import nimishaJestin2 from "@/assets/nimisha-jestin-2.png";
import nimishaJestin3 from "@/assets/nimisha-jestin-3.png";
import nimishaJestin4 from "@/assets/nimisha-jestin-4.png";
import Axios from "@/axios/axios";

interface Story {
  names: string;
  coupleName: string;
  images: string[];
  story: string;
  date: string;
  location?: string;
}

const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await Axios.get("/api/cms/success-stories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const normalized = (response.data || []).map((item: any) => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
      }));

      setStories(normalized);
    } catch (error: any) {
      console.error("Error:", error.response);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - matches Home page hero design */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${successStoriesHeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Floating Brand Logo */}
        <FloatingBrandLogo variant="hero" />

        {/* Hero Content */}
        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white hero-text-shadow">
              Success{" "}
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Stories
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl hero-subtext">
              Real couples, real happiness — read their inspiring journeys to
              finding true love
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
                  <Card className="overflow-hidden glass-card hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="relative">
                      {Array.isArray(story.images) &&
                      story.images.length > 1 ? (
                        <SuccessStoryCarousel
                          images={story.images}
                          names={story.names}
                        />
                      ) : story.images.length === 1 ? (
                        <img
                          src={story.images[0]}
                          alt={story.names}
                          className="w-full h-72 object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Heart className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {story.coupleName}
                        </h3>
                        {story.location && (
                          <p className="text-white/90 text-sm">
                            {story.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <p className="text-muted-foreground italic leading-relaxed line-clamp-4">
                          "{story.story}"
                        </p>
                        {story.story.length > 150 && (
                          <button
                            onClick={() => setSelectedStory(story)}
                            className="text-primary text-sm font-medium hover:underline mt-2 transition-colors"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                      <div className="pt-4 mt-4 border-t">
                        <p className="text-sm font-semibold text-primary">
                          {story.date}
                        </p>
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
            <h2 className="text-4xl md:text-5xl font-bold">
              Write Your Own Success Story
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of happy couples who found their perfect match on
              MatrimonyHub
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

      {/* Read More Modal */}
      <Dialog
        open={!!selectedStory}
        onOpenChange={() => setSelectedStory(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              {selectedStory?.names}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground italic leading-relaxed">
              "{selectedStory?.story}"
            </p>
            <p className="text-sm font-semibold text-primary">
              {selectedStory?.date}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessStories;
