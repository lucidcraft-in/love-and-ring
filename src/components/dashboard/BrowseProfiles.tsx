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
} from "lucide-react";
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

import { motion } from "framer-motion";
import OptimizedProfileImage from "@/components/dashboard/OptimizedProfileImage";

interface Profile {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  highestEducation?: { name: string };
  education?: { name: string };
  photos?: { url: string; isPrimary: boolean; isHidden?: boolean }[];
  profileStatus?: string;
  city?: string;
  state?: string;
  profession?: { name: string };
  interests?: string[];
}

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [profileLimitReached, setProfileLimitReached] = useState(false);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<string[]>([]);
  const [acceptedInterests, setAcceptedInterests] = useState<string[]>([]);

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedUserId = loggedUser?._id;

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await Axios.get("/api/users?take=100&skip=0", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allProfiles = response.data || [];

      const filtered = allProfiles.filter(
        (profile: Profile) => profile._id !== loggedUserId,
      );

      setProfiles(filtered);
      console.log("Profiles:", response.data);
    } catch (error: any) {
      console.error("Error fetching profiles:", error?.response || error);
    } finally {
      setLoading(false);
    }
  };

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

      const ids = res.data.map((item: any) => item.fromUser?._id);
      setReceivedInterests(ids);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAcceptedInterests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await Axios.get("/api/user/interests/accepted/interest", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data.map((item: any) => item.fromUser?._id);
      setAcceptedInterests(ids);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchProfilesILiked();
    checkProfileLimit();
    fetchReceivedInterests();
    fetchAcceptedInterests();
  }, []);

  const calculateAge = (dob?: string) => {
    if (!dob) return "--";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getProfileImage = (photos?: any[], gender?: string) => {
    if (!photos || photos.length === 0) {
      return gender === "female" ? FemaleDummy : MaleDummy;
    }

    const primary = photos.find((p) => p.isPrimary);
    return primary?.url || photos[0]?.url || DummyProfile;
  };

  const filteredProfiles = profiles.filter((p) => {
    // Search query check
    const matchesSearch = (p.fullName ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (showLikedOnly) {
      return matchesSearch && likedUserIds.has(p._id);
    }

    return matchesSearch;
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

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    const primaryPhoto = profile.photos?.find((p) => p.isPrimary);
    const isPhotoHidden = primaryPhoto?.isHidden;

    const alreadyViewed = viewedProfiles.some((id) => String(id) === String(profile._id));
    const lockedByLimit = profileLimitReached && !alreadyViewed;

    const canViewHiddenPhoto =
      acceptedInterests.includes(profile._id) ||
      receivedInterests.includes(profile._id);

    const photoSrc = getProfileImage(profile.photos, profile.gender);
    const isLiking = likingProfile === profile._id;
    const isLiked = likedUserIds.has(profile._id);

    return (
      <Card className="glass-card overflow-hidden hover:shadow-md md:hover:shadow-lg transition-all rounded-xl md:rounded-2xl border border-border/40">
        <div className="grid grid-cols-[90px_1fr] md:grid-cols-[160px_1fr] min-h-[145px] md:h-[240px]">
          {/* Image Section */}
          <div className="relative overflow-hidden bg-muted rounded-l-xl md:rounded-l-2xl">
            <OptimizedProfileImage
              src={photoSrc}
              alt={profile.fullName}
              isLocked={false}
              className={`w-full h-full object-cover ${
                isPhotoHidden && !canViewHiddenPhoto ? "blur-md" : ""
              }`}
            />

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
                <h3 className="text-xs md:text-base font-bold truncate leading-tight">
                  {profile.fullName},{" "}
                  {profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "--"}
                </h3>

                <Button
                  size="icon"
                  variant={isLiked ? "default" : "outline"}
                  className={`shrink-0 h-6 w-6 md:h-8 md:w-8 ${
                    isLiked ? "bg-gradient-to-r from-primary to-secondary text-white" : ""
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

              <div className="flex flex-col gap-0.5 mt-0.5 md:mt-1 text-[11px] md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {profile.city || "Location not specified"}{profile.state ? `, ${profile.state}` : ""}
                </span>
                <span className="hidden md:flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary/80" />
                  {profile.education?.name || profile.highestEducation?.name || "—"}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {profile.profession?.name || "Profession not specified"}
                </span>
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div className="mt-1 md:mt-2">
                  <p className="hidden md:block text-xs font-semibold mb-1 text-foreground/80">Interests:</p>

                  {/* Mobile Interests (Compact) */}
                  <div className="flex md:hidden flex-wrap gap-1">
                    {profile.interests.slice(0, 2).map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                        {interest}
                      </Badge>
                    ))}
                    {profile.interests.length > 2 && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
                        +{profile.interests.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Desktop Interests (Spacious) */}
                  <div className="hidden md:flex flex-wrap gap-1.5 max-h-[42px] overflow-y-auto">
                    {profile.interests.map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-xs px-2 py-0.5">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 pt-1 md:pt-1.5 border-t border-border/30">
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary gap-1.5 text-[10px] md:text-xs h-7 md:h-8 px-2"
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
            </div>
          </div>
        </div>
      </Card>
    );
  };

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
            className={`gap-2 ${
              showLikedOnly
                ? "bg-gradient-to-r from-primary to-secondary text-white"
                : ""
            }`}
            onClick={() => setShowLikedOnly(!showLikedOnly)}
          >
            <Heart className="w-4 h-4" />
            Liked Profiles
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              {/* <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button> */}
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label>Religion</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Education</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">
                        Post Graduate
                      </SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Profession</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Marital Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widow">Widow/Widower</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Age Range</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <div>
                  <Label>Income Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5">₹0 - ₹5L</SelectItem>
                      <SelectItem value="5-10">₹5L - ₹10L</SelectItem>
                      <SelectItem value="10-20">₹10L - ₹20L</SelectItem>
                      <SelectItem value="20+">₹20L+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
