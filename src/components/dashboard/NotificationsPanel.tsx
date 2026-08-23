import { useEffect, useState } from "react";
import { Bell, Heart, Sparkles, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Axios from "@/axios/axios";
import socket from "@/socket";

interface NotificationsPanelProps {
  onNavigate?: (tab: string) => void;
}

interface NotificationItem {
  id: string;
  type: "interest" | "accepted" | "like";
  title: string;
  name: string;
  description: string;
  avatar?: string;
  initials: string;
  date?: string;
}

const getInitials = (name?: string) =>
  (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatar = (user: any) => {
  const photos = user?.photos || [];
  return photos.find((p: any) => p.isPrimary)?.url || photos[0]?.url;
};

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff) || diff < 0) return "Recently";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just Now";
  if (minutes < 60) return `${minutes} Min${minutes > 1 ? "s" : ""} Ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Hour${hours > 1 ? "s" : ""} Ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} Day${days > 1 ? "s" : ""} Ago`;
  const months = Math.floor(days / 30);
  return `${months} Month${months > 1 ? "s" : ""} Ago`;
};

const typeStyles: Record<
  NotificationItem["type"],
  { icon: typeof Heart; chip: string }
> = {
  interest: {
    icon: Heart,
    chip: "bg-primary/10 text-primary",
  },
  accepted: {
    icon: UserCheck,
    chip: "bg-emerald-500/10 text-emerald-600",
  },
  like: {
    icon: Sparkles,
    chip: "bg-secondary/10 text-secondary",
  },
};

const NotificationsPanel = ({ onNavigate }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const currentUserId = storedUser ? JSON.parse(storedUser)._id : null;
      const headers = { Authorization: `Bearer ${token}` };

      const [receivedRes, likesRes, acceptedRes] = await Promise.all([
        Axios.get("/api/user/interests/received", { headers }).catch(() => ({ data: [] })),
        Axios.get("/api/user/profile-likes/received", { headers }).catch(() => ({ data: [] })),
        Axios.get("/api/user/interests/accepted/interest", { headers }).catch(() => ({ data: [] })),
      ]);

      const items: NotificationItem[] = [];

      (receivedRes.data || [])
        .filter((item: any) => item?.fromUser && (item.status === "PENDING" || !item.status))
        .forEach((item: any) => {
          const u = item.fromUser;
          items.push({
            id: `interest-${item._id}`,
            type: "interest",
            title: "Interest Received",
            name: u.fullName || "Someone",
            description: "expressed interest in your profile",
            avatar: getAvatar(u),
            initials: getInitials(u.fullName),
            date: item.createdAt || item.updatedAt,
          });
        });

      (acceptedRes.data || []).forEach((item: any) => {
        const otherUser =
          String(item.fromUser?._id) === String(currentUserId)
            ? item.toUser
            : item.fromUser;
        if (!otherUser) return;
        items.push({
          id: `accepted-${item._id}`,
          type: "accepted",
          title: "Interest Accepted",
          name: otherUser.fullName || "Someone",
          description: "accepted your interest — you're now matched",
          avatar: getAvatar(otherUser),
          initials: getInitials(otherUser.fullName),
          date: item.updatedAt || item.createdAt,
        });
      });

      (likesRes.data || [])
        .filter((item: any) => item?.likedBy)
        .forEach((item: any) => {
          const u = item.likedBy;
          items.push({
            id: `like-${item._id}`,
            type: "like",
            title: "New Match Suggestion",
            name: u.fullName || "Someone",
            description: "liked your profile",
            avatar: getAvatar(u),
            initials: getInitials(u.fullName),
            date: item.createdAt || item.updatedAt,
          });
        });

      items.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });

      setNotifications(items.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleChange = () => fetchNotifications();
    socket.on("interest-status-changed", handleChange);
    return () => {
      socket.off("interest-status-changed", handleChange);
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h3>
        {notifications.length > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-hide divide-y divide-border/60">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-2.5 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 px-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New interests and matches will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const style = typeStyles[n.type];
            const Icon = style.icon;
            return (
              <button
                key={n.id}
                onClick={() => onNavigate?.("interests")}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={n.avatar} alt={n.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                      {n.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 p-0.5 rounded-full ${style.chip} flex items-center justify-center border-2 border-card`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      {timeAgo(n.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    <span className="font-medium text-foreground">{n.name}</span>{" "}
                    {n.description}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="outline"
          className="w-full h-9 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/5 hover:text-primary"
          onClick={() => onNavigate?.("interests")}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
