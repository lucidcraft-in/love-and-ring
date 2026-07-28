import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
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
  Check,
  X,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean>(false);

  // Interest State Management
  const [interestStatus, setInterestStatus] = useState<
    "none" | "sent" | "received" | "accepted"
  >("none");
  const [interestId, setInterestId] = useState<string | null>(null);
  const [interestLoading, setInterestLoading] = useState(false);

  // Call History State Management
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [callHistoryLoading, setCallHistoryLoading] = useState(false);
  const [showCallHistoryModal, setShowCallHistoryModal] = useState(false);

  const formatISTDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) ;
  };

  const fetchCallHistory = async () => {
    setCallHistoryLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      const res = await Axios.get(`/api/user/calls/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCallHistory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch call history", err);
    } finally {
      setCallHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCallHistory();
  }, [id]);

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
        const userId = storedUser
          ? JSON.parse(storedUser)._id
          : localStorage.getItem("userId");

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

  // 5. Check Interest Status (Sent / Received / Accepted)
  useEffect(() => {
    const checkInterestStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const headers = { Authorization: `Bearer ${token}` };

        const [sentRes, receivedRes, acceptedRes] = await Promise.all([
          Axios.get("/api/user/interests/sent", { headers }),
          Axios.get("/api/user/interests/received", { headers }),
          Axios.get("/api/user/interests/accepted/interest", { headers }),
        ]);

        // Check if mutually accepted
        const isAccepted = (acceptedRes.data || []).some(
          (item: any) =>
            item.fromUser?._id === id || item.toUser?._id === id
        );

        if (isAccepted) {
          setInterestStatus("accepted");
          return;
        }

        // Check if received interest from target user
        const receivedItem = (receivedRes.data || []).find(
          (item: any) =>
            item.fromUser?._id === id &&
            item.status?.toLowerCase() === "pending"
        );

        if (receivedItem) {
          setInterestStatus("received");
          setInterestId(receivedItem._id);
          return;
        }

        // Check if sent interest to target user
        const sentItem = (sentRes.data || []).find(
          (item: any) => item.toUser?._id === id
        );

        if (sentItem) {
          setInterestStatus("sent");
          setInterestId(sentItem._id);
          return;
        }

        setInterestStatus("none");
        setInterestId(null);
      } catch (err) {
        console.error("Failed to check interest status", err);
      }
    };

    if (id) checkInterestStatus();
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

  // Interest Action Handlers
  const handleSendInterest = async () => {
    setInterestLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.post(
        `/api/user/interests/${id}/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterestStatus("sent");
      setInterestId(res.data?._id || null);
      toast.success(`Interest sent to ${profile?.fullName || "user"}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send interest");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleCancelInterest = async () => {
    if (!interestId) {
      toast.error("Interest record not found");
      return;
    }

    setInterestLoading(true);
    try {
      const token = localStorage.getItem("token");
      await Axios.post(
        `/api/user/interests/${interestId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterestStatus("none");
      setInterestId(null);
      toast.success("Interest cancelled");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel interest");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleAcceptInterest = async () => {
    if (!interestId) {
      toast.error("Interest record not found");
      return;
    }

    setInterestLoading(true);
    try {
      const token = localStorage.getItem("token");
      await Axios.patch(
        `/api/user/interests/${interestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterestStatus("accepted");
      toast.success(`Accepted interest from ${profile?.fullName || "user"}! 🎉`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept interest");
    } finally {
      setInterestLoading(false);
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

  const handleCall = () => {
    const membership = currentUserProfile?.membership || {};
    const viewedProfiles = membership.viewedProfiles || [];

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

    const currentUser =
      currentUserProfile || JSON.parse(localStorage.getItem("user") || "{}");
    const ids = [currentUser._id, profile._id].sort();
    const roomId = `call_${ids[0]}_${ids[1]}`;

    // Log call event to backend
    try {
      const token = localStorage.getItem("token");
      Axios.post(
        "/api/user/calls",
        { receiverId: profile._id, roomId, status: "initiated" },
        { headers: { Authorization: `Bearer ${token}` } }
      ).then(() => {
        fetchCallHistory();
      }).catch((err) => console.error("Failed to log call", err));
    } catch (err) {
      console.error("Error logging call", err);
    }

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

    const currentUser =
      currentUserProfile || JSON.parse(localStorage.getItem("user") || "{}");
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
          {/* Left Column - Images & Primary Actions */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-card overflow-hidden">
              <div className="relative">
                <img
                  src={getProfileImage(profile.photos)}
                  alt={profile.fullName}
                  className={`w-full h-96 object-cover ${
                    profile.isPrivate && !isLiked ? "blur-md" : ""
                  }`}
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="glass-card p-4 space-y-2">
              {/* Interest Buttons (Send / Cancel / Accept) */}
              {interestStatus === "accepted" ? (
                <Button
                  disabled
                  className="w-full gap-2 bg-green-500 text-white cursor-default"
                >
                  <Check className="w-4 h-4" />
                  Matched / Interest Accepted
                </Button>
              ) : interestStatus === "received" ? (
                <Button
                  className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleAcceptInterest}
                  disabled={interestLoading}
                >
                  <Check className="w-4 h-4" />
                  {interestLoading ? "Accepting..." : "Accept Interest"}
                </Button>
              ) : interestStatus === "sent" ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                  onClick={handleCancelInterest}
                  disabled={interestLoading}
                >
                  <X className="w-4 h-4" />
                  {interestLoading ? "Cancelling..." : "Cancel Interest"}
                </Button>
              ) : (
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
                  onClick={handleSendInterest}
                  disabled={interestLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  {interestLoading ? "Sending..." : "Send Interest"}
                </Button>
              )}

              {/* Like Button */}
              <Button
                className={`w-full gap-2 ${
                  isLiked ? "bg-gradient-to-r from-primary to-secondary" : ""
                }`}
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                disabled={liking}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                {isLiked ? "Liked" : "Like Profile"}
              </Button>

              {/* Call Button */}
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleCall}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>

              {/* Chat Button */}
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleChat}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>

              {/* Share Button */}
              {/* <Button className="w-full gap-2" variant="outline">
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button> */}

              {/* Call History Button */}
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => setShowCallHistoryModal(true)}
              >
                <Clock className="w-4 h-4 text-primary" />
                Call History
              </Button>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
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

            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={Activity}
                  label="Height"
                  value={profile.heightCm ? `${profile.heightCm} cm` : "N/A"}
                />
                <InfoItem
                  icon={Activity}
                  label="Body Type"
                  value={profile.bodyType || "Not specified"}
                />
                <InfoItem
                  icon={Users}
                  label="Marital Status"
                  value={profile.maritalStatus || "Not specified"}
                />
                <InfoItem
                  icon={Utensils}
                  label="Diet"
                  value={profile.dietPreference || "Not specified"}
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
                    value={profile.familyLocation || "N/A"}
                  />
                )}
              </div>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
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
            )}

            {/* Personality Traits */}
            {profile.personalityTraits &&
              profile.personalityTraits.length > 0 && (
                <Card className="glass-card p-6">
                  <h2 className="text-xl font-bold mb-4">Personality Traits</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.personalityTraits.map((trait: string) => (
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
              )}
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

      {/* Call History Modal */}
      <Dialog open={showCallHistoryModal} onOpenChange={setShowCallHistoryModal}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-primary" />
              Call History
            </DialogTitle>
            <DialogDescription className="text-sm">
              Past call history with {profile?.fullName || "this user"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {callHistoryLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Loading call history...
              </p>
            ) : callHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
                <p className="text-sm font-medium">No call history with this user</p>
              </div>
            ) : (
              <div className="space-y-3">
                {callHistory.map((call: any) => {
                  const currentUser =
                    currentUserProfile || JSON.parse(localStorage.getItem("user") || "{}");
                  const callerId =
                    typeof call.caller === "string" ? call.caller : call.caller?._id;
                  const isOutgoing = String(callerId) === String(currentUser._id);

                  return (
                    <div
                      key={call._id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-card/50 border border-border/50 hover:bg-card transition shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                          {isOutgoing ? (
                            <PhoneOutgoing className="w-4 h-4" />
                          ) : (
                            <PhoneIncoming className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {isOutgoing ? "Outgoing Call" : "Incoming Call"}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-primary/70" />
                            <span className="font-mono text-xs text-foreground/80">
                              {formatISTDateTime(call.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={call.status === "completed" ? "default" : "outline"}
                        className="capitalize text-xs px-3 py-1"
                      >
                        {call.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
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