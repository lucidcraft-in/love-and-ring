import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  GraduationCap,
  Briefcase,
  Check,
  Lock,
  X,
  Sparkles,
  Eye,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OptimizedProfileImage from "./OptimizedProfileImage";
import FiltersModal from "./FiltersModal";
import Axios from "@/axios/axios";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";

interface MatchUser {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth: string;
  heightCm?: number;
  interests: string[];
  education?: { name: string };
  profession?: { name: string };
  city?: string;
  state?: string;
  profileStatus?: string;
  isMillionClub?: boolean;
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

const Matches = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [sentInterestMap, setSentInterestMap] = useState<Record<string, string>>({}); // targetUserId -> interestId
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [cancelingInterest, setCancelingInterest] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [myMatches, setMyMatches] = useState<MatchItem[]>([]); // Mutual / Accepted matches
  const [millionClubMatches, setMillionClubMatches] = useState<MatchItem[]>([]);
  const [millionClubUserIds, setMillionClubUserIds] = useState<Set<string>>(new Set());
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const checkMillionStatus = (userObj: any) => {
    if (!userObj) return false;
    const status = (userObj.profileStatus || "").toLowerCase();
    const planName = (userObj.membership?.plan?.name || "").toLowerCase();
    const isPlanMillion = userObj.membership?.plan?.millionClub === true;
    return status.includes("million") || planName.includes("million") || isPlanMillion === true || userObj.isMillionClub === true;
  };
  const checkMembershipStatus = (userObj: any) => {
    if (!userObj || !userObj.membership) return false;
    const plan = userObj.membership.plan;
    if (!plan) return false;
    const planName = typeof plan === "object" ? plan.name || plan.title || "" : String(plan);
    return !!planName && planName.toLowerCase() !== "free";
  };
  const [isCurrentMillionClubUser, setIsCurrentMillionClubUser] = useState<boolean>(() => checkMillionStatus(parsedUser));
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean>(() => checkMembershipStatus(parsedUser));
  const [loading, setLoading] = useState(false);
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likedByMe, setLikedByMe] = useState<MatchItem[]>([]);
  const [likedMe, setLikedMe] = useState<MatchItem[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<string[]>([]);
  const [acceptedInterests, setAcceptedInterests] = useState<string[]>([]);
  const [profileLimitReached, setProfileLimitReached] = useState(false);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);

  const navigate = useNavigate();
  const hasNRIPlan = false;

  const fetchProfilesILiked = async (): Promise<string[]> => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/profile-likes/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted: MatchItem[] = (res.data || [])
        .filter((item: any) => item && item.likedUser)
        .map((item: any) => ({
          user: {
            _id: item.likedUser._id,
            fullName: item.likedUser.fullName,
            dateOfBirth: item.likedUser.dateOfBirth,
            city: item.likedUser.city,
            state: item.likedUser.state,
            interests: item.likedUser.interests || [],
            education: item.likedUser.highestEducation
              ? { name: item.likedUser.highestEducation.name }
              : undefined,
            profession: item.likedUser.profession
              ? { name: item.likedUser.profession.name }
              : undefined,
            photos: item.likedUser.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
          liked: true,
        }));

      setLikedByMe(formatted);
      const ids = formatted.map((m) => m.user._id);
      setLikedUserIds(new Set(ids));
      return ids;
    } catch (err) {
      console.error("Failed to fetch profiles I liked", err);
      return [];
    }
  };

  const fetchProfilesWhoLikedMe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/user/profile-likes/received", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted: MatchItem[] = (res.data || [])
        .filter((item: any) => item && item.likedBy)
        .map((item: any) => ({
          user: {
            _id: item.likedBy._id,
            fullName: item.likedBy.fullName,
            dateOfBirth: item.likedBy.dateOfBirth,
            city: item.likedBy.city,
            state: item.likedBy.state,
            interests: item.likedBy.interests || [],
            education: item.likedBy.highestEducation
              ? { name: item.likedBy.highestEducation.name }
              : undefined,
            profession: item.likedBy.profession ? { name: item.likedBy.profession.name } : undefined,
            photos: item.likedBy.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
          liked: false,
        }));

      setLikedMe(formatted);
    } catch (err) {
      console.error("Failed to fetch profiles who liked me", err);
    }
  };

  const fetchMatches = async (likedIds: Set<string>) => {
    setLoading(true);
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
            interests: item.user.interests || [],
            education: item.user.highestEducation
              ? { name: item.user.highestEducation.name }
              : undefined,
            profession: item.user.profession
              ? { name: item.user.profession.name }
              : undefined,
            city: item.user.city,
            state: item.user.state,
            profileStatus: item.user.profileStatus,
            isMillionClub: item.user.profileStatus?.toLowerCase().includes("million"),
            photos: item.user.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
          liked: likedIds.has(item.user._id),
        }));

      setMatches(normalized);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const fetchMillionClubUsers = async (likedIds: Set<string>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/million-club/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = Array.isArray(res.data) ? res.data : [];
      const formatted: MatchItem[] = raw
        .filter((item: any) => item && item._id)
        .map((item: any) => ({
          user: {
            _id: item._id,
            fullName: item.fullName,
            gender: item.gender,
            dateOfBirth: item.dateOfBirth,
            heightCm: item.heightCm,
            interests: item.interests || [],
            education: item.highestEducation
              ? { name: item.highestEducation.name }
              : undefined,
            profession: item.profession
              ? { name: item.profession.name }
              : undefined,
            city: item.city,
            state: item.state,
            profileStatus: item.profileStatus || "Million Club",
            isMillionClub: true,
            photos: item.photos || [],
          },
          matchScore: 100,
          liked: likedIds.has(item._id),
        }));

      setMillionClubMatches(formatted);
      setMillionClubUserIds(new Set(raw.map((item: any) => String(item._id))));
    } catch (err) {
      console.error("Failed to fetch Million Club users", err);
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
        if (item.toUser?._id) {
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

      const ids = (res.data || []).map((item: any) => item.fromUser?._id).filter(Boolean);
      setReceivedInterests(ids);
    } catch (err) {
      console.error("Failed to fetch received interests", err);
    }
  };

  // ✅ 1. FIX: Fetch accepted interests to show in "My Matches" tab
  const fetchAcceptedInterests = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const currentUserId = storedUser ? JSON.parse(storedUser)._id : null;

      const res = await Axios.get("/api/user/interests/accepted/interest", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const acceptedList = res.data || [];
      const ids = acceptedList.map((item: any) => item.fromUser?._id).filter(Boolean);
      setAcceptedInterests(ids);

      // Format full profiles for "My Matches"
      const formattedMyMatches: MatchItem[] = acceptedList.map((item: any) => {
        const otherUser =
          String(item.fromUser?._id) === String(currentUserId)
            ? item.toUser
            : item.fromUser;

        return {
          user: {
            _id: otherUser?._id,
            fullName: otherUser?.fullName || "User",
            dateOfBirth: otherUser?.dateOfBirth,
            city: otherUser?.city,
            state: otherUser?.state,
            interests: otherUser?.interests || [],
            education: otherUser?.highestEducation
              ? { name: otherUser.highestEducation.name }
              : undefined,
            profession: otherUser?.profession
              ? { name: otherUser.profession.name }
              : undefined,
            photos: otherUser?.photos || [],
          },
          matchScore: item.matchPercentage ?? 100,
          liked: true,
        };
      });

      setMyMatches(formattedMyMatches);
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

      if (membership.chatProfilesUsed >= membership.chatProfilesLimit) {
        setProfileLimitReached(true);
      } else {
        setProfileLimitReached(false);
      }
    } catch (err) {
      console.error("Error checking profile limit:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const likedIdsArray = await fetchProfilesILiked();
        await fetchProfilesWhoLikedMe();
        await fetchSentInterests();
        await fetchReceivedInterests();
        await fetchAcceptedInterests();
        const likedSet = new Set(likedIdsArray);
        await fetchMatches(likedSet);
        await fetchMillionClubUsers(likedSet);
        await checkProfileLimit();
      } catch (err) {
        console.error("Error during matches initialization", err);
      }
    };

    init();
  }, []);

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
      if (gender === "female") return FemaleDummy;
      if (gender === "male") return MaleDummy;
      return DummyProfile;
    }
    return photos.find((p) => p.isPrimary)?.url || photos[0]?.url || DummyProfile;
  };

  const handleLikeProfile = async (targetUserId: string) => {
    const match = matches.find((m) => m.user._id === targetUserId);
    setLikingProfile(targetUserId);

    try {
      const token = localStorage.getItem("token");
      await Axios.post(
        `/api/user/profile-likes/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMatches((prev) =>
        prev.map((m) => (m.user._id === targetUserId ? { ...m, liked: true } : m))
      );
      setMillionClubMatches((prev) =>
        prev.map((m) => (m.user._id === targetUserId ? { ...m, liked: true } : m))
      );

      if (match) {
        setLikedByMe((prev) => {
          if (prev.some((m) => m.user._id === targetUserId)) return prev;
          return [{ ...match, liked: true }, ...prev];
        });
      }

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
        prev.map((m) => (m.user._id === targetUserId ? { ...m, liked: false } : m))
      );
      setMillionClubMatches((prev) =>
        prev.map((m) => (m.user._id === targetUserId ? { ...m, liked: false } : m))
      );

      setLikedByMe((prev) => prev.filter((m) => m.user._id !== targetUserId));
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

  const handleSendInterest = async (targetUserId: string, targetUserName: string) => {
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
        setSentInterestMap((prev) => ({ ...prev, [targetUserId]: createdInterestId }));
      }

      toast.success(`Interest sent to ${targetUserName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send interest");
    } finally {
      setSendingInterest(null);
    }
  };

  // ✅ 2. FIX: Added handleCancelInterest to retrieve/cancel sent interests directly
  const handleCancelInterest = async (targetUserId: string, targetUserName: string) => {
    const interestId = sentInterestMap[targetUserId];
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

      setSentInterests((prev) => prev.filter((id) => id !== targetUserId));
      setSentInterestMap((prev) => {
        const copy = { ...prev };
        delete copy[targetUserId];
        return copy;
      });

      toast.success(`Cancelled interest to ${targetUserName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel interest");
    } finally {
      setCancelingInterest(null);
    }
  };

  // ✅ 3. FIX: View profile handler calls API to record view in DB
  const handleViewProfile = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("token");

      // Record profile view in MongoDB
      const res = await Axios.get(`/api/membership/view-profile/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const MatchCard = ({ match, isNRI = false }: { match: MatchItem; isNRI?: boolean }) => {
    const isInterestSent = sentInterests.includes(match.user._id);
    const isSending = sendingInterest === match.user._id;
    const isCanceling = cancelingInterest === match.user._id;
    const isLocked = isNRI && !hasNRIPlan;
    const isLiking = likingProfile === match.user._id;
    const hasIncomingInterest = receivedInterests.includes(match.user._id);
    const isAccepted = acceptedInterests.includes(match.user._id);
    const isMillionClub = match.user.isMillionClub || match.user.profileStatus?.toLowerCase().includes("million") || millionClubUserIds.has(String(match.user._id)) || activeTab === "millionClub";
    const primaryPhoto = match.user.photos?.find((p) => p.isPrimary);
    const isPhotoHidden = primaryPhoto?.isHidden;
    const alreadyViewed = viewedProfiles.some((id) => String(id) === String(match.user._id));
    const lockedByLimit = profileLimitReached && !alreadyViewed;

    const canViewHiddenPhoto = false;

    const photoSrc = getProfilePhoto(match.user.photos, match.user.gender);

    return (
      <Card className="glass-card overflow-hidden hover:shadow-md md:hover:shadow-lg transition-all rounded-xl md:rounded-2xl border border-border/40">
        <div className="grid grid-cols-[90px_1fr] md:grid-cols-[160px_1fr] min-h-[145px] md:h-[240px]">
          {/* Image Section */}
          <div className="relative overflow-hidden bg-muted rounded-l-xl md:rounded-l-2xl">
            <OptimizedProfileImage
              src={photoSrc}
              alt={match.user.fullName}
              isLocked={isLocked}
              className={`w-full h-full object-cover ${isPhotoHidden && !canViewHiddenPhoto ? "blur-md" : ""
                }`}
            />

            <div className="absolute top-1 left-1 md:top-2 md:right-2 md:left-auto z-10">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-[9px] md:text-xs px-1 md:px-2 py-0 md:py-0.5">
                {match.matchScore}% Match
              </Badge>
            </div>

            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="bg-white/90 rounded-full p-2 md:p-4 shadow-lg">
                  <Lock className="w-4 h-4 md:w-8 md:h-8 text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2.5 md:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-start justify-between gap-1 mb-0.5 md:mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3 className="text-xs md:text-base font-bold truncate leading-tight">
                    {match.user.fullName}, {calculateAge(match.user.dateOfBirth)}
                  </h3>
                  {isMillionClub && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center justify-center p-1 bg-amber-500/10 rounded-full text-amber-500 hover:bg-amber-500/20 transition-colors cursor-pointer shrink-0">
                            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-none shadow-md font-semibold text-xs flex items-center gap-1 z-50">
                          <Crown className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Million Club Member</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {!isLocked && (
                  <Button
                    size="icon"
                    variant={match.liked ? "default" : "outline"}
                    className={`shrink-0 h-6 w-6 md:h-8 md:w-8 ${match.liked ? "bg-gradient-to-r from-primary to-secondary" : ""
                      }`}
                    disabled={isLiking}
                    onClick={() => {
                      if (match.liked) {
                        handleUnlikeProfile(match.user._id);
                      } else {
                        handleLikeProfile(match.user._id);
                      }
                    }}
                  >
                    {isLiking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.div>
                    ) : (
                      <Heart className={`w-3 h-3 md:w-4 md:h-4 ${match.liked ? "fill-white" : ""}`} />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-0.5 mt-0.5 md:mt-1 text-[11px] md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {match.user.city || "N/A"}{match.user.state ? `, ${match.user.state}` : ""}
                </span>
                <span className="hidden md:flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary/80" />
                  {match.user.education?.name || "—"}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {match.user.profession?.name || "—"}
                </span>
              </div>

              {match.user.interests && match.user.interests.length > 0 && (
                <div className="mt-1 md:mt-2">
                  <p className="hidden md:block text-xs font-semibold mb-1 text-foreground/80">Interests:</p>

                  {/* Mobile Interests (Compact) */}
                  <div className="flex md:hidden flex-wrap gap-1">
                    {match.user.interests.slice(0, 2).map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                        {interest}
                      </Badge>
                    ))}
                    {match.user.interests.length > 2 && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
                        +{match.user.interests.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Desktop Interests (Compact with count) */}
                  <div className="hidden md:flex flex-wrap gap-1.5 items-center">
                    {match.user.interests.slice(0, 3).map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                        {interest}
                      </Badge>
                    ))}
                    {match.user.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground font-normal">
                        +{match.user.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 pt-1 md:pt-1.5 border-t border-border/30">
              {isLocked ? (
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary text-[10px] md:text-xs h-7 md:h-8 px-2"
                  onClick={() => navigate("/pricing")}
                >
                  <Lock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  Upgrade
                </Button>
              ) : isAccepted ? (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    onClick={() => {
                      if (lockedByLimit) {
                        toast.error("Profile view limit reached. Upgrade your plan 🔒");
                        navigate("/pricing");
                        return;
                      }
                      handleViewProfile(match.user._id);
                    }}
                  >
                    {lockedByLimit ? (
                      <>
                        <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                        View Profile
                      </>
                    )}
                  </Button>
                  <Button
                    disabled
                    className="flex-1 bg-green-500 text-white cursor-default text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                  >
                    <Check className="w-3 h-3 mr-1" /> Matched
                  </Button>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  {hasIncomingInterest ? (
                    <Button
                      disabled
                      className="w-full bg-blue-500 text-white cursor-default text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    >
                      💌 Received
                    </Button>
                  ) : isInterestSent ? (
                    <Button
                      variant="outline"
                      className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                      onClick={() => handleCancelInterest(match.user._id, match.user.fullName)}
                      disabled={isCanceling}
                    >
                      {isCanceling ? (
                        "Canceling..."
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          <span>Cancel Sent Interest</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                      disabled={isSending}
                      onClick={() => handleSendInterest(match.user._id, match.user.fullName)}
                    >
                      {isSending ? "Sending..." : "Send Interest"}
                    </Button>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const isTargetMillionClubUser = (user: MatchUser) => {
    if (!user) return false;
    const status = (user.profileStatus || "").toLowerCase();
    return user.isMillionClub || status.includes("million") || millionClubUserIds.has(String(user._id));
  };

  const rawMatches = isCurrentMillionClubUser
    ? matches
    : matches.filter((m) => !isTargetMillionClubUser(m.user));

  // Filter out random matches (0% match score) when membership is added
  const displayedMatches = hasActiveMembership
    ? rawMatches.filter((m) => m.matchScore > 0)
    : rawMatches;

  const displayedMyMatches = isCurrentMillionClubUser
    ? myMatches
    : myMatches.filter((m) => !isTargetMillionClubUser(m.user));

  const displayedLikedByMe = isCurrentMillionClubUser
    ? likedByMe
    : likedByMe.filter((m) => !isTargetMillionClubUser(m.user));

  const displayedLikedMe = isCurrentMillionClubUser
    ? likedMe
    : likedMe.filter((m) => !isTargetMillionClubUser(m.user));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Finding your matches… 💜</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Matches</h2>
      </div>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(filters) => {
          toast.success("Filters applied successfully");
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="sticky top-16 lg:top-0 z-20 bg-[#fafafa]/95 dark:bg-background/95 backdrop-blur-md py-3 px-1 -mx-1 border-b border-border/40 overflow-x-auto scrollbar-hide lg:overflow-visible">
          <TabsList className="w-max lg:w-auto flex-nowrap">
            <TabsTrigger value="new">New Matches</TabsTrigger>
            <TabsTrigger value="all">My Matches ({displayedMyMatches.length})</TabsTrigger>
            <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
            {isCurrentMillionClubUser && (
              <TabsTrigger value="millionClub">Million Club Users ({millionClubMatches.length})</TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* TAB 1: NEW MATCHES */}
        <TabsContent value="new" className="mt-6">
          {displayedMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {displayedMatches.map((match) => (
                <MatchCard key={match.user._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Card className="glass-card p-12 text-center max-w-lg w-full">
                <p className="text-muted-foreground text-lg font-medium">No matches available.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Set your partner preference to find matches.
                </p>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: MY MATCHES (Mutually Accepted Connections) */}
        <TabsContent value="all" className="mt-6">
          {displayedMyMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedMyMatches.map((match) => (
                <MatchCard key={match.user._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Card className="glass-card p-12 text-center max-w-lg w-full">
                <p className="text-muted-foreground text-lg font-medium">No mutual matches yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Profiles where interests have been accepted will appear here.
                </p>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* TAB 3: LIKED PROFILES */}
        <TabsContent value="liked" className="mt-6 space-y-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">Profiles You’re Interested In ❤️</h3>
            {displayedLikedByMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedLikedByMe.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">You haven’t liked any profiles yet</p>
              </Card>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">People Who Showed Interest in You ✨</h3>
            {displayedLikedMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedLikedMe.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No one has liked your profile yet</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* TAB 4: MILLION CLUB USERS */}
        {isCurrentMillionClubUser && (
          <TabsContent value="millionClub" className="mt-6">
            {millionClubMatches.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {millionClubMatches.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[50vh]">
                <Card className="glass-card p-12 text-center max-w-lg w-full">
                  <p className="text-muted-foreground text-lg font-medium">No Million Club users found.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Subscribed Million Club members will appear here.
                  </p>
                </Card>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Matches;