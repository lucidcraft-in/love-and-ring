import { 
  X, 
  Menu, 
  LayoutDashboard, 
  UserPen, 
  ImageIcon, 
  Heart, 
  Users, 
  Search 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  // Mock user data
  const user = {
    name: "John Doe",
    profileId: "SM123456",
    email: "johndoe@example.com",
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

      {/* Desktop/Tablet Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between w-[280px] h-screen sticky top-0 bg-card border-r border-border overflow-hidden"
        )}
      >
        {/* Top Section: Profile + Navigation */}
        <div className="flex flex-col">
          {/* Large Profile Avatar Section */}
          <div className="flex flex-col items-center pt-8 pb-6 px-4">
            <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h2>
          </div>

          {/* Navigation Tabs */}
          <nav className="px-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section: Compact Profile Card */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Preserved old UI */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border z-40",
          "flex flex-col overflow-hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Profile Section */}
        <div className="p-5 border-b border-border">
          <div className="relative mx-auto mb-3 w-fit">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
            <p className="text-xs text-muted-foreground">ID: {user.profileId}</p>
          </div>
        </div>

        {/* Mobile Navigation */}
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
      </aside>
    </>
  );
};

export default ProfileSidebar;
