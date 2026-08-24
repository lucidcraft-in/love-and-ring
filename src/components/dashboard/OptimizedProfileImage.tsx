import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import DummyProfile from "@/assets/DummyProfile.png";
import ProtectedProfileImage from "./ProtectedProfileImage";

interface OptimizedProfileImageProps {
  src: string;
  alt: string;
  isLocked?: boolean;
  className?: string;
}

// Global cache to keep track of loaded image URLs across component remounts
const loadedImageUrls = new Set<string>();

const OptimizedProfileImage = ({
  src,
  alt,
  isLocked = false,
  className,
}: OptimizedProfileImageProps) => {
  const isAlreadyCached =
    !src ||
    loadedImageUrls.has(src) ||
    src.startsWith("data:") ||
    src.includes("static") ||
    src.includes("assets");

  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyCached);

  useEffect(() => {
    if (src && loadedImageUrls.has(src)) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (src) loadedImageUrls.add(src);
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DummyProfile;
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative w-full h-full bg-muted overflow-hidden", className)}>
      {/* Skeleton placeholder - only shown while image is loading for the very first time */}
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none z-0" />
      )}

      {/* Actual image rendered directly using native browser lazy loading */}
      <ProtectedProfileImage
        src={src || DummyProfile}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover object-center transition-opacity duration-150 relative z-10",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        isLocked={isLocked}
      />
    </div>
  );
};

export default OptimizedProfileImage;
