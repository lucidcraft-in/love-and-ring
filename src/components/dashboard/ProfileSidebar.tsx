import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Edit, Crown, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (tab: string) => void;
}

const ProfileSidebar = ({ isOpen, onToggle, onNavigate }: ProfileSidebarProps) => {
  const [isPremium] = useState(false);
  
  // Mock user data - replace with actual user data
  const user = {
    name: "John Doe",
    profileId: "SM123456",
    avatar: "",
    initials: "JD",
  };

  const handleEditProfile = () => {
    onNavigate?.("profile");
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-md"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border z-40",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Profile Section */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Avatar with Edit Button */}
          <div className="relative mx-auto mb-4">
            <Avatar className="h-28 w-28 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <button 
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              onClick={handleEditProfile}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">ID: {user.profileId}</p>
            <Badge 
              variant={isPremium ? "default" : "secondary"} 
              className={cn(
                "mt-2",
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

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleEditProfile}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>

            {!isPremium && (
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                asChild
              >
                <Link to="/pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Link>
              </Button>
            )}
          </div>

          {/* Profile Completion */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
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
            <p className="text-xs text-muted-foreground mt-2">
              Complete your profile to get better matches
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-xs text-muted-foreground">Profile Views</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Interests</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Member since Jan 2024
          </p>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
