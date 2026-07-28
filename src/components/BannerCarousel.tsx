import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Axios from "@/axios/axios";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl?: string;
  status: "Active" | "Inactive";
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch active banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await Axios.get<Banner[]>("/api/cms/banners");
        const activeBanners = (response.data || []).filter(
          (b) => b.status === "Active" && b.imageUrl
        );
        setBanners(activeBanners);
      } catch (err) {
        console.error("Failed to fetch banners for homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide effect every 4 seconds
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading || banners.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div
          className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-border/50 bg-card group transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Banner Slide Container */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-[360px] w-full overflow-hidden">
            {banners.map((banner, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={banner._id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {/* Background Image */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || "Promotional Banner"}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
                    <div className="max-w-2xl space-y-2">
                      {banner.title && (
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2 drop-shadow-sm">
                          {banner.subtitle}
                        </p>
                      )}

                      {banner.targetUrl && banner.targetUrl !== "#" && (
                        <a
                          href={banner.targetUrl}
                          target={banner.targetUrl.startsWith("http") ? "_blank" : "_self"}
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105"
                        >
                          <span>Learn More</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows (visible on hover if >1 banner) */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Pagination Indicators (Dots) */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-7 bg-primary" : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
