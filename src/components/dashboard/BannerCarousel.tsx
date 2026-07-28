import { useState, useEffect, useRef } from "react";
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
        console.error("Failed to fetch banners:", err);
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

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-border/40 bg-card mb-6 group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Slide Container */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-7">
                <div className="max-w-xl space-y-1.5 animate-fade-in">
                  {banner.title && (
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                  )}

                  {banner.targetUrl && banner.targetUrl !== "#" && (
                    <a
                      href={banner.targetUrl}
                      target={banner.targetUrl.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium shadow-md transition-transform hover:scale-105"
                    >
                      <span>Explore Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (visible when multiple banners & on hover) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators (Dots) */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-white/60 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
