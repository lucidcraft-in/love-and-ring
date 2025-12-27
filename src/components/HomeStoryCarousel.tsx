import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface HomeStoryCarouselProps {
  images: string[];
  names: string;
}

const HomeStoryCarousel = ({ images, names }: HomeStoryCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <img
                src={image}
                alt={`${names} - ${index + 1}`}
                className="w-full h-48 sm:h-64 object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeStoryCarousel;