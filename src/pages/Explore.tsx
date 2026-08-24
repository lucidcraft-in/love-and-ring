import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Youtube, Heart, Calendar, ExternalLink, X, Play, Filter, Sparkles, Image as ImageIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicExploreItems, ExploreItem } from "@/services/ExploreServices";
import { useNavigate } from "react-router-dom";

export const extractYoutubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function Explore() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getPublicExploreItems();
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch explore gallery items", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  const handleItemClick = (item: ExploreItem) => {
    setSelectedItem(item);
  };

  const selectedVideoId = selectedItem ? (selectedItem.youtubeVideoId || extractYoutubeVideoId(selectedItem.youtubeUrl)) : null;
  const canonicalYoutubeShortsUrl = selectedVideoId
    ? `https://www.youtube.com/shorts/${selectedVideoId}`
    : selectedItem?.youtubeUrl
    ? (selectedItem.youtubeUrl.startsWith("http") ? selectedItem.youtubeUrl : `https://${selectedItem.youtubeUrl}`)
    : "#";

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 via-background to-background py-12 md:py-16 mb-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-semibold uppercase tracking-wider gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Explore Matchmaking Highlights
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Real Weddings &amp; <span className="gradient-text">Happy Couples</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Discover real wedding photos and YouTube Shorts highlights of couples who found their lifelong partner through <strong className="text-foreground">Love &amp; Ring</strong>.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="rounded-full px-5 gap-2 text-xs md:text-sm font-medium"
          >
            <Filter className="w-3.5 h-3.5" />
            All Moments ({items.length})
          </Button>
          <Button
            variant={activeFilter === "image" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("image")}
            className="rounded-full px-5 gap-2 text-xs md:text-sm font-medium"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Marriage Photos ({items.filter((i) => i.type === "image").length})
          </Button>
          <Button
            variant={activeFilter === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("video")}
            className="rounded-full px-5 gap-2 text-xs md:text-sm font-medium"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            YouTube Shorts ({items.filter((i) => i.type === "video").length})
          </Button>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-muted animate-pulse h-80" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 border-2 border-dashed border-border rounded-2xl max-w-md mx-auto p-8 space-y-3">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No Explore Items Yet</h3>
            <p className="text-xs text-muted-foreground">Check back soon for new wedding photos and video highlights!</p>
          </div>
        ) : (
          /* Instagram-style Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item) => {
                const isVideo = item.type === "video";
                const vId = extractYoutubeVideoId(item.youtubeUrl) || item.youtubeVideoId;
                const displayThumb = item.thumbnailUrl || (vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : item.imageUrl);
                const hasStory = !!item.successStoryId;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="group relative bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-border/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    {/* Image / Video Thumbnail */}
                    <div className="relative aspect-[4/5] bg-black overflow-hidden">
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
                          <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Type Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
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
                        {hasStory && (
                          <Badge className="bg-rose-600/90 text-white backdrop-blur-md border-0 text-[10px] font-semibold gap-1 px-2 py-0.5 shadow">
                            <Heart className="w-3 h-3 fill-current" /> Story Linked
                          </Badge>
                        )}
                      </div>

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                        {item.coupleName && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                            <Heart className="w-3 h-3 fill-rose-300" />
                            {item.coupleName}
                          </span>
                        )}
                        <h3 className="font-bold text-base leading-snug line-clamp-2 text-white group-hover:text-rose-100 transition-colors">
                          {item.title}
                        </h3>
                        {item.weddingDate && (
                          <p className="text-[11px] text-white/70 flex items-center gap-1 pt-1">
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

                    {/* Caption Preview */}
                    {item.description && (
                      <div className="p-3.5 bg-card border-t text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl border border-border"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row max-h-[85vh]">
                {/* Media Side */}
                <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[350px] md:min-h-[480px]">
                  {selectedItem.type === "video" ? (
                    selectedVideoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                        title={selectedItem.title}
                        className="w-full h-full min-h-[350px] md:min-h-[480px] border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <Youtube className="w-12 h-12 text-red-500" />
                        <p className="font-semibold text-sm">YouTube Shorts Video</p>
                        <a
                          href={canonicalYoutubeShortsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 rounded-full bg-red-600 text-white font-medium text-xs flex items-center gap-2"
                        >
                          Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )
                  ) : (
                    <img
                      src={selectedItem.imageUrl || selectedItem.thumbnailUrl}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain max-h-[80vh]"
                    />
                  )}
                </div>

                {/* Details Side */}
                <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-card">
                  <div className="space-y-4">
                    <Badge variant="outline" className="text-xs uppercase tracking-wider">
                      {selectedItem.type === "video" ? "YouTube Shorts Highlight" : "Wedding Photo"}
                    </Badge>

                    <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                      {selectedItem.title}
                    </h2>

                    {selectedItem.coupleName && (
                      <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                        <Heart className="w-4 h-4 fill-current" />
                        {selectedItem.coupleName}
                      </div>
                    )}

                    {selectedItem.weddingDate && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Wedding Date: {new Date(selectedItem.weddingDate).toLocaleDateString()}
                      </p>
                    )}

                    {selectedItem.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t">
                        {selectedItem.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 space-y-2">
                    {selectedItem.successStoryId && (
                      <Button
                        onClick={() => {
                          setSelectedItem(null);
                          navigate("/success-stories");
                        }}
                        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-2 py-5 shadow"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read Full Couple Success Story
                      </Button>
                    )}
                    {selectedItem.type === "video" && (
                      <a
                        href={canonicalYoutubeShortsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-md"
                      >
                        <Youtube className="w-4 h-4 fill-current" />
                        Open in YouTube Shorts
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    )}
                    <Button
                      onClick={() => setSelectedItem(null)}
                      variant="outline"
                      className="w-full rounded-xl"
                    >
                      Close Window
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
