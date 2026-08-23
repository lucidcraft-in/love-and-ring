import React from "react";
import { cn } from "@/lib/utils";
import { PROFILE_PHOTO_PROTECTION_ENABLED } from "@/config/security";

interface ProtectedProfileImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  showWatermark?: boolean;
  isLocked?: boolean;
}

const ProtectedProfileImage: React.FC<ProtectedProfileImageProps> = ({
  src,
  alt = "Profile Photo",
  className,
  style,
  showWatermark = true,
  isLocked = false,
  onClick,
  onLoad,
  onError,
  ...props
}) => {
  // If photo protection is disabled in the configuration switch, behave as a standard image
  if (!PROFILE_PHOTO_PROTECTION_ENABLED) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(className, isLocked ? "blur-lg" : "")}
        style={style}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  }

  // If photo protection is enabled, render standard anti-save/anti-drag protections
  return (
    <div className="relative w-full h-full select-none overflow-hidden" style={{ userSelect: "none" }}>
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover transition-all duration-300", className, isLocked ? "blur-lg" : "")}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitUserDrag: "none",
          ...style,
        } as React.CSSProperties}
        draggable={false}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />

      {/* Invisible Shield Overlay that captures right-clicks, selections, and drag events */}
      <div
        className="absolute inset-0 z-10 bg-transparent cursor-pointer"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        onClick={onClick}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitUserDrag: "none",
        } as React.CSSProperties}
      />
    </div>
  );
};

export default ProtectedProfileImage;
