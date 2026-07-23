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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import OptimizedProfileImage from "./OptimizedProfileImage";
import FiltersModal from "./FiltersModal";
import Axios from "@/axios/axios";

interface MatchUser {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  heightCm?: number;
  interests: string[];
  education?: { name: string };
  profession?: { name: string };
  city?: string;
  state?: string;
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
      setViewedProfiles(membership.viewedProfiles || []);

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
        await fetchMatches(new Set(likedIdsArray));
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

  const getProfilePhoto = (photos?: any[]) => {
    if (!photos || photos.length === 0) return "/placeholder-user.jpg";
    return photos.find((p) => p.isPrimary)?.url || photos[0].url;
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
    const primaryPhoto = match.user.photos?.find((p) => p.isPrimary);
    const isPhotoHidden = primaryPhoto?.isHidden;
    const alreadyViewed = viewedProfiles.includes(match.user._id);
    const lockedByLimit = profileLimitReached && !alreadyViewed;

    const canViewHiddenPhoto =
      acceptedInterests.includes(match.user._id) ||
      receivedInterests.includes(match.user._id);

    const photoSrc = getProfilePhoto(match.user.photos);

    return (
      <Card className="glass-card overflow-hidden hover:shadow-lg transition-all rounded-2xl">
        <div className="grid grid-cols-[160px_1fr] h-[270px]">
          {/* Image Section */}
          <div className="relative overflow-hidden bg-muted rounded-l-2xl">
            <OptimizedProfileImage
              src={photoSrc}
              alt={match.user.fullName}
              isLocked={isLocked}
              className={`w-full h-full object-cover ${
                isPhotoHidden && !canViewHiddenPhoto ? "blur-md" : ""
              }`}
            />

            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-xs">
                {match.matchScore}% Match
              </Badge>
            </div>

            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="bg-white/90 rounded-full p-4 shadow-lg">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold truncate">
                  {match.user.fullName}, {calculateAge(match.user.dateOfBirth)}
                </h3>
                {!isLocked && (
                  <Button
                    size="icon"
                    variant={match.liked ? "default" : "outline"}
                    className={`shrink-0 h-8 w-8 ${
                      match.liked ? "bg-gradient-to-r from-primary to-secondary" : ""
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
                        <Heart className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Heart className={`w-4 h-4 ${match.liked ? "fill-white" : ""}`} />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {match.user.city || "N/A"}, {match.user.state || ""}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  {match.user.education?.name || "—"}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  {match.user.profession?.name || "—"}
                </span>
              </div>

              <div className="mt-2">
                <p className="text-xs font-semibold mb-1">Interests:</p>
                <div className="flex flex-wrap gap-1.5 max-h-[36px] overflow-hidden">
                  {match.user.interests.slice(0, 4).map((interest, idx) => (
                    <Badge key={`${interest}-${idx}`} variant="secondary" className="text-xs px-2 py-0.5">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {isLocked ? (
                <Button
                  className="flex-1 min-w-[90px] bg-gradient-to-r from-primary to-secondary text-xs h-8 px-2"
                  onClick={() => navigate("/pricing")}
                >
                  <Lock className="w-3 h-3 mr-1" /> Upgrade
                </Button>
              ) : (
                <>
                  <Button
                    className="flex-1 min-w-[90px] bg-gradient-to-r from-primary to-secondary text-xs h-8 px-2"
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
                        <Lock className="w-3 h-3 mr-1" /> Upgrade
                      </>
                    ) : (
                      "View Profile"
                    )}
                  </Button>

                  <AnimatePresence mode="wait">
                    {isAccepted ? (
                      <Button
                        disabled
                        className="flex-1 min-w-[90px] bg-green-500 text-white cursor-default text-xs h-8 px-2"
                      >
                        <Check className="w-3 h-3 mr-1" /> Matched
                      </Button>
                    ) : hasIncomingInterest ? (
                      <Button
                        disabled
                        className="flex-1 min-w-[90px] bg-blue-500 text-white cursor-default text-xs h-8 px-2"
                      >
                        💌 Received
                      </Button>
                    ) : isInterestSent ? (
                      <Button
                        variant="outline"
                        className="flex-1 min-w-[90px] border-amber-500 text-amber-600 hover:bg-amber-50 text-xs h-8 px-2"
                        onClick={() => handleCancelInterest(match.user._id, match.user.fullName)}
                        disabled={isCanceling}
                      >
                        {isCanceling ? (
                          "Canceling..."
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" /> Cancel Sent
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1 min-w-[90px] text-xs h-8 px-2"
                        disabled={isSending}
                        onClick={() => handleSendInterest(match.user._id, match.user.fullName)}
                      >
                        {isSending ? "Sending..." : "Send Interest"}
                      </Button>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

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
            <TabsTrigger value="all">My Matches ({myMatches.length})</TabsTrigger>
            <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
            <TabsTrigger value="nri">NRI Profiles</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: NEW MATCHES */}
        <TabsContent value="new" className="mt-6">
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {matches.map((match) => (
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
          {myMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myMatches.map((match) => (
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
            {likedByMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {likedByMe.map((match) => (
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
            {likedMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {likedMe.map((match) => (
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

        {/* TAB 4: NRI PROFILES */}
        {/* <TabsContent value="nri" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nriProfiles.map((profile) => {
              const match: MatchItem = {
                user: {
                  _id: profile.id.toString(),
                  fullName: profile.name,
                  dateOfBirth: new Date().getFullYear() - profile.age + "-01-01",
                  city: profile.city.split(",")[0],
                  state: profile.city.split(",")[1]?.trim() || "",
                  interests: profile.interests,
                  education: { name: profile.education },
                  profession: { name: profile.profession },
                  photos: [{ url: profile.image, isPrimary: true }],
                },
                matchScore: profile.matchScore,
                liked: profile.liked,
              };
              return <MatchCard key={profile.id} match={match} isNRI={true} />;
            })}
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Matches;