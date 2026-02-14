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
  Filter,
  Check,
  Sparkles,
  Lock,
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
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likedByMe, setLikedByMe] = useState<MatchItem[]>([]);
  const [likedMe, setLikedMe] = useState<MatchItem[]>([]);

  const navigate = useNavigate();

  // Mock user NRI plan status - set to false to simulate non-NRI user
  const hasNRIPlan = false;
  const fetchProfilesILiked = async (): Promise<string[]> => {
    const token = localStorage.getItem("token");

    const res = await Axios.get("/api/user/profile-likes/sent", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const formatted: MatchItem[] = res.data.map((item: any) => ({
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

    return ids; // ✅ important
  };

  const fetchProfilesWhoLikedMe = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await Axios.get("/api/user/profile-likes/received", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("RECEIVED:", res.data);

      const formatted: MatchItem[] = res.data.map((item: any) => {
        const u = item.likedBy;

        return {
          user: {
            _id: u._id,
            fullName: u.fullName,
            dateOfBirth: u.dateOfBirth,
            city: u.city,
            state: u.state,
            interests: u.interests || [],
            education: u.highestEducation
              ? { name: u.highestEducation.name }
              : undefined,
            profession: u.profession ? { name: u.profession.name } : undefined,
            photos: u.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
          liked: false,
        };
      });

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

      const normalized: MatchItem[] = raw.map((item: any) => ({
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
        liked: likedIds.has(item.user._id), // ✅ now correct
      }));

      setMatches(normalized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const likedIdsArray = await fetchProfilesILiked();
      await fetchProfilesWhoLikedMe();
      await fetchMatches(new Set(likedIdsArray));
    };

    init();
  }, []);

  const calculateAge = (dob: string) => {
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

  // Mock NRI profiles data
  const nriProfiles = [
    {
      id: 101,
      name: "Priya Sharma",
      age: 27,
      city: "London, UK",
      education: "MS Computer Science",
      profession: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
      matchScore: 94,
      interests: ["Technology", "Travel", "Music"],
      liked: false,
    },
    {
      id: 102,
      name: "Anjali Patel",
      age: 29,
      city: "Toronto, Canada",
      education: "MBA Finance",
      profession: "Investment Banker",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      matchScore: 89,
      interests: ["Finance", "Yoga", "Reading"],
      liked: false,
    },
    {
      id: 103,
      name: "Meera Krishnan",
      age: 26,
      city: "Sydney, Australia",
      education: "MBBS, MD",
      profession: "Cardiologist",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      matchScore: 91,
      interests: ["Healthcare", "Swimming", "Cooking"],
      liked: false,
    },
    {
      id: 104,
      name: "Divya Menon",
      age: 28,
      city: "Dubai, UAE",
      education: "B.Arch",
      profession: "Senior Architect",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      matchScore: 87,
      interests: ["Architecture", "Art", "Travel"],
      liked: false,
    },
  ];

  const likedProfiles = matches.filter((m) => m.liked);

  const handleSendInterest = (matchId: string, matchName: string) => {
    if (sentInterests.includes(matchId)) return;

    setSendingInterest(matchId);

    // Simulate sending interest
    setTimeout(() => {
      setSentInterests((prev) => [...prev, matchId]);
      setSendingInterest(null);
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Interest sent to {matchName}!</span>
        </div>,
        {
          description: "They will be notified about your interest.",
          duration: 3000,
        },
      );
    }, 1000);
  };

  const handleLikeProfile = async (targetUserId: string) => {
    const match = matches.find((m) => m.user._id === targetUserId);
    if (!match || match.liked) {
      toast.info("Profile already liked");
      return;
    }

    setLikingProfile(targetUserId);

    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        `/api/user/profile-likes/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ 1. Update matches
      setMatches((prev) =>
        prev.map((m) =>
          m.user._id === targetUserId ? { ...m, liked: true } : m,
        ),
      );

      // ✅ 2. ADD to "Profiles You Liked"
      setLikedByMe((prev) => {
        // prevent duplicates
        if (prev.some((m) => m.user._id === targetUserId)) return prev;
        return [{ ...match, liked: true }, ...prev];
      });

      // ✅ 3. Update likedUserIds
      setLikedUserIds((prev) => new Set(prev).add(targetUserId));

      toast.success("Profile liked ❤️");
    } catch (err: any) {
      console.error("Failed to like profile:", err);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ 1. Update matches
      setMatches((prev) =>
        prev.map((m) =>
          m.user._id === targetUserId ? { ...m, liked: false } : m,
        ),
      );

      // ✅ 2. REMOVE from "Profiles You Liked"
      setLikedByMe((prev) => prev.filter((m) => m.user._id !== targetUserId));

      // ✅ 3. Update likedUserIds set
      setLikedUserIds((prev) => {
        const updated = new Set(prev);
        updated.delete(targetUserId);
        return updated;
      });

      toast.success("Profile unliked");
    } catch (err: any) {
      console.error("Failed to unlike profile:", err);
      toast.error(err.response?.data?.message || "Failed to unlike profile");
    } finally {
      setLikingProfile(null);
    }
  };

  const MatchCard = ({
    match,
    isNRI = false,
  }: {
    match: MatchItem;
    isNRI?: boolean;
  }) => {
    const isInterestSent = sentInterests.includes(match.user._id);
    const isSending = sendingInterest === match.user._id;
    const isLocked = isNRI && !hasNRIPlan;
    const isLiking = likingProfile === match.user._id;

    return (
      <Card className="glass-card overflow-hidden hover:shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 w-full h-48 sm:h-auto relative overflow-hidden bg-muted rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
            <OptimizedProfileImage
              src={getProfilePhoto(match.user.photos)}
              alt={match.user.fullName}
              isLocked={isLocked}
            />

            {/* Match Badge */}
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-primary to-secondary">
                {match.matchScore}% Match
              </Badge>
            </div>

            {/* Lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="bg-white/90 rounded-full p-4 shadow-lg">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {match.user.fullName}, {calculateAge(match.user.dateOfBirth)}
                </h3>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {match.user.city}, {match.user.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {match.user.education?.name || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {match.user.profession?.name || "—"}
                  </span>
                </div>
              </div>
              {!isLocked && (
                <Button
                  size="icon"
                  variant={match.liked ? "default" : "outline"}
                  className={
                    match.liked
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : ""
                  }
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
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Heart
                      className={`w-4 h-4 ${match.liked ? "fill-white" : ""}`}
                    />
                  )}
                </Button>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {match.user.interests.map((interest, idx) => (
                  <Badge key={`${interest}-${idx}`} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isLocked ? (
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate("/pricing")}
              >
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to View Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  onClick={() => navigate(`/profile/${match.user._id}`)}
                >
                  View Profile
                </Button>
                <AnimatePresence mode="wait">
                  {isInterestSent ? (
                    <motion.div
                      key="sent"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Interest Sent
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="send" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full relative overflow-hidden"
                        onClick={() =>
                          handleSendInterest(
                            match.user._id,
                            match.user.fullName,
                          )
                        }
                        disabled={isSending}
                      >
                        {isSending ? (
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
                          />
                        ) : null}
                        <span className="relative z-10 flex items-center">
                          {isSending ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="mr-2"
                              >
                                <Sparkles className="w-4 h-4" />
                              </motion.div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 mr-2" />
                              Send Interest
                            </>
                          )}
                        </span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
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
        {/* <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button> */}
      </div>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(filters) => {
          console.log("Applied filters:", filters);
          toast.success("Filters applied successfully");
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Horizontal scroll container for mobile/tablet */}
        <div className="overflow-x-auto scrollbar-hide lg:overflow-visible px-1 -mx-1">
          <TabsList className="w-max lg:w-auto flex-nowrap">
            <TabsTrigger value="new">New Matches</TabsTrigger>
            <TabsTrigger value="all">My Matches</TabsTrigger>
            <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
            <TabsTrigger value="nri">NRI Profiles</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new" className="mt-6">
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matches.slice(0, 2).map((match) => (
                <MatchCard key={match.user._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Card className="glass-card p-12 text-center max-w-lg w-full">
                <p className="text-muted-foreground text-lg font-medium">
                  No matches available.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Set your partner preference to find matches.
                </p>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.user._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Card className="glass-card p-12 text-center max-w-lg w-full">
                <p className="text-muted-foreground text-lg font-medium">
                  No matches available.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Set your partner preference to find matches.
                </p>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="mt-6 space-y-10">
          {/* Section 1: Profiles You Liked */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Profiles You’re Interested In ❤️
            </h3>

            {likedByMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {likedByMe.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">
                  You haven’t liked any profiles yet
                </p>
              </Card>
            )}
          </div>

          {/* Section 2: Profiles Interested in You */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              People Who Showed Interest in You ✨
            </h3>

            {likedMe.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {likedMe.map((match) => (
                  <MatchCard key={match.user._id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">
                  No one has liked your profile yet
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nri" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nriProfiles.map((profile) => {
              const match: MatchItem = {
                user: {
                  _id: profile.id.toString(),
                  fullName: profile.name,
                  dateOfBirth:
                    new Date().getFullYear() - profile.age + "-01-01",
                  city: profile.city.split(",")[0],
                  state: profile.city.split(",")[1]?.trim() || "",
                  interests: profile.interests,
                  education: { name: profile.education },
                  profession: { name: profile.profession },
                  photos: [
                    {
                      url: profile.image,
                      isPrimary: true,
                    },
                  ],
                },
                matchScore: profile.matchScore,
                liked: profile.liked,
              };
              return <MatchCard key={profile.id} match={match} isNRI={true} />;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
