import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Camera, Youtube, Heart, Calendar, Play, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicExploreItems, ExploreItem } from "@/services/ExploreServices";

const extractYoutubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function HomeExploreSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getPublicExploreItems();
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch home explore preview", err);
    } finally {
      setLoading(false);
    }
  };

  // Preview up to 4 items on home page
  const previewItems = items.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3"
        >
          <Badge className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-semibold uppercase tracking-wider gap-1.5 inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5" />
            Matchmaking Gallery
          </Badge>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Explore <span className="gradient-text">Wedding Highlights</span>
          </h2>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Real wedding moments, photo galleries, and video highlights of couples who found their soulmate on Love &amp; Ring.
          </p>
        </motion.div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-muted animate-pulse h-80" />
            ))}
          </div>
        ) : previewItems.length === 0 ? (
          <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded-2xl max-w-md mx-auto p-8 space-y-4 shadow-sm">
            <Camera className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-base font-bold text-foreground">Discover Our Wedding Gallery</h3>
            <p className="text-xs text-muted-foreground">
              Explore real wedding stories, videos, and photo highlights.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/explore">Go to Explore Page</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewItems.map((item, idx) => {
              const isVideo = item.type === "video";
              const vId = extractYoutubeVideoId(item.youtubeUrl) || item.youtubeVideoId;
              const displayThumb =
                item.thumbnailUrl ||
                (vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : item.imageUrl);

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  onClick={() => navigate("/explore")}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-border/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                    {displayThumb ? (
                      <img
                        src={displayThumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Camera className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}

                    {/* Video Overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/60 text-white backdrop-blur-md border-0 text-[10px] font-semibold tracking-wider uppercase gap-1 px-2.5 py-1">
                        {isVideo ? (
                          <>
                            <Youtube className="w-3 h-3 text-red-500 fill-current" />
                            Shorts
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3 text-primary" />
                            Photo
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                      {item.coupleName && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                          <Heart className="w-3 h-3 fill-rose-300" />
                          {item.coupleName}
                        </span>
                      )}
                      <h3 className="font-bold text-sm leading-snug line-clamp-2 text-white group-hover:text-rose-100 transition-colors">
                        {item.title}
                      </h3>
                      {item.weddingDate && (
                        <p className="text-[11px] text-white/70 flex items-center gap-1 pt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.weddingDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Show More Button -> Redirects to /explore */}
        <div className="text-center mt-10 sm:mt-14">
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full px-8 py-6 text-sm sm:text-base border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm transition-all duration-300 group"
          >
            <Link to="/explore" className="inline-flex items-center gap-2">
              <span>Show More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
