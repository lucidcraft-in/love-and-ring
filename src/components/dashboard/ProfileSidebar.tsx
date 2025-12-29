import { X, Menu, LayoutDashboard, UserPen, ImageIcon, Heart, Users, Search } from "lucide-react";
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
  // Mock user data - using a real profile image with fallback to initials
  const user = {
    name: "John Doe",
    profileId: "SM123456",
    email: "johndoe@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    initials: "JD",
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={onToggle} />}

      {/* Desktop/Tablet Sidebar - ChatGPT style fixed sidebar */}
      <aside className={cn("hidden lg:flex flex-col w-[280px] h-screen bg-card border-r border-border")}>
        {/* Fixed Profile Header Section - Never scrolls */}
        <div className="flex-shrink-0 flex flex-col items-center pt-8 pb-4 px-4 border-b border-border bg-card">
          <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">ID: {user.profileId}</p>
          <span className="mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Free Account
          </span>
        </div>

        {/* Scrollable Navigation Menu Section - Only this part scrolls */}
        <nav className="flex-1 px-4 py-4 overflow-y-scroll scrollbar-hide">
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
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="pt-3">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50 hover:bg-muted transition">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">JohnDoe@gmail.com</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar - Starts below navbar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-[280px] bg-card border-r border-border z-40",
          "flex flex-col overflow-hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Profile Section */}
        <div className="flex-shrink-0 p-5 border-b border-border">
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

        {/* Mobile Navigation - Scrollable */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-hide">
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
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
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

        {/* Mobile Bottom User Card */}
        <div className="flex-shrink-0 p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
