import ringLogo from "@/assets/ring-logo.png";
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

      {/* Center Watermark: Love & Ring Logo + Brand Name with Low Opacity */}
      {showWatermark && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none p-3">
          <div className="flex flex-col items-center justify-center opacity-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <img
              src={ringLogo}
              alt="Love & Ring"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
              draggable={false}
            />
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-white mt-1.5 drop-shadow-md text-center whitespace-nowrap">
              Love & Ring
            </span>
          </div>
        </div>
      )}

      {/* Invisible Shield Overlay that captures right-clicks, selections, and drag events */}
      <div
        className="absolute inset-0 z-20 bg-transparent cursor-pointer"
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
