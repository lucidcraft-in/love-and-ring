import { Link } from "react-router-dom";
import { 
  Camera, 
  Crown, 
  X, 
  Menu, 
  LayoutDashboard, 
  UserPen, 
  ImageIcon, 
  Heart, 
  Users, 
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const navigationItems = [
  { id: "summary", label: "Summary", icon: LayoutDashboard },
  { id: "edit-profile", label: "Edit Profile", icon: UserPen },
  { id: "my-photos", label: "My Photos", icon: ImageIcon },
  { id: "partner-preference", label: "Partner Preference", icon: Heart },
  { id: "matches", label: "Matches", icon: Users },
  { id: "browse", label: "Browse Profiles", icon: Search },
];

const ProfileSidebar = ({ isOpen, onToggle, activeTab, onNavigate }: ProfileSidebarProps) => {
  const isPremium = false;
  
  // Mock user data
  const user = {
    name: "John Doe",
    profileId: "SM123456",
    avatar: "",
    initials: "JD",
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
          "fixed left-0 top-0 w-[280px] bg-card border-r border-border z-40",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "h-screen overflow-y-auto",
          "md:h-full md:min-h-screen md:sticky md:top-0 md:overflow-y-auto",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Profile Section */}
        <div className="p-5 border-b border-border">
          {/* Avatar */}
          <div className="relative mx-auto mb-3 w-fit">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <button 
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              onClick={() => onNavigate("edit-profile")}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
            <p className="text-xs text-muted-foreground">ID: {user.profileId}</p>
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

          {/* Profile Completion */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium">Profile Completion</span>
              <span className="text-xs text-primary font-semibold">75%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Upgrade Button */}
          {!isPremium && (
            <Button
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              size="sm"
              asChild
            >
              <Link to="/pricing">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      onToggle();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Stats */}
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-primary">24</p>
              <p className="text-[10px] text-muted-foreground">Profile Views</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-primary">12</p>
              <p className="text-[10px] text-muted-foreground">Interests</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
