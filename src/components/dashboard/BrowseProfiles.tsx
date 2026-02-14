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

interface Profile {
  _id: string;
  fullName: string;
  dateOfBirth?: string;
  highestEducation?: { name: string };
  photos?: { url: string; isPrimary: boolean }[];
  profileStatus?: string;
  city?: string;
  profession?: { name: string };
}

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedUserIds, setLikedUserIds] = useState<Set<string>>(new Set());
  const [likingProfile, setLikingProfile] = useState<string | null>(null);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await Axios.get("/api/users?take=100&skip=0", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data || []);
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

  useEffect(() => {
    fetchProfiles();
    fetchProfilesILiked();
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

  const ProfileCard = ({ profile }: { profile: (typeof profiles)[0] }) => (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64">
        <img
          src={getProfileImage(profile.photos)}
          alt={profile.fullName}
          className={`w-full h-full object-cover ${profile.profileStatus === "private" ? "blur-sm" : ""}`}
        />
        {profile.profileStatus === "private" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge className="bg-white text-foreground">Private Profile</Badge>
          </div>
        )}
        <Button
          size="icon"
          variant={likedUserIds.has(profile._id) ? "default" : "outline"}
          className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${
            likedUserIds.has(profile._id)
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : ""
          }`}
          disabled={likingProfile === profile._id}
          onClick={() =>
            likedUserIds.has(profile._id)
              ? handleUnlikeProfile(profile._id)
              : handleLikeProfile(profile._id)
          }
        >
          <Heart
            className={`w-4 h-4 ${
              likedUserIds.has(profile._id) ? "fill-white" : ""
            }`}
          />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">
          {profile.fullName},{" "}
          {profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "--"}
        </h3>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          {/* City */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{profile.city || "Location not specified"}</span>
          </div>

          {/* Profession */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>
              {profile.profession?.name || "Profession not specified"}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {"No bio available."}
        </p>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary gap-2"
            onClick={() => navigate(`/profile/${profile._id}`)}
          >
            <Eye className="w-4 h-4" />
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProfiles;
