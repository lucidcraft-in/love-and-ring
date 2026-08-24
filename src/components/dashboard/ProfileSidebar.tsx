import {
  X,
  Menu,
  LayoutDashboard,
  UserPen,
  ImageIcon,
  Heart,
  Users,
  Search,
  Bell,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Axios from "@/axios/axios";

interface ProfileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

interface Photo {
  url: string;
  isPrimary: boolean;
  approvalStatus: string;
}
interface Membership {
  plan?: {
    name?: string;
    title?: string;
  };
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  mobile?: string;
  countryCode?: string;
  profileId?: string;
  photos?: Photo[];
  membership?: Membership;
  profileStatus:string
}

const navigationItems = [
  { id: "summary", label: "Summary", icon: LayoutDashboard },
  { id: "matches", label: "Matches", icon: Users },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "browse", label: "Browse Profiles", icon: Search },
  { id: "my-photos", label: "My Photos", icon: ImageIcon },
  { id: "partner-preference", label: "Partner Preference", icon: Search },
  { id: "edit-profile", label: "Edit Profile", icon: UserPen },
];

const ProfileSidebar = ({
  isOpen,
  onToggle,
  activeTab,
  onNavigate,
}: ProfileSidebarProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        console.warn("User or token missing");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id;

      const response = await Axios.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      console.log("useeeer", response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleUserUpdate = () => {
      fetchUser();
    };

    window.addEventListener("userProfileUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userProfileUpdated", handleUserUpdate);
    };
  }, []);

  const getProfilePhoto = () => {
    if (!userData?.photos || userData.photos.length === 0) {
      return undefined;
    }

    const primary = userData.photos.find((p) => p.isPrimary);

    return primary?.url || userData.photos[0].url;
  };

  const user = {
    name: userData?.fullName || "User",
    email: userData?.email || "",
    profileId: userData?.profileId || userData?._id || "—",
    avatar: getProfilePhoto(),
    mobile: userData?.mobile || "—",
    countryCode: userData?.countryCode || "",
    initials:
      userData?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U",
  };
  const planName =
    (typeof userData?.membership?.plan === "object" && userData?.membership?.plan?.title) ||
    (typeof userData?.membership?.plan === "object" && userData?.membership?.plan?.name) ||
    userData?.profileStatus ||
    "Free Account";
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Desktop/Tablet Sidebar - ChatGPT style fixed sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-[280px] h-[calc(100vh-4rem)] sticky top-16 overflow-hidden bg-card border-r border-border shadow-sm shrink-0",
        )}
      >
        {/* Fixed Profile Header Section - Never scrolls */}
        <div className="flex-shrink-0 flex flex-col items-center pt-4 pb-3 px-4 border-b border-border bg-card">
          <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="object-cover object-center"
            />
            <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-2 text-base font-semibold text-foreground text-center line-clamp-1">
            {user.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-[220px] truncate text-center">
            {user.email}
          </p>

          <span
            className={`mt-2 px-3 py-0.5 text-xs font-medium rounded-full ${
              planName === "Free Account"
                ? "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                : "bg-gradient-to-r from-primary to-secondary text-white shadow-xs"
            }`}
          >
            {planName}
          </span>
        </div>

        {/* Scrollable Navigation Menu Section - Only this part scrolls */}
        <nav className="flex-1 min-h-0 px-3 py-2 overflow-y-auto scrollbar-hide space-y-1">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Fixed Bottom User Profile Card (Photo, Name, Phone Number) */}
        <div className="flex-shrink-0 p-3 border-t border-border bg-card/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 hover:border-primary/30 transition-all shadow-xs">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0 shadow-xs">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover object-center"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.countryCode ? `${user.countryCode} ` : ""}
                {user.mobile}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Starts below navbar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-16 h-[calc(100dvh-4rem)] w-[280px] bg-card border-r border-border z-40",
          "flex flex-col overflow-hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Profile Section */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="relative mx-auto mb-2 w-fit">
            <Avatar className="h-16 w-16 border-4 border-primary/20">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover object-center"
              />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <h2 className="text-base font-semibold text-foreground">
              {user.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-[220px] truncate mx-auto">
              {user.email}
            </p>
          </div>
        </div>

        {/* Mobile Navigation - Scrollable */}
        <nav className="flex-1 min-h-0 p-3 overflow-y-auto scrollbar-hide">
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
        <div className="flex-shrink-0 p-3 border-t border-border bg-card">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
            <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover object-center"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.countryCode ? `${user.countryCode} ` : ""}
                {user.mobile}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
