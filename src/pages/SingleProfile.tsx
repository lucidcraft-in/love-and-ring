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
  Beaker,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";
import Axios from "@/axios/axios";
import socket from "@/socket";


const SingleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<Boolean>(false);
  console.log("mached user", isMatch)
  const isPremium = false;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await Axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(()=>{
    const checkMatch = async() =>{
      try {
        const token = localStorage.getItem("token")
        const res = await Axios.get(`/api/user/matches/isMatch/${id}`,{
          headers: {Authorization: `Bearer ${token}` },
        })
        console.log(res, "data of the res match")

        setIsMatch(res.data.matched)
      } catch (error) {
        console.error("Match check failed", error);
      }
    }
    if (id) checkMatch();
  },[id])

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

  const handlePremiumAction = (action: string) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
    } else {
      // Handle the action
      console.log(`Action: ${action}`);
    }
  };

  const handleLike = async () => {
    try {
      setLiking(true);
      const token = localStorage.getItem("token");

      if (!isLiked) {
        // LIKE
        await Axios.post(
          `/api/user/profile-likes/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setIsLiked(true);
      } else {
        // UNLIKE
        await Axios.delete(`/api/user/profile-likes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLiked(false);
      }
    } catch (err: any) {
      console.error("Like/unlike failed", err);
    } finally {
      setLiking(false);
    }
  };

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

  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="py-20 text-center">Profile not found</div>;
  }


  const handleCall = () => {
    if(!isMatch){
      return setShowUpgradeModal(true)
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser?.membership?.allowCall) {
      setShowUpgradeModal(true);
      return;
    }

    const ids = [currentUser._id, profile._id].sort();
    const roomId = `call_${ids[0]}_${ids[1]}`;

    socket.emit("call-user", {
      to: profile._id,
      from: currentUser._id,
      roomId,
    });
    navigate(`/call/${roomId}`);
  };

  const handleChat = () =>{
    if(!isMatch){
      return setShowUpgradeModal(true)
    }
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    if(!currentUser?.membership?.allowChat){
      setShowUpgradeModal(true)
      return;
    }

  const ids = [currentUser._id, profile._id].sort();
  const roomId = `chat_${ids[0]}_${ids[1]}`;

  navigate(`/dashboard/chats?room=${roomId}&user=${profile._id}`);

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

                {profile.isPrivate && !isLiked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white p-6">
                      <p className="text-lg font-semibold mb-2">
                        Private Profile
                      </p>
                      <p className="text-sm">
                        Like this profile to view full details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Additional Photos */}
            {(!profile.isPrivate || isLiked) && (
              <div className="grid grid-cols-3 gap-2">
                {profile.photos?.length > 1 && (
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 min-w-max">
                      {profile.photos
                        .filter((photo: any) => !photo.isPrimary)
                        .map((photo: any, idx: number) => (
                          <Card
                            key={idx}
                            className="glass-card overflow-hidden flex-shrink-0 w-32 h-32"
                          >
                            <img
                              src={photo.url}
                              alt={`Photo ${idx + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                onClick={() => handlePremiumAction("view-contact")}
              >
                <Phone className="w-4 h-4" />
                See Contact
              </Button>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => handleCall()}>
                <Phone className="w-4 h-4" />
                Call
              </Button>

              <Button
                className="w-full gap-2 text-green-600 border-green-600 hover:bg-green-50"
                variant="outline"
                onClick={() => handlePremiumAction("whatsapp")}
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </Button>

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => handleChat()}
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
            <div className="space-y-2">
              <h4 className="font-semibold">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  View and call contact numbers
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Unlimited messaging with matches
                </li>
                <li className="flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4" />
                  Direct WhatsApp connect
                </li>
              </ul>
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-primary mt-0.5" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default SingleProfile;
