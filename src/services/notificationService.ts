import Axios from "@/axios/axios";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";

export interface NotificationItem {
  id: string;
  type: "interest" | "accepted" | "like" | "photo_update" | "profile_update" | "match_suggestion";
  category: "all" | "matches" | "interests" | "likes";
  title: string;
  name: string;
  description: string;
  avatar?: string;
  gender?: string;
  userId?: string;
  date?: string;
  isRead?: boolean;
}

const getAvatar = (user: any) => {
  if (!user) return DummyProfile;
  const photos = user?.photos || [];
  const primary = photos.find((p: any) => p.isPrimary)?.url || photos[0]?.url;
  if (primary) return primary;

  const g = (user?.gender || "").toLowerCase();
  if (g === "female" || g === "lesbian") return FemaleDummy;
  if (g === "male" || g === "gay") return MaleDummy;
  return DummyProfile;
};

const mapDbTypeToType = (dbType: string): NotificationItem["type"] => {
  switch (dbType) {
    case "PHOTO_ADDED":
      return "photo_update";
    case "PROFILE_UPDATED":
      return "profile_update";
    case "INTEREST_RECEIVED":
      return "interest";
    case "INTEREST_ACCEPTED":
      return "accepted";
    case "PROFILE_LIKED":
      return "like";
    default:
      return "match_suggestion";
  }
};

export const fetchDashboardNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser)._id : null;
    const headers = { Authorization: `Bearer ${token}` };

    // Primary: Fetch notifications stored in MongoDB Database
    const dbRes = await Axios.get("/api/user/notifications", { headers }).catch(() => null);

    if (dbRes?.data?.notifications && Array.isArray(dbRes.data.notifications) && dbRes.data.notifications.length > 0) {
      return dbRes.data.notifications.map((n: any) => ({
        id: n._id,
        type: mapDbTypeToType(n.type),
        category: n.category || "matches",
        title: n.title,
        name: n.sender?.fullName || "A Member",
        description: n.description,
        avatar: getAvatar(n.sender),
        gender: n.sender?.gender,
        userId: n.sender?._id || n.sender,
        date: n.createdAt || new Date().toISOString(),
        isRead: n.isRead,
      }));
    }

    // Fallback: Fetch real activity from interest/likes/matches endpoints
    const [receivedRes, likesRes, acceptedRes, matchesRes] = await Promise.all([
      Axios.get("/api/user/interests/received", { headers }).catch(() => ({ data: [] })),
      Axios.get("/api/user/profile-likes/received", { headers }).catch(() => ({ data: [] })),
      Axios.get("/api/user/interests/accepted/interest", { headers }).catch(() => ({ data: [] })),
      Axios.get("/api/user/matches", { headers }).catch(() => ({ data: { data: [] } })),
    ]);

    const items: NotificationItem[] = [];

    // 1. Interests Received
    (receivedRes.data || [])
      .filter((item: any) => item?.fromUser && (item.status === "PENDING" || !item.status))
      .forEach((item: any) => {
        const u = item.fromUser;
        items.push({
          id: `interest-${item._id}`,
          type: "interest",
          category: "interests",
          title: "Interest Received",
          name: u.fullName || "A Member",
          description: "expressed interest in your profile",
          avatar: getAvatar(u),
          gender: u.gender,
          userId: u._id,
          date: item.createdAt || item.updatedAt || new Date().toISOString(),
          isRead: false,
        });
      });

    // 2. Accepted Interests / Matches
    (acceptedRes.data || []).forEach((item: any) => {
      const otherUser =
        String(item.fromUser?._id) === String(currentUserId)
          ? item.toUser
          : item.fromUser;
      if (!otherUser) return;

      items.push({
        id: `accepted-${item._id}`,
        type: "accepted",
        category: "matches",
        title: "Interest Accepted",
        name: otherUser.fullName || "A Member",
        description: "accepted your interest — you are now matched!",
        avatar: getAvatar(otherUser),
        gender: otherUser.gender,
        userId: otherUser._id,
        date: item.updatedAt || item.createdAt || new Date().toISOString(),
        isRead: true,
      });
    });

    // 3. Likes Received
    (likesRes.data || [])
      .filter((item: any) => item?.likedBy)
      .forEach((item: any) => {
        const u = item.likedBy;
        items.push({
          id: `like-${item._id}`,
          type: "like",
          category: "likes",
          title: "Profile Liked",
          name: u.fullName || "A Member",
          description: "liked your profile",
          avatar: getAvatar(u),
          gender: u.gender,
          userId: u._id,
          date: item.createdAt || item.updatedAt || new Date().toISOString(),
          isRead: false,
        });
      });

    // 4. Matched User Photo & Profile Updates Activity
    const matchesList = Array.isArray(matchesRes.data?.data) ? matchesRes.data.data : [];
    matchesList.slice(0, 5).forEach((match: any) => {
      const u = match.user;
      if (!u) return;

      if (Array.isArray(u.photos) && u.photos.length > 0) {
        items.push({
          id: `matched-photo-${u._id}`,
          type: "photo_update",
          category: "matches",
          title: "Matched Profile Photo Update",
          name: u.fullName || "Matched Member",
          description: `updated profile photos on their gallery.`,
          avatar: getAvatar(u),
          gender: u.gender,
          userId: u._id,
          date: u.updatedAt || u.createdAt || new Date().toISOString(),
          isRead: true,
        });
      }

      items.push({
        id: `matched-profile-${u._id}`,
        type: "profile_update",
        category: "matches",
        title: "Matched Profile Activity",
        name: u.fullName || "Matched Member",
        description: `updated education & career information on their profile.`,
        avatar: getAvatar(u),
        gender: u.gender,
        userId: u._id,
        date: u.updatedAt || u.createdAt || new Date().toISOString(),
        isRead: true,
      });
    });

    items.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return items;
  } catch (error) {
    console.error("Error fetching notifications from API:", error);
    return [];
  }
};

export const markAllNotificationsReadApi = async () => {
  try {
    const token = localStorage.getItem("token");
    await Axios.patch(
      "/api/user/notifications/mark-read",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to mark notifications read on server", err);
  }
};

export const deleteNotificationApi = async (notificationId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!notificationId.includes("-")) {
      await Axios.delete(`/api/user/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.error("Failed to delete notification on server", err);
  }
};
