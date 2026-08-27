import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  GraduationCap,
  Eye,
  Briefcase,
  Lock,
  Crown,
  Check,
  X,
  Ruler,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Axios from "@/axios/axios";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";
import OptimizedProfileImage from "@/components/dashboard/OptimizedProfileImage";

interface Profile {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  heightCm?: number;
  weightKg?: number;
  maritalStatus?: string;
  religion?: { name: string } | string;
  caste?: { name: string } | string;
  primaryEducation?: { name: string };
  education?: { name: string };
  profession?: { name: string };
  photos?: { url: string; isPrimary: boolean; isHidden?: boolean }[];
  profileStatus?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  approvalStatus?: string;
}

interface MasterOption {
  _id: string;
  name: string;
}

interface FilterState {
  religion: string;
  caste: string;
  maritalStatus: string;
  minAge: string;
  maxAge: string;
  minHeight: string;
  maxHeight: string;
  minWeight: string;
  maxWeight: string;
  city: string;
  primaryEducation: string;
  profession: string;
}

const initialFilterState: FilterState = {
  religion: "",
  caste: "",
  maritalStatus: "",
  minAge: "",
  maxAge: "",
  minHeight: "",
  maxHeight: "",
  minWeight: "",
  maxWeight: "",
  city: "",
  primaryEducation: "",
  profession: "",
};

const formatReligionCaste = (religion?: any, caste?: any) => {
  const relName = typeof religion === "object" ? religion?.name : religion;
  const casteName = typeof caste === "object" ? caste?.name : caste;
  if (relName && casteName) return `${relName}, ${casteName}`;
  return relName || casteName || "";
};

