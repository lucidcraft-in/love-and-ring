import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Play, Youtube, Video, Briefcase, Calendar, MapPin, ExternalLink, ChevronRight, Sparkles, X, ArrowRight, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SuccessStoryCarousel from "@/components/SuccessStoryCarousel";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import successStoriesHeroBg from "@/assets/success-stories-hero-bg.jpg";
import Axios from "@/axios/axios";
import { useNavigate } from "react-router-dom";

export interface ServiceUsed {
  serviceId?: string;
  title: string;
  category: string;
  priceRange?: string;
  location?: string;
  imageUrl?: string;
}

export interface ExploreItemRef {
  _id: string;
  title: string;
  type: "image" | "video";
  imageUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface Story {
  _id?: string;
  names?: string;
  coupleName: string;
  imageUrl?: string;
  images: string[];
  galleryPhotos?: string[];
  videoUrl?: string;
  servicesUsed?: ServiceUsed[];
  story: string;
  date: string;
  location?: string;
  exploreItems?: ExploreItemRef[];
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const extractYoutubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const SuccessStories = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMalayalam, setShowMalayalam] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await Axios.get("/api/cms/success-stories", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const normalized = (response.data || []).map((item: any) => {
        const photoImages: string[] = [];

        // Primary cover image (if photo)
        if (item.imageUrl) photoImages.push(item.imageUrl);

        // Uploaded gallery photos
        if (Array.isArray(item.galleryPhotos)) {
          item.galleryPhotos.forEach((g: string) => {
            if (g && !photoImages.includes(g)) photoImages.push(g);
          });
        }

        // Only include linked explore items that are strictly photo/image type
        if (Array.isArray(item.exploreItems)) {
          item.exploreItems.forEach((exp: any) => {
            const isImage = exp.type === "image" || exp.type === "photo" || (!exp.type && !exp.youtubeUrl && exp.imageUrl);
            if (isImage && exp.imageUrl && !photoImages.includes(exp.imageUrl)) {
              photoImages.push(exp.imageUrl);
            }
          });
        }

        if (Array.isArray(item.images)) {
          item.images.forEach((img: string) => {
            if (img && !photoImages.includes(img)) photoImages.push(img);
          });
        }

        let videoUrl = item.videoUrl || "";
        if (!videoUrl && Array.isArray(item.exploreItems)) {
          const videoItem = item.exploreItems.find((e: any) => e.type === "video" && e.youtubeUrl);
          if (videoItem) videoUrl = videoItem.youtubeUrl;
        }

        let servicesUsed: ServiceUsed[] = [];
        if (Array.isArray(item.servicesUsed)) {
          servicesUsed = item.servicesUsed;
        } else if (typeof item.servicesUsed === "string" && item.servicesUsed.trim()) {
          try {
            servicesUsed = JSON.parse(item.servicesUsed);
          } catch (e) {
            console.error("Error parsing servicesUsed JSON:", e);
          }
        }

        return {
          ...item,
          videoUrl,
          servicesUsed: Array.isArray(servicesUsed) ? servicesUsed : [],
          images: photoImages,
        };
      });

      setStories(normalized);
    } catch (error: any) {
      console.error("Error fetching success stories:", error?.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMalayalam((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenStoryModal = (story: Story) => {
    setSelectedStory(story);
    setActiveVideoUrl(story.videoUrl || "");
  };

  const handleRedirectToService = (service: ServiceUsed) => {
    setSelectedStory(null);
    if (service.serviceId) {
      navigate(`/services?category=${encodeURIComponent(service.category || "")}&serviceId=${service.serviceId}`);
    } else if (service.category) {
      navigate(`/services?category=${encodeURIComponent(service.category)}`);
    } else {
      navigate(`/services`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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
            <h1 className="text-3xl md:text-8xl font-extrabold text-white tracking-tight">
              Success{" "}
              <span className="gradient-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Stories
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl hero-subtext min-h-[60px]">
              Real couples, real happiness — read their inspiring journeys to
              finding true love.{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={showMalayalam ? "ml" : "en"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.6 }}
                  className={
                    showMalayalam ? "gradient-text-light inline" : "inline"
                  }
                  style={
                    showMalayalam
                      ? {
                          fontFamily: "'Noto Sans Malayalam', sans-serif",
                          fontSize: "0.9em",
                          fontWeight: 500,
                        }
                      : {}
                  }
                >
                  {!showMalayalam
                    ? "Digitally bridging Malayali individuals across the world seeking serious Partnerships."
                    : "ജീവിതപങ്കാളിയെ കുറിച്ച് ഉള്ള നിങ്ങളുടെ സ്വപ്നം സഫലമാക്കാൻ….ലവ് & റിങ്"}
                </motion.span>
              </AnimatePresence>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      {stories.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {stories.map((story, index) => {
                const videoId = extractYoutubeVideoId(story.videoUrl);
                const linkedVideos = (story.exploreItems || []).filter(
                  (e) => e.type === "video" || !!e.youtubeUrl
                );
                const hasServices = story.servicesUsed && story.servicesUsed.length > 0;

                return (
                  <motion.div
                    key={story._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden glass-card hover:shadow-2xl transition-all h-full flex flex-col justify-between group border border-border/60">
                      <div>
                        {/* Media Section */}
                        <div className="relative cursor-pointer" onClick={() => handleOpenStoryModal(story)}>
                          {story.images && story.images.length > 1 ? (
                            <SuccessStoryCarousel
                              images={story.images}
                              names={story.coupleName || story.names || ""}
                            />
                          ) : story.images && story.images.length === 1 ? (
                            <img
                              src={story.images[0]}
                              alt={story.coupleName}
                              className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-72 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <Heart className="h-16 w-16 text-primary/40" />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                            {videoId && (
                              <Badge className="bg-red-600/90 text-white backdrop-blur-md border-0 text-[10px] font-semibold flex items-center gap-1 shadow-md px-2.5 py-1">
                                <Youtube className="w-3 h-3 fill-current" /> Video Highlights
                              </Badge>
                            )}
                            {linkedVideos.length > 0 && (
                              <Badge className="bg-purple-600/90 text-white backdrop-blur-md border-0 text-[10px] font-semibold flex items-center gap-1 shadow-md px-2.5 py-1">
                                <Sparkles className="w-3 h-3 text-yellow-300" /> {linkedVideos.length} Video Clips
                              </Badge>
                            )}
                            {hasServices && (
                              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-0 text-[10px] font-semibold flex items-center gap-1 shadow-md px-2.5 py-1">
                                <Briefcase className="w-3 h-3" /> {story.servicesUsed?.length} Services Mentioned
                              </Badge>
                            )}
                          </div>

                          {/* Couple Name on Cover */}
                          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                              {story.coupleName || story.names}
                            </h3>
                            {story.location && (
                              <p className="text-white/90 text-sm flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                                {story.location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-3">
                          <div
                            className="text-muted-foreground italic leading-relaxed line-clamp-3 prose dark:prose-invert text-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: story.story }}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenStoryModal(story)}
                            className="p-0 h-auto text-primary font-bold text-sm hover:bg-transparent hover:underline inline-flex items-center gap-1"
                          >
                            <span>Read full story &amp; view media</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-6 pt-0 border-t border-border/40 mt-4 flex items-center justify-between text-xs">
                        <span className="font-semibold text-primary">
                          Wedding: {formatDate(story.date)}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenStoryModal(story)}
                          className="rounded-full text-xs font-semibold gap-1"
                        >
                          <span>Explore Story</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Story Detail & Services Modal */}
      <Dialog
        open={!!selectedStory}
        onOpenChange={() => setSelectedStory(null)}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl rounded-3xl p-0 overflow-hidden border border-border shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-white relative shrink-0">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-white" />
              Love &amp; Ring Success Story
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedStory?.coupleName || selectedStory?.names}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Married on {formatDate(selectedStory?.date)}
            </DialogDescription>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-card">
            {/* Story Text */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Their Love Journey
              </h4>
              <div
                className="text-muted-foreground italic leading-relaxed prose dark:prose-invert text-sm sm:text-base max-w-none bg-muted/30 p-4 rounded-2xl border"
                dangerouslySetInnerHTML={{ __html: selectedStory?.story || "" }}
              />
            </div>

            {/* Main Video Player Section */}
            {(activeVideoUrl || selectedStory?.videoUrl) && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-600 fill-current" />
                  Wedding Video Highlights &amp; YouTube Shorts
                </h4>

                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-border">
                  {extractYoutubeVideoId(activeVideoUrl || selectedStory?.videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeVideoId(activeVideoUrl || selectedStory?.videoUrl)}?autoplay=0`}
                      title="Wedding Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                      <Video className="w-12 h-12 text-primary" />
                      <p className="text-sm font-semibold">Watch Wedding Video</p>
                      <a
                        href={activeVideoUrl || selectedStory?.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2"
                      >
                        Open Video Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Linked Explore Video Clips Only (NO photo thumbnails here) */}
            {selectedStory?.exploreItems &&
              selectedStory.exploreItems.filter((e) => e.type === "video" || !!e.youtubeUrl).length > 0 && (
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Explore Video Clips &amp; YouTube Shorts
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedStory.exploreItems
                      .filter((exp) => exp.type === "video" || !!exp.youtubeUrl)
                      .map((exp) => {
                        const vId = extractYoutubeVideoId(exp.youtubeUrl) || exp.youtubeVideoId;
                        const thumb = exp.thumbnailUrl || (vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : exp.imageUrl);

                        return (
                          <div
                            key={exp._id}
                            onClick={() => {
                              if (exp.youtubeUrl) {
                                setActiveVideoUrl(exp.youtubeUrl);
                              }
                            }}
                            className="group relative rounded-xl overflow-hidden h-36 bg-black border shadow-sm cursor-pointer"
                          >
                            {thumb ? (
                              <img src={thumb} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Video className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center text-white">
                              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow mb-1">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                              <span className="text-[10px] font-semibold line-clamp-1">{exp.title}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Couple Photo Gallery (Only actual photo uploads, NO video thumbnails) */}
            {selectedStory?.images && selectedStory.images.length > 0 && (
              <div className="space-y-3 pt-2 border-t">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Couple Photo Gallery ({selectedStory.images.length} {selectedStory.images.length === 1 ? "Photo" : "Photos"})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedStory.images.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden h-36 bg-muted border shadow-sm">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentioned Wedding Services Provided */}
            {selectedStory?.servicesUsed && selectedStory.servicesUsed.length > 0 && (
              <div className="space-y-3 border-t pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Wedding Services &amp; Partners Mentioned
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Click any service partner below to view details and service listing.
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-xs font-bold">
                    {selectedStory.servicesUsed.length} Partners
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStory.servicesUsed.map((svc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleRedirectToService(svc)}
                      className="group p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {svc.imageUrl ? (
                          <img src={svc.imageUrl} alt={svc.title} className="w-12 h-12 rounded-xl object-cover border group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            <Briefcase className="w-6 h-6" />
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            {svc.category}
                          </Badge>
                          <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {svc.title}
                          </h5>
                          {svc.location && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {svc.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>View Service</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessStories;
