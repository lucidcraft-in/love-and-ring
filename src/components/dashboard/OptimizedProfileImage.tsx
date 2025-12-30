import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OptimizedProfileImageProps {
  src: string;
  alt: string;
  isLocked?: boolean;
  className?: string;
}

const OptimizedProfileImage = ({
  src,
  alt,
  isLocked = false,
  className,
}: OptimizedProfileImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={cn("relative w-full h-full", className)}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}

      {/* Actual image - only load when in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400";
            setIsLoaded(true);
          }}
          className={cn(
            "w-full h-full object-cover object-center transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            isLocked ? "blur-lg" : ""
          )}
        />
      )}
    </div>
  );
};

export default OptimizedProfileImage;
