import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Heart,
  Eye,
  Phone,
  MessageCircle,
  MapPin,
  GraduationCap,
  Briefcase,
  Check,
  Sparkles,
  Crown,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Bell,
  BadgeCheck,
  Sliders,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "@/axios/axios";
import { toast } from "sonner";
import socket from "@/socket";
import OptimizedProfileImage from "./OptimizedProfileImage";
import ProtectedProfileImage from "./ProtectedProfileImage";

import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";
import { fetchDashboardNotifications } from "@/services/notificationService";

interface SummaryData {
  pendingInvitations: number;
  acceptedInvitations: number;
  recentVisitors: number;
  contactViewed: number | null;
  chats: number | null;
}

interface MatchUser {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  religion?: { name: string } | string;
  caste?: { name: string } | string;
  interests?: string[];
  education?: { name: string };
  primaryEducation?: { name: string };
  profession?: { name: string };
  city?: string;
  state?: string;
  profileStatus?: string;
  isMillionClub?: boolean;
  emailVerified?: boolean;
  photos?: {
    url: string;
    isPrimary: boolean;
    isHidden?: boolean;
  }[];
}

interface MatchItem {
  user: MatchUser;
  matchScore: number;
  liked: boolean;
}

interface NotificationItem {
  id: string;
  type: "interest_received" | "message_received" | "photo_request" | "match_suggestion";
  title: string;
  senderName?: string;
  senderPhoto?: string;
  senderGender?: string;
  senderId?: string;
  description: string;
  timestamp: string;
  rawDate: Date;
}

interface SummaryProps {
  onNavigate?: (tab: string) => void;
}

const formatRelativeTime = (dateInput?: string | Date) => {
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
  return `${diffDays} days ago`;
};