const formatHeightWeight = (heightCm?: number, weightKg?: number) => {
  const parts: string[] = [];
  if (heightCm) parts.push(`${heightCm} cm`);
  if (weightKg) parts.push(`${weightKg} kg`);
  return parts.join(" • ");
};

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const cached = sessionStorage.getItem("cached_browse_profiles");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [profileLimitReached, setProfileLimitReached] = useState(false);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<string[]>([]);
  const [acceptedInterests, setAcceptedInterests] = useState<string[]>([]);
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [sentInterestMap, setSentInterestMap] = useState<Record<string, string>>({});
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [cancelingInterest, setCancelingInterest] = useState<string | null>(null);

  // Master Data Options
  const [religions, setReligions] = useState<MasterOption[]>([]);
  const [castes, setCastes] = useState<MasterOption[]>([]);
  const [primaryEducations, setPrimaryEducations] = useState<MasterOption[]>([]);
  const [professions, setProfessions] = useState<MasterOption[]>([]);

  // Advance Filters State
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

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

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedUserId = loggedUser?._id;

  // Fetch Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [religionRes, primaryEduRes, professionRes] = await Promise.all([
          Axios.get("/api/master/religions", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/primaryEducations", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/occupations", { headers }).catch(() => ({ data: { data: [] } })),
        ]);

        setReligions(religionRes.data?.data || []);
        setPrimaryEducations(primaryEduRes.data?.data || []);
        setProfessions(professionRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load master data for filters", err);
      }
    };

    fetchMasterData();
  }, []);

  // Fetch Castes dynamically when Religion filter changes
  useEffect(() => {
    if (!filters.religion) {
      setCastes([]);
      return;
    }

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Axios.get(`/api/master/castes?religionId=${filters.religion}&religion=${filters.religion}`, { headers })
      .then((res) => {
        const rawCastes = res.data?.data || [];
        const filtered = rawCastes.filter((c: any) => {
          const cReligionId = typeof c.religion === "object" ? c.religion?._id : c.religion;
          return cReligionId === filters.religion;
        });
        setCastes(filtered);
      })
      .catch((err) => console.error("Failed to load castes for filter", err));
  }, [filters.religion]);

  const fetchProfiles = async (
    query: string = searchQuery,
    currentFilters: FilterState = appliedFilters
  ) => {
    if (profiles.length === 0) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      params.append("take", "100");
      params.append("skip", "0");

      if (query.trim()) {
        params.append("search", query.trim());
      }

      if (currentFilters.religion) params.append("religion", currentFilters.religion);
      if (currentFilters.caste) params.append("caste", currentFilters.caste);
      if (currentFilters.maritalStatus && currentFilters.maritalStatus !== "all") {
        params.append("maritalStatus", currentFilters.maritalStatus);
      }
      if (currentFilters.minAge) params.append("minAge", currentFilters.minAge);
      if (currentFilters.maxAge) params.append("maxAge", currentFilters.maxAge);
      if (currentFilters.minHeight) params.append("minHeight", currentFilters.minHeight);
      if (currentFilters.maxHeight) params.append("maxHeight", currentFilters.maxHeight);
      if (currentFilters.minWeight) params.append("minWeight", currentFilters.minWeight);
      if (currentFilters.maxWeight) params.append("maxWeight", currentFilters.maxWeight);
      if (currentFilters.city) params.append("city", currentFilters.city);
      if (currentFilters.primaryEducation && currentFilters.primaryEducation !== "all") {
        params.append("primaryEducation", currentFilters.primaryEducation);
      }
      if (currentFilters.profession && currentFilters.profession !== "all") {
        params.append("profession", currentFilters.profession);
      }

      const response = await Axios.get(`/api/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allProfiles = response.data || [];

      const filtered = allProfiles.filter(
        (profile: Profile) =>
          profile._id !== loggedUserId &&
          profile.isActive !== false &&
          profile.approvalStatus !== "INACTIVE"
      );

      setProfiles(filtered);
      try {
        sessionStorage.setItem("cached_browse_profiles", JSON.stringify(filtered));
      } catch {}
      console.log("Profiles:", response.data);
    } catch (error: any) {
      console.error("Error fetching profiles:", error?.response || error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced effect for Search and Filters (backend query)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProfiles(searchQuery, appliedFilters);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, appliedFilters]);

  const fetchProfilesILiked = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await Axios.get("/api/user/profile-likes/sent", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data.map((item: any) => item.likedUser._id);
      setLikedUserIds(new Set(ids));
    } catch (err) {
      console.error("Failed to fetch liked profiles", err);
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

      if (membership.chatProfilesUsed >= membership.chatProfilesLimit) {
        setProfileLimitReached(true);
      } else {
        setProfileLimitReached(false);
      }
    } catch (err) {
      console.error(err);
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
      console.error(err);
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

  const fetchAcceptedInterests = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = parsedUser?._id;

      const res = await Axios.get("/api/user/interests/accepted/interest", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = (res.data || []).map((item: any) => {
        return String(item.fromUser?._id) === String(currentUserId)
          ? item.toUser?._id
          : item.fromUser?._id;
      }).filter(Boolean);

      setAcceptedInterests(ids);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfilesILiked();
    checkProfileLimit();
    fetchReceivedInterests();
    fetchSentInterests();
    fetchAcceptedInterests();
  }, []);

  const calculateAge = (dob?: string) => {
    if (!dob) return "--";
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return "--";
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : "--";
  };

  const getProfileImage = (photos?: any[], gender?: string) => {
    if (!photos || photos.length === 0) {
      const g = (gender || "").toLowerCase();
      return (g === "female" || g === "lesbian") ? FemaleDummy : MaleDummy;
    }

    const primary = photos.find((p) => p.isPrimary);
    return primary?.url || photos[0]?.url || DummyProfile;
  };

  const getTargetGenders = (g?: string) => {
    if (!g) return [];
    const lower = g.toLowerCase();
    if (lower === "gay") return ["male", "gay"];
    if (lower === "lesbian") return ["female", "lesbian"];
    if (lower === "male") return ["female", "lesbian"];
    if (lower === "female") return ["male", "gay"];
    return [];
  };

  const filteredProfiles = profiles.filter((p) => {
    // If logged-in user is NOT a Million Club member, hide Million Club profiles
    if (!isCurrentMillionClubUser) {
      const status = (p.profileStatus || "").toLowerCase();
      if (status.includes("million")) return false;
    }

    // Gender filter check based on user preferences
    const targetGenders = getTargetGenders(loggedUser?.gender);
    if (targetGenders.length > 0 && p.gender) {
      const profileGender = p.gender.toLowerCase();
      if (!targetGenders.includes(profileGender)) return false;
    }

    if (showLikedOnly) {
      return likedUserIds.has(p._id);
    }

    return true;
  });

  const handleLikeProfile = async (userId: string) => {
    setLikingProfile(userId);
    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        `/api/user/profile-likes/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setLikedUserIds((prev) => new Set(prev).add(userId));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLikingProfile(null);
    }
  };

  const handleUnlikeProfile = async (userId: string) => {
    setLikingProfile(userId);
    try {
      const token = localStorage.getItem("token");

      await Axios.delete(`/api/user/profile-likes/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLikedUserIds((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    } catch (err: any) {
      console.error(err);
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

  const handleViewProfile = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("token");
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

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    const primaryPhoto = profile.photos?.find((p) => p.isPrimary);
    const isPhotoHidden = primaryPhoto?.isHidden;

    const alreadyViewed = viewedProfiles.some((id) => String(id) === String(profile._id));
    const lockedByLimit = profileLimitReached && !alreadyViewed;

    const canViewHiddenPhoto = false;

    const photoSrc = getProfileImage(profile.photos, profile.gender);
    const isLiking = likingProfile === profile._id;
    const isLiked = likedUserIds.has(profile._id);

    const isAccepted = acceptedInterests.includes(profile._id);
    const canViewProfile = isAccepted || alreadyViewed || hasActiveMembership;
    const isInterestSent = sentInterests.includes(profile._id);
    const hasIncomingInterest = receivedInterests.includes(profile._id);
    const isSending = sendingInterest === profile._id;
    const isCanceling = cancelingInterest === profile._id;

    return (
      <Card className="glass-card overflow-hidden hover:shadow-md md:hover:shadow-lg transition-all rounded-xl md:rounded-2xl border border-border/40">
        <div className="grid grid-cols-[90px_1fr] md:grid-cols-[160px_1fr] min-h-[145px] md:h-[240px]">
          {/* Image Section - Clickable to View Profile */}
          <div
            className={`relative overflow-hidden bg-muted rounded-l-xl md:rounded-l-2xl ${
              canViewProfile ? "cursor-pointer group" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!canViewProfile) {
                navigate("/pricing");
                return;
              }
              if (lockedByLimit) {
                toast.error("Profile view limit reached. Upgrade your plan 🔒");
                navigate("/pricing");
                return;
              }
              handleViewProfile(profile._id);
            }}
          >
            <OptimizedProfileImage
              src={photoSrc}
              alt={profile.fullName}
              isLocked={false}
              className={`w-full h-full object-cover ${
                canViewProfile ? "transition-transform duration-300 group-hover:scale-105" : ""
              } ${isPhotoHidden && !canViewHiddenPhoto ? "blur-md" : ""}`}
            />

            {/* Hover Overlay Hint */}
            {canViewProfile && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white/90 text-foreground text-[10px] md:text-xs px-2 py-1 rounded-full shadow font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3 text-primary" />
                  <span>View Profile</span>
                </div>
              </div>
            )}

            {profile.profileStatus === "private" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <Badge className="bg-white text-foreground text-[9px] md:text-xs">
                  Private Profile
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2.5 md:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-start justify-between gap-1 mb-0.5 md:mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3
                    className={`text-xs md:text-base font-bold truncate leading-tight ${
                      canViewProfile ? "cursor-pointer hover:text-primary transition-colors" : ""
                    }`}
                    onClick={() => {
                      if (!canViewProfile) return;
                      if (lockedByLimit) {
                        toast.error("Profile view limit reached. Upgrade your plan 🔒");
                        navigate("/pricing");
                        return;
                      }
                      handleViewProfile(profile._id);
                    }}
                  >
                    {profile.fullName},{" "}
                    {profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "--"}
                  </h3>
                  {profile.profileStatus?.toLowerCase().includes("million") && (
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

                <Button
                  size="icon"
                  variant={isLiked ? "default" : "outline"}
                  className={`shrink-0 h-6 w-6 md:h-8 md:w-8 ${isLiked ? "bg-gradient-to-r from-primary to-secondary text-white" : ""
                    }`}
                  disabled={isLiking}
                  onClick={() =>
                    isLiked
                      ? handleUnlikeProfile(profile._id)
                      : handleLikeProfile(profile._id)
                  }
                >
                  {isLiking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.div>
                  ) : (
                    <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isLiked ? "fill-white" : ""}`} />
                  )}
                </Button>
              </div>

              <div className="flex flex-col gap-0.5 md:gap-1 mt-0.5 md:mt-1 text-[11px] md:text-xs text-muted-foreground">
                {profile.maritalStatus && (
                  <span className="flex items-center gap-1 font-medium text-foreground/90 truncate">
                    <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                    {profile.maritalStatus}
                  </span>
                )}

                {(profile.heightCm || profile.weightKg) && (
                  <span className="flex items-center gap-1 truncate">
                    <Ruler className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                    {formatHeightWeight(profile.heightCm, profile.weightKg)}
                  </span>
                )}

                {(profile.religion || profile.caste) && (
                  <span className="flex items-center gap-1 truncate">
                    <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                    {formatReligionCaste(profile.religion, profile.caste)}
                  </span>
                )}

                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {profile.city || "Location not specified"}{profile.state ? `, ${profile.state}` : ""}
                </span>

                <span className="hidden md:flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary/80" />
                  {profile.primaryEducation?.name || profile.education?.name || "—"}
                </span>

                <span className="flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {profile.profession?.name || "Profession not specified"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 pt-1 md:pt-1.5 border-t border-border/30">
              {isAccepted ? (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-secondary gap-1.5 text-[10px] md:text-xs h-7 md:h-8 px-2"
                    onClick={() => {
                      if (lockedByLimit) {
                        toast.error("Profile view limit reached. Upgrade your plan 🔒");
                        navigate("/pricing");
                        return;
                      }
                      navigate(`/profile/${profile._id}`);
                    }}
                  >
                    {lockedByLimit ? (
                      <>
                        <Lock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
              ) : canViewProfile ? (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-secondary gap-1.5 text-[10px] md:text-xs h-7 md:h-8 px-2"
                    onClick={() => {
                      if (lockedByLimit) {
                        toast.error("Profile view limit reached. Upgrade your plan 🔒");
                        navigate("/pricing");
                        return;
                      }
                      handleViewProfile(profile._id);
                    }}
                  >
                    {lockedByLimit ? (
                      <>
                        <Lock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        Upgrade
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        View Profile
                      </>
                    )}
                  </Button>
                  {hasIncomingInterest ? (
                    <Button
                      disabled
                      className="flex-1 bg-blue-500 text-white cursor-default text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    >
                      💌 Received
                    </Button>
                  ) : isInterestSent ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                      onClick={() => handleCancelInterest(profile._id, profile.fullName)}
                      disabled={isCanceling}
                    >
                      {isCanceling ? "Canceling..." : "Cancel Interest"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                      disabled={isSending}
                      onClick={() => handleSendInterest(profile._id, profile.fullName)}
                    >
                      {isSending ? "Sending..." : "Send Interest"}
                    </Button>
                  )}
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
                      onClick={() => handleCancelInterest(profile._id, profile.fullName)}
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
                      onClick={() => handleSendInterest(profile._id, profile.fullName)}
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

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setIsFilterDialogOpen(false);
  };

  const activeFilterCount = Object.values(appliedFilters).filter(
    (v) => v !== "" && v !== "all"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse Profiles</h2>
      </div>

      {/* Search and Filter Section */}
      <Card className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant={showLikedOnly ? "default" : "outline"}
            className={`gap-2 ${showLikedOnly
                ? "bg-gradient-to-r from-primary to-secondary text-white"
                : ""
              }`}
            onClick={() => setShowLikedOnly(!showLikedOnly)}
          >
            <Heart className="w-4 h-4" />
            Liked Profiles
          </Button>

          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={activeFilterCount > 0 ? "default" : "outline"}
                className={`gap-2 ${
                  activeFilterCount > 0
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : ""
                }`}
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 bg-white text-primary text-xs px-1.5 py-0.5 font-bold rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between pr-6">
                  <span className="flex items-center gap-2 text-xl font-bold">
                    <Filter className="w-5 h-5 text-primary" />
                    Advanced Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={handleResetFilters}
                    >
                      Reset All
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {/* Age Range */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Age Range (Years)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      placeholder="Min Age"
                      type="number"
                      value={filters.minAge}
                      onChange={(e) => setFilters((f) => ({ ...f, minAge: e.target.value }))}
                    />
                    <Input
                      placeholder="Max Age"
                      type="number"
                      value={filters.maxAge}
                      onChange={(e) => setFilters((f) => ({ ...f, maxAge: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Marital Status</Label>
                  <Select
                    value={filters.maritalStatus || "all"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, maritalStatus: val }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Marital Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Marital Statuses</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Awaiting Divorce">Awaiting Divorce</SelectItem>
                      <SelectItem value="Annulled">Annulled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Height Range */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Height Range (cm)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      placeholder="Min Height (cm)"
                      type="number"
                      value={filters.minHeight}
                      onChange={(e) => setFilters((f) => ({ ...f, minHeight: e.target.value }))}
                    />
                    <Input
                      placeholder="Max Height (cm)"
                      type="number"
                      value={filters.maxHeight}
                      onChange={(e) => setFilters((f) => ({ ...f, maxHeight: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Weight Range */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Weight Range (kg)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      placeholder="Min Weight (kg)"
                      type="number"
                      value={filters.minWeight}
                      onChange={(e) => setFilters((f) => ({ ...f, minWeight: e.target.value }))}
                    />
                    <Input
                      placeholder="Max Weight (kg)"
                      type="number"
                      value={filters.maxWeight}
                      onChange={(e) => setFilters((f) => ({ ...f, maxWeight: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Religion</Label>
                  <Select
                    value={filters.religion || "all"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, religion: val === "all" ? "" : val, caste: "" }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Religions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Religions</SelectItem>
                      {religions.map((rel) => (
                        <SelectItem key={rel._id} value={rel._id}>
                          {rel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Caste */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Caste</Label>
                  <Select
                    disabled={!filters.religion || castes.length === 0}
                    value={filters.caste || "all"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, caste: val === "all" ? "" : val }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={!filters.religion ? "Select religion first" : "All Castes"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Castes</SelectItem>
                      {castes.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">City / Location</Label>
                  <Input
                    placeholder="Search by city..."
                    className="mt-1.5"
                    value={filters.city}
                    onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>

                {/* Education */}
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Education</Label>
                  <Select
                    value={filters.primaryEducation || "all"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, primaryEducation: val === "all" ? "" : val }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Educations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Educations</SelectItem>
                      {primaryEducations.map((edu) => (
                        <SelectItem key={edu._id} value={edu._id}>
                          {edu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Profession */}
                <div className="md:col-span-2">
                  <Label className="text-xs font-semibold text-foreground/90">Profession</Label>
                  <Select
                    value={filters.profession || "all"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, profession: val === "all" ? "" : val }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Professions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Professions</SelectItem>
                      {professions.map((prof) => (
                        <SelectItem key={prof._id} value={prof._id}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters(appliedFilters);
                    setIsFilterDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-secondary text-white font-medium"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filter Badges Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-border/30">
            <span className="text-xs font-medium text-muted-foreground">Active Filters:</span>
            {appliedFilters.minAge && <Badge variant="secondary" className="text-xs">Min Age: {appliedFilters.minAge}</Badge>}
            {appliedFilters.maxAge && <Badge variant="secondary" className="text-xs">Max Age: {appliedFilters.maxAge}</Badge>}
            {appliedFilters.maritalStatus && <Badge variant="secondary" className="text-xs">Status: {appliedFilters.maritalStatus}</Badge>}
            {appliedFilters.minHeight && <Badge variant="secondary" className="text-xs">Min Height: {appliedFilters.minHeight}cm</Badge>}
            {appliedFilters.maxHeight && <Badge variant="secondary" className="text-xs">Max Height: {appliedFilters.maxHeight}cm</Badge>}
            {appliedFilters.minWeight && <Badge variant="secondary" className="text-xs">Min Weight: {appliedFilters.minWeight}kg</Badge>}
            {appliedFilters.maxWeight && <Badge variant="secondary" className="text-xs">Max Weight: {appliedFilters.maxWeight}kg</Badge>}
            {appliedFilters.religion && (
              <Badge variant="secondary" className="text-xs">
                Religion: {religions.find((r) => r._id === appliedFilters.religion)?.name || "Selected"}
              </Badge>
            )}
            {appliedFilters.caste && (
              <Badge variant="secondary" className="text-xs">
                Caste: {castes.find((c) => c._id === appliedFilters.caste)?.name || "Selected"}
              </Badge>
            )}
            {appliedFilters.city && <Badge variant="secondary" className="text-xs">City: {appliedFilters.city}</Badge>}
            {appliedFilters.primaryEducation && (
              <Badge variant="secondary" className="text-xs">
                Education: {primaryEducations.find((e) => e._id === appliedFilters.primaryEducation)?.name || "Selected"}
              </Badge>
            )}
            {appliedFilters.profession && (
              <Badge variant="secondary" className="text-xs">
                Profession: {professions.find((p) => p._id === appliedFilters.profession)?.name || "Selected"}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[11px] text-destructive hover:bg-destructive/10 px-2"
              onClick={handleResetFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProfiles;
