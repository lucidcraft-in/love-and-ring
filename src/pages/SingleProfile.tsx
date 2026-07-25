import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Phone,
  MessageCircle,
  Share2,
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  Utensils,
  Activity,
  Music,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import Axios from "@/axios/axios";
import socket from "@/socket";

const SingleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null); // Live logged-in user details
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean>(false);

  // 1. Fetch Target Profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await Axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
      } catch (err: any) {
        console.error("Failed to fetch profile", err?.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  // 2. Fetch Live Logged-in User Membership Details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser)._id : localStorage.getItem("userId");

        if (!token || !userId) return;

        const res = await Axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentUserProfile(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch logged in user details", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // 3. Check Match Status
  useEffect(() => {
    const checkMatch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await Axios.get(`/api/user/matches/isMatch/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsMatch(res.data.matched);
      } catch (error) {
        console.error("Match check failed", error);
      }
    };
    if (id) checkMatch();
  }, [id]);

  // 4. Check Liked Status
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await Axios.get("/api/user/profile-likes/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const likedIds = res.data.map((item: any) => item.likedUser._id);
        if (likedIds.includes(id)) {
          setIsLiked(true);
        }
      } catch (err) {
        console.error("Failed to check like status", err);
      }
    };

    if (id) checkIfLiked();
  }, [id]);

  const handleLike = async () => {
    try {
      setLiking(true);
      const token = localStorage.getItem("token");

      if (!isLiked) {
        await Axios.post(
          `/api/user/profile-likes/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsLiked(true);
        toast.success("Profile liked ❤️");
      } else {
        await Axios.delete(`/api/user/profile-likes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLiked(false);
        toast.success("Profile unliked");
      }
    } catch (err: any) {
      toast.error("Action failed");
    } finally {
      setLiking(false);
    }
  };

  //   const handlePremiumAction = (action: string) => {
  //   if (!isPremium) {
  //     setShowUpgradeModal(true);
  //   } else {
  //     // Handle the action
  //     console.log(`Action: ${action}`);
  //   }
  // };

  const calculateAge = (dob?: string) => {
    if (!dob) return "--";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getProfileImage = (photos?: any[]) => {
    if (!photos || photos.length === 0)
      return "https://via.placeholder.com/400x400?text=No+Photo";

    return (
      photos.find((p) => p.isPrimary)?.url ||
      photos[0]?.url ||
      "https://via.placeholder.com/400x400?text=No+Photo"
    );
  };

  /* 👈 FIX: Call Handler with Live Permission Checks */
  const handleCall = () => {
    const membership = currentUserProfile?.membership || {};
    const viewedProfiles = membership.viewedProfiles || [];

    // Check if user has unlocked this profile
    const isUnlocked = viewedProfiles.some(
      (v: any) => (typeof v === "string" ? v : v?._id) === profile?._id
    );

    if (!membership.allowCall) {
      toast.error("Your plan does not include call access. Upgrade your plan 🔒");
      setShowUpgradeModal(true);
      return;
    }

    if (!isMatch && !isUnlocked) {
      toast.error("You need to unlock this profile or match to start a call.");
      setShowUpgradeModal(true);
      return;
    }

    const currentUser = currentUserProfile || JSON.parse(localStorage.getItem("user") || "{}");
    const ids = [currentUser._id, profile._id].sort();
    const roomId = `call_${ids[0]}_${ids[1]}`;

    socket.emit("call-user", {
      to: profile._id,
      from: currentUser._id,
      fromUser: {
        _id: currentUser._id,
        fullName: currentUser.fullName,
        photos: currentUser.photos,
      },
      roomId,
    });
    navigate(`/call/${roomId}`);
  };

  /* 👈 FIX: Chat Handler with Live Permission Checks */
  const handleChat = () => {
    const membership = currentUserProfile?.membership || {};
    const viewedProfiles = membership.viewedProfiles || [];

    const isUnlocked = viewedProfiles.some(
      (v: any) => (typeof v === "string" ? v : v?._id) === profile?._id
    );

    if (!membership.allowChat) {
      toast.error("Your plan does not include chat access. Upgrade your plan 🔒");
      setShowUpgradeModal(true);
      return;
    }

    if (!isMatch && !isUnlocked) {
      toast.error("You need to unlock this profile or match to start chatting.");
      setShowUpgradeModal(true);
      return;
    }

    const currentUser = currentUserProfile || JSON.parse(localStorage.getItem("user") || "{}");
    const ids = [currentUser._id, profile._id].sort();
    const roomId = `chat_${ids[0]}_${ids[1]}`;

    navigate(`/dashboard/chats?room=${roomId}&user=${profile._id}`);
  };

  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="py-20 text-center">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pt-4 pb-20">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-card overflow-hidden">
              <div className="relative">
                <img
                  src={getProfileImage(profile.photos)}
                  alt={profile.fullName}
                  className={`w-full h-96 object-cover ${profile.isPrivate && !isLiked ? "blur-md" : ""
                    }`}
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="glass-card p-4 space-y-2">
              <Button
                className={`w-full gap-2 ${isLiked ? "bg-gradient-to-r from-primary to-secondary" : ""
                  }`}
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                disabled={liking}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                {isLiked ? "Liked" : "Like Profile"}
              </Button>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleCall}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              {/* <Button
                className="w-full gap-2 text-green-600 border-green-600 hover:bg-green-50"
                variant="outline"
                onClick={() => handlePremiumAction("whatsapp")}
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </Button> */}

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleChat}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>

              <Button className="w-full gap-2" variant="outline">
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card p-6">
              <h1 className="text-3xl font-bold mb-2">
                {profile.fullName}, {calculateAge(profile.dateOfBirth)}
              </h1>
              <p className="text-muted-foreground">{profile.bio}</p>
            </Card>

            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={MapPin} label="Location" value={profile.city || "Not specified"} />
                <InfoItem icon={Users} label="Religion" value={profile.religion?.name || "Not specified"} />
                <InfoItem icon={GraduationCap} label="Education" value={profile.highestEducation?.name || "Not specified"} />
                <InfoItem icon={Briefcase} label="Profession" value={profile.profession?.name || "Not specified"} />
              </div>
            </Card>
            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {profile.fullName}, {calculateAge(profile.dateOfBirth)}
                    </h1>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                </div>
              </Card>

              {/* Basic Information */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={profile.city || "Not specified"}
                  />
                  <InfoItem
                    icon={Users}
                    label="Religion"
                    value={profile.religion?.name || "Not specified"}
                  />
                  <InfoItem
                    icon={GraduationCap}
                    label="Education"
                    value={profile.highestEducation?.name || "Not specified"}
                  />
                  <InfoItem
                    icon={Briefcase}
                    label="Profession"
                    value={profile.profession?.name || "Not specified"}
                  />
                </div>
              </Card>

              {/* Personal Details */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={Activity}
                    label="Height"
                    value={profile.heightCm}
                  />
                  <InfoItem
                    icon={Activity}
                    label="Body Type"
                    value={profile.bodyType}
                  />
                  <InfoItem
                    icon={Users}
                    label="Marital Status"
                    value={profile.maritalStatus}
                  />
                  <InfoItem
                    icon={Utensils}
                    label="Diet"
                    value={profile.dietPreference}
                  />
                  <InfoItem
                    icon={Home}
                    label="Lives With Family"
                    value={profile.livesWithFamily ? "Yes" : "No"}
                  />
                  {!profile.livesWithFamily && (
                    <InfoItem
                      icon={MapPin}
                      label="Family Location"
                      value={profile.familyLocation}
                    />
                  )}
                </div>
              </Card>

              {/* Interests */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="text-sm py-2 px-4"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Personality Traits */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Personality Traits</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.personalityTraits.map((trait) => (
                    <Badge
                      key={trait}
                      className="text-sm py-2 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
                      variant="outline"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
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
              Access exclusive features to connect with your matches!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/pricing")}
            >
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-primary mt-0.5" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default SingleProfile;