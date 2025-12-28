import { Link } from "react-router-dom";
import { Camera, Crown, Eye, Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (tab: string) => void;
}

const ProfileSidebar = ({ isOpen, onToggle, onNavigate }: ProfileSidebarProps) => {
  const isPremium = false;
  
  // Mock user data
  const user = {
    name: "John Doe",
    profileId: "SM123456",
    email: "john.doe@email.com",
    avatar: "",
    initials: "JD",
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on tablet/desktop */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border z-40",
          "flex-col"
        )}
      >
        {/* Fixed Header Section - Avatar, Name, Badge */}
        <div className="flex-shrink-0 p-6 pb-0">
          {/* Avatar */}
          <div className="relative mx-auto mb-4 w-fit">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <button 
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              onClick={() => onNavigate?.("profile")}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* User Name */}
          <div className="text-center mb-3">
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
          </div>

          {/* Free Account Badge */}
          <div className="flex justify-center mb-4">
            <Badge 
              variant={isPremium ? "default" : "secondary"} 
              className={cn(
                isPremium && "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
              )}
            >
              {isPremium ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </>
              ) : (
                "Free Account"
              )}
            </Badge>
          </div>

          {/* Divider */}
          <Separator className="mb-4" />
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
          {/* Profile Completion */}
          <div className="p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-primary font-semibold">75%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Profile Views Card */}
          <div className="p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </div>

          {/* Interests Card */}
          <div className="p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary/10">
                <Heart className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Interests Received</p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <p className="text-xs text-muted-foreground text-center mb-4">
            Member since Jan 2024
          </p>

          {/* Upgrade to Premium Button */}
          {!isPremium && (
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 mb-4"
              asChild
            >
              <Link to="/pricing">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
        </div>

        {/* Fixed Footer - User Mini Profile Card */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
