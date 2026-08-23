import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Axios from "@/axios/axios";
import OptimizedProfileImage from "./OptimizedProfileImage";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";

interface MatchUser {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth: string;
  city?: string;
  state?: string;
  profession?: { name: string };
  profileStatus?: string;
  photos?: { url: string; isPrimary: boolean }[];
}

interface MatchItem {
  user: MatchUser;
  matchScore: number;
}

interface MatchesForYouProps {
  onNavigate?: (tab: string) => void;
}

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
  return photos.find((p) => p.isPrimary)?.url || photos[0]?.url || DummyProfile;
};

const MatchesForYou = ({ onNavigate }: MatchesForYouProps) => {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [matchesRes, likesRes] = await Promise.all([
        Axios.get("/api/user/matches", { headers }),
        Axios.get("/api/user/profile-likes/sent", { headers }).catch(() => ({ data: [] })),
      ]);

      setLikedUserIds(
        new Set(
          (likesRes.data || [])
            .map((item: any) => item?.likedUser?._id)
            .filter(Boolean)
        )
      );

      const raw = Array.isArray(matchesRes.data?.data) ? matchesRes.data.data : [];
      const normalized: MatchItem[] = raw
        .filter(
          (item: any) =>
            item &&
            item.user &&
            item.user.isActive !== false &&
            item.user.approvalStatus !== "INACTIVE"
        )
        .slice(0, 12)
        .map((item: any) => ({
          user: {
            _id: item.user._id,
            fullName: item.user.fullName,
            gender: item.user.gender,
            dateOfBirth: item.user.dateOfBirth,
            city: item.user.city,
            state: item.user.state,
            profession: item.user.profession
              ? { name: item.user.profession.name }
              : undefined,
            profileStatus: item.user.profileStatus,
            photos: item.user.photos || [],
          },
          matchScore: item.matchPercentage ?? 0,
        }));

      setMatches(normalized);
    } catch (err) {
      console.error("Failed to fetch matches for you", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleViewProfile = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get(`/api/membership/view-profile/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.limitReached) {
        toast.error("Profile view limit reached. Upgrade your plan 🔒");
        navigate("/pricing");
        return;
      }

      navigate(`/profile/${targetUserId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile view limit reached");
    }
  };

  const handleToggleLike = async (targetUserId: string) => {
    const isLiked = likedUserIds.has(targetUserId);
    setLikingProfile(targetUserId);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isLiked) {
        await Axios.delete(`/api/user/profile-likes/${targetUserId}`, { headers });
        setLikedUserIds((prev) => {
          const updated = new Set(prev);
          updated.delete(targetUserId);
          return updated;
        });
        toast.success("Profile unliked");
      } else {
        await Axios.post(`/api/user/profile-likes/${targetUserId}`, {}, { headers });
        setLikedUserIds((prev) => new Set(prev).add(targetUserId));
        toast.success("Profile liked ❤️");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setLikingProfile(null);
    }
  };

  return (
    <Card className="glass-card rounded-2xl border border-border/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Matches for You
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll matches left"
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll matches right"
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate?.("matches")}
            className="ml-1 flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal scrollable cards */}
      <div className="p-4">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[220px] shrink-0 rounded-xl border border-border/40 overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No matches found yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Browse profiles to find your perfect match.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary text-xs"
              onClick={() => onNavigate?.("browse")}
            >
              Browse Profiles
            </Button>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 -mx-1 px-1"
          >
            {matches.map((match) => {
              const isLiked = likedUserIds.has(match.user._id);
              const isLiking = likingProfile === match.user._id;
              const isPremium = match.user.profileStatus
                ?.toLowerCase()
                .includes("million");

              return (
                <div
                  key={match.user._id}
                  className="w-[220px] sm:w-[230px] shrink-0 snap-start rounded-xl border border-border/40 bg-card overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Image area */}
                  <div
                    className="relative h-40 overflow-hidden bg-muted cursor-pointer"
                    onClick={() => handleViewProfile(match.user._id)}
                  >
                    <OptimizedProfileImage
                      src={getProfilePhoto(match.user.photos, match.user.gender)}
                      alt={match.user.fullName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-[10px] px-1.5 py-0.5">
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                    {isPremium && (
                      <Badge className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h4
                      className="text-sm font-bold truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleViewProfile(match.user._id)}
                    >
                      {match.user.fullName}, {calculateAge(match.user.dateOfBirth)}
                    </h4>
                    {(match.user.city || match.user.state) && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {[match.user.city, match.user.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </p>
                    )}
                    {match.user.profession?.name && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span className="truncate">{match.user.profession.name}</span>
                      </p>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-gradient-to-r from-primary to-secondary"
                        onClick={() => handleViewProfile(match.user._id)}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLiking}
                        aria-label={isLiked ? "Unlike profile" : "Like profile"}
                        className={`h-8 w-8 p-0 shrink-0 ${
                          isLiked
                            ? "border-primary text-primary bg-primary/10"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => handleToggleLike(match.user._id)}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLiked ? "fill-primary" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MatchesForYou;
