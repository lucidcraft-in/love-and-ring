import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Heart,
  UserCheck,
  Camera,
  UserPen,
  Sparkles,
  Search,
  Check,
  Eye,
  Filter,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProtectedProfileImage from "./ProtectedProfileImage";
import DummyProfile from "@/assets/DummyProfile.png";
import {
  fetchDashboardNotifications,
  markAllNotificationsReadApi,
  deleteNotificationApi,
  NotificationItem,
} from "@/services/notificationService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotificationsProps {
  onNavigate?: (tab: string) => void;
}

const formatRelativeTime = (dateInput?: string) => {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const Notifications = ({ onNavigate }: NotificationsProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForDelete, setSelectedForDelete] = useState<NotificationItem | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsReadApi();
    toast.success("All notifications marked as read");
  };

  const handleClearNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotificationApi(id);
    toast.success("Notification removed");
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    const itemToDelete = selectedForDelete;
    setSelectedForDelete(null);
    await handleClearNotification(itemToDelete.id);
  };

  const handleAction = (item: NotificationItem) => {
    if (item.userId) {
      navigate(`/profile/${item.userId}`);
    } else if (onNavigate) {
      onNavigate("interests");
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesCategory =
      activeFilter === "all" || item.category === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "interest":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "accepted":
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case "like":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />;
      case "photo_update":
        return <Camera className="w-4 h-4 text-blue-500" />;
      case "profile_update":
        return <UserPen className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">
              Notifications & Activity Feed
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground font-semibold px-2 py-0.5 text-xs rounded-full">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Stay updated with profile activity, photo additions, and interest status from matched members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-border hover:bg-muted"
            onClick={handleMarkAllAsRead}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="glass-card p-4 rounded-2xl border border-border/40 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {[
              { id: "all", label: "All Notifications" },
              { id: "matches", label: "Matches & Activity" },
              { id: "interests", label: "Interests" },
              { id: "likes", label: "Likes & Views" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeFilter === tab.id ? "default" : "ghost"}
                size="sm"
                className={`text-xs font-semibold rounded-xl shrink-0 transition-all ${
                  activeFilter === tab.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-card/60"
            />
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-muted-foreground text-sm font-medium">
            Loading activity feed...
          </p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
              className={`glass-card p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                item.isRead
                  ? "border-border/40 bg-card/40"
                  : "border-primary/30 bg-primary/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div
                  className="relative cursor-pointer shrink-0"
                  onClick={() => handleAction(item)}
                >
                  <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                    <ProtectedProfileImage
                      src={item.avatar}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      showWatermark={false}
                      onError={(e) => {
                        e.currentTarget.src = DummyProfile;
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 shadow-sm border border-border">
                    {getIcon(item.type)}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-sm font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleAction(item)}
                        >
                          {item.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 h-4 border-primary/30 text-primary font-medium rounded-full"
                        >
                          {item.title}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 font-medium">
                      {formatRelativeTime(item.date)}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      {item.userId && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-3 rounded-full border-primary/40 text-primary hover:bg-primary hover:text-white transition-all font-medium flex items-center gap-1.5"
                          onClick={() => navigate(`/profile/${item.userId}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </Button>
                      )}
                      {item.type === "interest" && (
                        <Button
                          size="sm"
                          className="text-xs h-7 px-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-95 shadow-sm"
                          onClick={() => onNavigate && onNavigate("interests")}
                        >
                          Respond
                        </Button>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-full"
                      onClick={() => setSelectedForDelete(item)}
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card p-12 text-center rounded-2xl border border-dashed border-border/60">
          <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Notifications Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            There are no notifications or activities matching your current search and filter settings.
          </p>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!selectedForDelete}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
      >
        <AlertDialogContent className=" max-w-md rounded-2xl p-6 border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-primary/15 to-secondary/15 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Trash2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <AlertDialogTitle className="text-base font-bold text-foreground">
                  Delete Notification?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Are you sure you want to delete this notification
                  {selectedForDelete?.name ? ` from "${selectedForDelete.name}"` : ""}?
                  This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 flex items-center justify-end gap-2.5">
            <AlertDialogCancel
              onClick={() => setSelectedForDelete(null)}
              className="text-xs rounded-xl h-9 px-4 font-semibold border-border/60 hover:text-gray-500 hover:glass-card"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="text-xs rounded-xl h-9 px-5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-semibold shadow-md border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;