const Summary = ({ onNavigate }: SummaryProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const checkMillionStatus = (userObj: any) => {
    if (!userObj) return false;
    const status = (userObj.profileStatus || "").toLowerCase();
    const planName = (userObj.membership?.plan?.name || "").toLowerCase();
    const isPlanMillion = userObj.membership?.plan?.millionClub === true;
    return (
      status.includes("million") ||
      planName.includes("million") ||
      isPlanMillion === true ||
      userObj.isMillionClub === true
    );
  };

  const checkMembershipStatus = (userObj: any) => {
    if (!userObj || !userObj.membership) return false;
    const plan = userObj.membership.plan;
    if (!plan) return false;
    const planName =
      typeof plan === "object"
        ? plan.name || plan.title || ""
        : String(plan);
    return !!planName && planName.toLowerCase() !== "free";
  };

  const [isPremium, setIsPremium] = useState<boolean>(() => checkMembershipStatus(parsedUser));
  const [isCurrentMillionClubUser, setIsCurrentMillionClubUser] = useState<boolean>(() => checkMillionStatus(parsedUser));
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean>(() => checkMembershipStatus(parsedUser));

  // Match list & interactions states
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [hasPreferences, setHasPreferences] = useState<boolean>(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [sentInterestMap, setSentInterestMap] = useState<Record<string, string>>({}); // targetUserId -> interestId
  const [receivedInterests, setReceivedInterests] = useState<string[]>([]);
  const [acceptedInterests, setAcceptedInterests] = useState<string[]>([]);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);
  const [profileLimitReached, setProfileLimitReached] = useState(false);

  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [cancelingInterest, setCancelingInterest] = useState<string | null>(null);

  // Notifications states
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePremiumFeature = () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
    }
  };

  const handleCardClick = (cardTitle: string) => {
    if (cardTitle === "Chats") {
      if (onNavigate) {
        onNavigate("chat");
      } else {
        navigate("/dashboard?tab=chat");
      }
    } else if (cardTitle === "Accepted Invitations") {
      localStorage.setItem("activeMatchesTab", "all");
      if (onNavigate) {
        onNavigate("matches");
      } else {
        navigate("/dashboard?tab=matches");
      }
    } else if (cardTitle === "Pending Invitations") {
      localStorage.setItem("activeInterestsTab", "received");
      if (onNavigate) {
        onNavigate("interests");
      } else {
        navigate("/dashboard?tab=interests");
      }
    } else if (cardTitle === "Recent Visitors") {
      localStorage.setItem("activeMatchesTab", "new");
      if (onNavigate) {
        onNavigate("matches");
      } else {
        navigate("/dashboard?tab=matches");
      }
    }
  };

  const fetchSummaryData = async () => {
    setLoadingSummary(true);
    try {
      const token = localStorage.getItem("token");
      const response = await Axios.get("/api/user/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchProfilesILiked = async (): Promise<string[]> => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/profile-likes/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = (res.data || [])
        .filter((item: any) => item && item.likedUser)
        .map((item: any) => item.likedUser._id);
      setLikedUserIds(new Set(ids));
      return ids;
    } catch (err) {
      console.error("Failed to fetch profiles I liked", err);
      return [];
    }
  };

  const fetchSentInterests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/interests/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const map: Record<string, string> = {};
      const ids: string[] = [];
      (res.data || []).forEach((item: any) => {
        if (item.toUser?._id && (item.status === "PENDING" || !item.status)) {
          map[item.toUser._id] = item._id;
          ids.push(item.toUser._id);
        }
      });
      setSentInterestMap(map);
      setSentInterests(ids);
    } catch (err) {
      console.error("Failed to fetch sent interests", err);
    }
  };

  const fetchReceivedInterests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/interests/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = (res.data || [])
        .filter((item: any) => item.status === "PENDING" || !item.status)
        .map((item: any) => item.fromUser?._id)
        .filter(Boolean);
      setReceivedInterests(ids);
    } catch (err) {
      console.error("Failed to fetch received interests", err);
    }
  };

  const fetchAcceptedInterests = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const currentUserId = storedUser ? JSON.parse(storedUser)._id : null;
      const res = await Axios.get("/api/user/interests/accepted/interest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = (res.data || [])
        .map((item: any) => {
          const otherUser =
            String(item.fromUser?._id) === String(currentUserId)
              ? item.toUser
              : item.fromUser;
          return otherUser?._id;
        })
        .filter(Boolean);
      setAcceptedInterests(ids);
    } catch (err) {
      console.error("Failed to fetch accepted interests", err);
    }
  };

  const checkProfileLimit = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (!storedUser || !token) return;
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id;
      const res = await Axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const membership = res.data.membership || {};
      const rawViewed = membership.viewedProfiles || [];
      const formattedViewed = rawViewed.map((v: any) =>
        typeof v === "object" && v !== null ? String(v._id || v) : String(v)
      );
      setViewedProfiles(formattedViewed);
      setIsCurrentMillionClubUser(checkMillionStatus(res.data));
      setHasActiveMembership(checkMembershipStatus(res.data));
      setIsPremium(checkMembershipStatus(res.data));
      if (membership.chatProfilesUsed >= membership.chatProfilesLimit) {
        setProfileLimitReached(true);
      } else {
        setProfileLimitReached(false);
      }
    } catch (err) {
      console.error("Error checking profile limit:", err);
    }
  };

  const checkPartnerPreferences = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const response = await Axios.get("/api/user/partner-preferences/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      if (!data) return false;

      // Determine if partner preferences are configured
      const hasReligions = Array.isArray(data.religions) && data.religions.length > 0;
      const hasEducation = Array.isArray(data.educationLevels) && data.educationLevels.length > 0;
      const hasInterests = Array.isArray(data.interests) && data.interests.length > 0;
      const hasAgeRange = !!(data.ageRange && (data.ageRange.min !== undefined || data.ageRange.max !== undefined));
      const hasHeightRange = !!(data.heightRangeCm && (data.heightRangeCm.min !== undefined || data.heightRangeCm.max !== undefined));
      const hasMaritalStatus = Array.isArray(data.maritalStatuses) && data.maritalStatuses.length > 0;
      const hasLocations = Array.isArray(data.locations) && data.locations.length > 0;

      return hasReligions || hasEducation || hasInterests || hasAgeRange || hasHeightRange || hasMaritalStatus || hasLocations;
    } catch (err) {
      console.error("Failed to check partner preferences", err);
      return false;
    }
  };

  const fetchMatches = async (likedIds: Set<string>) => {
    setLoadingMatches(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = Array.isArray(res.data?.data) ? res.data.data : [];
      const normalized: MatchItem[] = raw
        .filter((item: any) => item && item.user)
        .map((item: any) => ({
          user: {
            _id: item.user._id,
            fullName: item.user.fullName,
            dateOfBirth: item.user.dateOfBirth,
            heightCm: item.user.heightCm,
            weightKg: item.user.weightKg,
            maritalStatus: item.user.maritalStatus,
            religion: item.user.religion,
            caste: item.user.caste,
            interests: item.user.interests || [],
            education:
              item.user.primaryEducation ||
              item.user.highestEducation ||
              item.user.education
                ? {
                    name: (
                      item.user.primaryEducation ||
                      item.user.highestEducation ||
                      item.user.education
                    ).name,
                  }
                : undefined,
            profession: item.user.profession
              ? { name: item.user.profession.name }
              : undefined,
            city: item.user.city,
            state: item.user.state,
            profileStatus: item.user.profileStatus,
            isMillionClub: item.user.profileStatus
              ?.toLowerCase()
              .includes("million"),
            emailVerified: item.user.emailVerified,
            photos: item.user.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
          liked: likedIds.has(item.user._id),
        }));
      setMatches(normalized);
    } catch (err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await fetchDashboardNotifications();
      const mapped: NotificationItem[] = data.map((item) => ({
        id: item.id,
        type: "interest_received",
        title: item.title,
        senderName: item.name,
        senderPhoto: item.avatar,
        senderGender: item.gender,
        senderId: item.userId,
        description: item.description,
        timestamp: formatRelativeTime(item.date),
        rawDate: item.date ? new Date(item.date) : new Date(),
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Error fetching notifications data:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleLikeProfile = async (targetUserId: string) => {
    setLikingProfile(targetUserId);
    try {
      const token = localStorage.getItem("token");
      await Axios.post(
        `/api/user/profile-likes/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches((prev) =>
        prev.map((m) =>
          m.user._id === targetUserId ? { ...m, liked: true } : m
        )
      );
      setLikedUserIds((prev) => new Set(prev).add(targetUserId));
      toast.success("Profile liked ❤️");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to like profile");
    } finally {
      setLikingProfile(null);
    }
  };

  const handleUnlikeProfile = async (targetUserId: string) => {
    setLikingProfile(targetUserId);
    try {
      const token = localStorage.getItem("token");
      await Axios.delete(`/api/user/profile-likes/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches((prev) =>
        prev.map((m) =>
          m.user._id === targetUserId ? { ...m, liked: false } : m
        )
      );
      setLikedUserIds((prev) => {
        const updated = new Set(prev);
        updated.delete(targetUserId);
        return updated;
      });
      toast.success("Profile unliked");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to unlike profile");
    } finally {
      setLikingProfile(null);
    }
  };

  const handleSendInterest = async (
    targetUserId: string,
    targetUserName: string
  ) => {
    if (sentInterests.includes(targetUserId)) return;
    setSendingInterest(targetUserId);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.post(
        `/api/user/interests/${targetUserId}/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdInterestId = res.data?._id;
      setSentInterests((prev) => [...prev, targetUserId]);
      if (createdInterestId) {
        setSentInterestMap((prev) => ({
          ...prev,
          [targetUserId]: createdInterestId,
        }));
      }
      toast.success(`Interest sent to ${targetUserName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send interest");
    } finally {
      setSendingInterest(null);
    }
  };

  const handleCancelInterest = async (
    targetUserId: string,
    targetUserName: string
  ) => {
    const interestId = sentInterestMap[targetUserId];
    const targetIdCopy = targetUserId;
    setCancelingInterest(targetUserId);
    try {
      const token = localStorage.getItem("token");
      if (interestId) {
        await Axios.post(
          `/api/user/interests/${interestId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSentInterests((prev) => prev.filter((id) => id !== targetIdCopy));
      setSentInterestMap((prev) => {
        const copy = { ...prev };
        delete copy[targetIdCopy];
        return copy;
      });
      toast.success(`Cancelled interest to ${targetUserName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel interest");
    } finally {
      setCancelingInterest(null);
    }
  };

  const handleViewProfile = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get(
        `/api/membership/view-profile/${targetUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.limitReached) {
        setProfileLimitReached(true);
        toast.error("Profile view limit reached. Upgrade your plan 🔒");
        navigate("/pricing");
        return;
      }
      await checkProfileLimit();
      navigate(`/profile/${targetUserId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile view limit reached");
      await checkProfileLimit();
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getProfilePhoto = (photos?: any[], gender?: string) => {
    if (!photos || photos.length === 0) {
      const g = (gender || "").toLowerCase();
      if (g === "female" || g === "lesbian") return FemaleDummy;
      if (g === "male" || g === "gay") return MaleDummy;
      return DummyProfile;
    }
    return (
      photos.find((p) => p.isPrimary)?.url || photos[0]?.url || DummyProfile
    );
  };

  const formatReligionCaste = (religion?: any, caste?: any) => {
    const relName = typeof religion === "object" ? religion?.name : religion;
    const casteName = typeof caste === "object" ? caste?.name : caste;
    if (relName && casteName) return `${relName}, ${casteName}`;
    return relName || casteName || "";
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    fetchSummaryData();
    fetchNotifications();

    const initMatches = async () => {
      setLoadingPreferences(true);
      try {
        const isConfigured = await checkPartnerPreferences();
        setHasPreferences(isConfigured);
        setLoadingPreferences(false);

        // Fetch other interaction maps needed regardless of match list loading
        const [likedIdsArray] = await Promise.all([
          fetchProfilesILiked(),
          fetchSentInterests(),
          fetchReceivedInterests(),
          fetchAcceptedInterests(),
          checkProfileLimit(),
        ]);

        if (isConfigured) {
          const likedSet = new Set(likedIdsArray);
          await fetchMatches(likedSet);
        }
      } catch (err) {
        console.error("Error initializing matches in Summary", err);
        setLoadingPreferences(false);
      }
    };
    initMatches();

    const handleInterestChanged = () => {
      fetchSentInterests();
      fetchReceivedInterests();
      fetchAcceptedInterests();
    };

    socket.on("interest-status-changed", handleInterestChanged);
    return () => {
      socket.off("interest-status-changed", handleInterestChanged);
    };
  }, []);

  const summaryCards: {
    title: string;
    count: number;
    icon: any;
    color: string;
    premium?: boolean;
  }[] = [
    {
      title: "Pending Invitations",
      count: summaryData?.pendingInvitations ?? 0,
      icon: Heart,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Accepted Invitations",
      count: summaryData?.acceptedInvitations ?? 0,
      icon: Heart,
      color: "from-primary to-secondary",
    },
    {
      title: "Recent Visitors",
      count: summaryData?.recentVisitors ?? 0,
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Chats",
      count: summaryData?.chats ?? 0,
      icon: MessageCircle,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const isTargetMillionClubUser = (user: MatchUser) => {
    if (!user) return false;
    const status = (user.profileStatus || "").toLowerCase();
    return (
      user.isMillionClub ||
      status.includes("million")
    );
  };

  const rawMatches = isCurrentMillionClubUser
    ? matches
    : matches.filter((m) => !isTargetMillionClubUser(m.user));

  const displayedMatches = hasActiveMembership
    ? rawMatches.filter((m) => m.matchScore > 0)
    : rawMatches;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Area: Summary Cards and Matches Scroll */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Summary</h2>

            {/* Grid display: 1 Row on Desktop, 2/4 cols on tablet/mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 lg:gap-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                const isLocked = card.premium && !isPremium;

                return (
                  <Card
                    key={card.title}
                    className="glass-card p-3 md:p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between min-h-[110px] md:min-h-[130px] rounded-xl border border-border/40"
                    onClick={() => handleCardClick(card.title)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.07]`}
                    />
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5 text-primary shrink-0" />
                        {isLocked && (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold leading-none mb-1">
                          {isLocked ? "••" : card.count}
                        </h3>
                        <p className="text-[10px] md:text-xs text-muted-foreground leading-tight line-clamp-2">
                          {card.title}
                        </p>
                      </div>
                      {isLocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full text-[9px] md:text-[10px] h-6 px-1 py-0 border-primary/20 hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePremiumFeature();
                          }}
                        >
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Matches for You Carousel Section */}
          <div className="glass-card p-5 md:p-6 rounded-2xl border border-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">Matches for You</h3>
                {hasPreferences && !loadingPreferences && (
                  <p className="text-xs text-muted-foreground">Handpicked profiles curated just for you</p>
                )}
              </div>
              {hasPreferences && !loadingPreferences && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary-foreground hover:bg-primary font-semibold text-xs md:text-sm flex items-center gap-1.5 px-3 py-1.5"
                    onClick={() => onNavigate && onNavigate("matches")}
                  >
                    <span>View All</span>
                    <span>→</span>
                  </Button>
                  <div className="hidden sm:flex items-center gap-1.5 border-l pl-3 ml-1 border-border/60">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full shadow-sm hover:bg-muted"
                      onClick={() => scroll("left")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full shadow-sm hover:bg-muted"
                      onClick={() => scroll("right")}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {loadingPreferences ? (
              <div className="flex flex-col justify-center items-center py-16 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-muted-foreground text-sm font-medium">Checking your preferences... 💜</p>
              </div>
            ) : !hasPreferences ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4 rounded-2xl bg-muted/15 border border-dashed border-border/60">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sliders className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-base font-bold text-foreground">Set Your Partner Preferences</h4>
                  <p className="text-xs text-muted-foreground">
                    Tell us what you're looking for in a partner. We'll use your preferences to find and recommend compatible profiles for you.
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-md hover:opacity-95 transition-all text-xs px-5 py-2 flex items-center gap-2"
                  onClick={() => onNavigate && onNavigate("partner-preference")}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Set Partner Preferences</span>
                </Button>
              </div>
            ) : loadingMatches ? (
              <div className="flex justify-center items-center py-16">
                <p className="text-muted-foreground text-sm">Finding matches… 💜</p>
              </div>
            ) : displayedMatches.length > 0 ? (
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              >
                {displayedMatches.map((match) => {
                  const isInterestSent = sentInterests.includes(match.user._id);
                  const isSending = sendingInterest === match.user._id;
                  const isCanceling = cancelingInterest === match.user._id;
                  const hasIncomingInterest = receivedInterests.includes(match.user._id);
                  const isAccepted = acceptedInterests.includes(match.user._id);
                  const alreadyViewed = viewedProfiles.some((id) => String(id) === String(match.user._id));
                  const canViewProfile = isAccepted || alreadyViewed || isPremium;
                  const isMillionClub = match.user.isMillionClub || match.user.profileStatus?.toLowerCase().includes("million");
                  const primaryPhoto = match.user.photos?.find((p) => p.isPrimary);
                  const isPhotoHidden = primaryPhoto?.isHidden;
                  const lockedByLimit = profileLimitReached && !alreadyViewed;
                  const isLiking = likingProfile === match.user._id;
                  const isVerified = !!match.user.emailVerified || match.user.profileStatus === "verified" || match.user.profileStatus === "COMPLETED";

                  const photoSrc = getProfilePhoto(match.user.photos, match.user.gender);

                  return (
                    <Card
                      key={match.user._id}
                      className="w-[240px] sm:w-[260px] md:w-[270px] shrink-0 snap-start glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl border border-border/40 flex flex-col h-[460px] relative group"
                    >
                      {/* Image section */}
                      <div
                        className="relative h-[225px] w-full overflow-hidden bg-muted shrink-0 cursor-pointer"
                        onClick={() => {
                          if (!canViewProfile) {
                            setShowUpgradeModal(true);
                            return;
                          }
                          if (lockedByLimit) {
                            toast.error("Profile view limit reached. Upgrade your plan 🔒");
                            navigate("/pricing");
                            return;
                          }
                          handleViewProfile(match.user._id);
                        }}
                      >
                        <OptimizedProfileImage
                          src={photoSrc}
                          alt={match.user.fullName}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPhotoHidden ? "blur-md" : ""}`}
                        />

                        {/* Subtle bottom gradient inside the image area */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />

                        {/* Match Score Badge & Premium Overlays */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                          <Badge className="bg-gradient-to-r from-primary to-secondary text-[10px] text-white px-2.5 py-0.5 shadow-sm font-semibold border-none rounded-full">
                            {match.matchScore}% Match
                          </Badge>
                          {isMillionClub && (
                            <Badge className="bg-amber-500 text-white text-[9px] px-2 py-0.5 shadow-sm font-bold border-none rounded-full flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 fill-white text-white" />
                              <span>Premium</span>
                            </Badge>
                          )}
                        </div>

                        {/* Like Heart Button */}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-3 right-3 rounded-full h-8 w-8 bg-white/95 hover:bg-white hover:scale-110 text-primary shadow-md z-10 transition-all duration-200 flex items-center justify-center border-none"
                          disabled={isLiking}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (match.liked) {
                              handleUnlikeProfile(match.user._id);
                            } else {
                              handleLikeProfile(match.user._id);
                            }
                          }}
                        >
                          {isLiking ? (
                            <div className="animate-spin text-primary">
                              <Heart className="w-4 h-4 fill-primary text-primary" />
                            </div>
                          ) : (
                            <Heart className={`w-4 h-4 transition-transform duration-200 ${match.liked ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
                          )}
                        </Button>

                        {/* Visual indicator for Verified / New */}
                        {isVerified && (
                          <div className="absolute bottom-3 left-3 z-20 bg-blue-500/20 backdrop-blur-md text-blue-200 text-[9px] px-2 py-0.5 rounded-full border border-blue-400/30 font-semibold shadow-sm">
                            Verified Member
                          </div>
                        )}
                      </div>

                      {/* Info & Details Section */}
                      <div className="p-4 flex-1 flex flex-col justify-between min-h-0">
                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          {/* Name + Age */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4
                                className="text-base font-bold truncate leading-tight text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                                onClick={() => {
                                  if (!canViewProfile) {
                                    setShowUpgradeModal(true);
                                    return;
                                  }
                                  if (lockedByLimit) {
                                    toast.error("Profile view limit reached. Upgrade your plan 🔒");
                                    navigate("/pricing");
                                    return;
                                  }
                                  handleViewProfile(match.user._id);
                                }}
                              >
                                {match.user.fullName}, {calculateAge(match.user.dateOfBirth)}
                              </h4>
                              {isVerified && (
                                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10 shrink-0" />
                              )}
                            </div>
                          </div>

                          {/* Detail Rows */}
                          <div className="space-y-1.5 text-xs text-muted-foreground flex flex-col justify-center">
                            {match.user.maritalStatus && (
                              <span className="flex items-center gap-2 font-medium text-foreground/90 truncate">
                                <Heart className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{match.user.maritalStatus}</span>
                              </span>
                            )}

                            {(match.user.religion || match.user.caste) && (
                              <span className="flex items-center gap-2 truncate">
                                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{formatReligionCaste(match.user.religion, match.user.caste)}</span>
                              </span>
                            )}

                            {(match.user.city || match.user.state) && (
                              <span className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{match.user.city || "N/A"}{match.user.state ? `, ${match.user.state}` : ""}</span>
                              </span>
                            )}

                            {match.user.profession?.name && (
                              <span className="flex items-center gap-2 truncate">
                                <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{match.user.profession.name}</span>
                              </span>
                            )}
                          </div>

                          {/* Compatibility Progress Bar */}
                          <div className="space-y-1 my-1 shrink-0">
                            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                              <span>Compatibility</span>
                              <span className="gradient-text font-bold">{match.matchScore}% Match</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted dark:bg-muted/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                                style={{ width: `${match.matchScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/20 shrink-0">
                          {canViewProfile ? (
                            <>
                              <Button
                                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white text-xs h-9 rounded-full font-semibold hover:opacity-95 hover:-translate-y-0.5 shadow-md active:translate-y-0 transition-all"
                                onClick={() => {
                                  if (lockedByLimit) {
                                    toast.error("Profile view limit reached. Upgrade your plan 🔒");
                                    navigate("/pricing");
                                    return;
                                  }
                                  handleViewProfile(match.user._id);
                                }}
                              >
                                View Profile
                              </Button>
                              {isAccepted ? (
                                <Button
                                  disabled
                                  className="flex-1 bg-green-500 text-white text-xs h-9 rounded-full font-semibold"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" /> Matched
                                </Button>
                              ) : hasIncomingInterest ? (
                                <Button
                                  disabled
                                  className="flex-1 bg-blue-500 text-white text-xs h-9 rounded-full font-semibold"
                                >
                                  Received
                                </Button>
                              ) : isInterestSent ? (
                                <Button
                                  variant="outline"
                                  className="flex-1 border-amber-500 text-amber-600 text-xs h-9 rounded-full hover:bg-amber-50 hover:-translate-y-0.5 active:translate-y-0 font-semibold transition-all"
                                  onClick={() => handleCancelInterest(match.user._id, match.user.fullName)}
                                  disabled={isCanceling}
                                >
                                  {isCanceling ? "..." : "Cancel"}
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="flex-1 border-primary/40 text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 active:translate-y-0 text-xs h-9 rounded-full font-semibold transition-all"
                                  disabled={isSending}
                                  onClick={() => handleSendInterest(match.user._id, match.user.fullName)}
                                >
                                  {isSending ? "..." : "Interest"}
                                </Button>
                              )}
                            </>
                          ) : (
                            /* Non-premium users only get the Send Interest button */
                            hasIncomingInterest ? (
                              <Button
                                disabled
                                className="w-full bg-blue-500 text-white text-xs h-9 rounded-full font-semibold"
                              >
                                Received
                              </Button>
                            ) : isInterestSent ? (
                              <Button
                                variant="outline"
                                className="w-full border-amber-500 text-amber-600 text-xs h-9 rounded-full hover:bg-amber-50 hover:-translate-y-0.5 active:translate-y-0 font-semibold transition-all"
                                onClick={() => handleCancelInterest(match.user._id, match.user.fullName)}
                                disabled={isCanceling}
                              >
                                {isCanceling ? "..." : "Cancel Sent Interest"}
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 text-xs h-9 rounded-full font-semibold transition-all shadow-md"
                                disabled={isSending}
                                onClick={() => handleSendInterest(match.user._id, match.user.fullName)}
                              >
                                {isSending ? "Sending..." : "Send Interest"}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 glass-card rounded-xl">
                <p className="text-muted-foreground text-sm font-medium">No matches available right now.</p>
                <Button
                  variant="link"
                  className="text-xs text-primary mt-1 font-semibold"
                  onClick={() => onNavigate && onNavigate("browse")}
                >
                  Browse all profiles
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Notifications Panel */}
        <div className="lg:col-span-1 glass-card p-5 md:p-6 rounded-2xl border border-border/40 flex flex-col lg:h-[590px] justify-between space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/30 shrink-0">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
          </div>

          {loadingNotifications ? (
            <div className="py-12 text-center text-muted-foreground text-sm flex-1">
              Loading feed...
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-hide min-h-0">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex gap-3 text-left p-2 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-border/60 bg-muted">
                    <ProtectedProfileImage
                      src={notif.senderPhoto}
                      alt={notif.senderName || "System"}
                      className="h-full w-full object-cover"
                      showWatermark={false}
                      onError={(e) => {
                        e.currentTarget.src = DummyProfile;
                      }}
                    />
                  </div>

                  {/* Text details */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold text-foreground truncate">
                        {notif.title}
                      </span>
                      <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">
                        {notif.timestamp}
                      </span>
                    </div>
                    {notif.senderName && (
                      <div className="text-[10px] font-semibold text-primary">
                        from {notif.senderName}
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground leading-normal mt-0.5 line-clamp-3">
                      {notif.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm flex-1">
              All caught up! 🎉
            </div>
          )}

          <Button
            variant="outline"
            className="w-full text-xs font-semibold mt-2 border-primary/40 text-primary hover:bg-primary hover:text-white shrink-0"
            onClick={() => onNavigate && onNavigate("notifications")}
          >
            View All Notifications
          </Button>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription className="text-base">
              Unlock exclusive features to find your perfect match faster!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  View contact details of profiles
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Unlimited messaging with matches
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  See who viewed your profile
                </li>
              </ul>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary font-semibold"
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/pricing");
              }}
            >
              Choose a Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Summary;
