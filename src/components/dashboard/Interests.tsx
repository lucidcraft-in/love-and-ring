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
  X,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import OptimizedProfileImage from "./OptimizedProfileImage";
import Axios from "@/axios/axios";

interface InterestUser {
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

interface InterestItem {
  _id: string;
  user: InterestUser;
  matchScore: number;
  status: string;
}

const Interests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState<InterestItem[]>([]);
  const [sent, setSent] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<InterestItem[]>([]);
  const [viewLoading, setViewLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  console.log("userId", userId);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [receivedRes, sentRes, acceptedRes] = await Promise.all([
        Axios.get("/api/user/interests/received", { headers }),
        Axios.get("/api/user/interests/sent", { headers }),
        Axios.get("/api/user/interests/accepted/interest", { headers }), // ✅ ADD THIS
      ]);
      console.log("res", receivedRes.data, sentRes.data, acceptedRes.data);
      const mapInterest = (item: any, userKey: string): InterestItem => ({
        _id: item._id,
        user: {
          _id: item[userKey]._id,
          fullName: item[userKey].fullName,
          dateOfBirth: item[userKey].dateOfBirth,
          city: item[userKey].city,
          state: item[userKey].state,
          interests: item[userKey].interests || [],
          education: item[userKey].highestEducation
            ? { name: item[userKey].highestEducation.name }
            : undefined,
          profession: item[userKey].profession
            ? { name: item[userKey].profession.name }
            : undefined,
          photos: item[userKey].photos || [],
        },
        matchScore: item.matchPercentage ?? 0,
        status: item.status || "pending",
      });

      setReceived(
        (receivedRes.data || [])
          .map((i: any) => mapInterest(i, "fromUser"))
          .filter((i) => i.status?.toLowerCase() === "pending"),
      );

      setSent((sentRes.data || []).map((i: any) => mapInterest(i, "toUser")));
      setAccepted(
        (acceptedRes.data || []).map((item: any) => {
          const otherUser =
            String(item.fromUser._id) === String(userId)
              ? item.toUser
              : item.fromUser;

          return {
            _id: item._id,
            user: {
              _id: otherUser._id,
              fullName: otherUser.fullName,
              dateOfBirth: otherUser.dateOfBirth,
              city: otherUser.city,
              state: otherUser.state,
              interests: otherUser.interests || [],
              education: otherUser.highestEducation
                ? { name: otherUser.highestEducation.name }
                : undefined,
              profession: otherUser.profession
                ? { name: otherUser.profession.name }
                : undefined,
              photos: otherUser.photos || [],
            },
            matchScore: item.matchPercentage ?? 0,
            status: item.status || "accepted",
          };
        }),
      );
    } catch (err) {
      console.error("Failed to fetch interests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
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
    return photos.find((p: any) => p.isPrimary)?.url || photos[0].url;
  };

  const handleAccept = async (interestId: string, name: string) => {
    setActionLoading(interestId);
    try {
      const token = localStorage.getItem("token");

      await Axios.patch(
        `/api/user/interests/${interestId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setReceived((prev) => {
        const acceptedItem = prev.find((i) => i._id === interestId);
        if (acceptedItem) {
          setAccepted((a) => [...a, { ...acceptedItem, status: "accepted" }]);
        }
        return prev.filter((i) => i._id !== interestId);
      });
      toast.success(`Accepted interest from ${name}! 🎉`);
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to accept interest");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = async (targetUserId: string) => {
    try {
      setViewLoading(targetUserId);

      const token = localStorage.getItem("token");

      await Axios.get(`/api/membership/view-profile/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/profile/${targetUserId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Limit reached");
    } finally {
      setViewLoading(null);
    }
  };

  const handleReject = async (interestId: string, name: string) => {
    setActionLoading(interestId);
    try {
      const token = localStorage.getItem("token");

      await Axios.patch(
        `/api/user/interests/${interestId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setReceived((prev) => prev.filter((i) => i._id !== interestId));

      toast.success(`Rejected interest from ${name}`);
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to reject interest");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (interestId: string, name: string) => {
    setActionLoading(interestId);
    try {
      const token = localStorage.getItem("token");

      await Axios.post(
        `/api/user/interests/${interestId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSent((prev) => prev.filter((i) => i._id !== interestId));

      toast.success(`Cancelled interest to ${name}`);
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to cancel interest");
    } finally {
      setActionLoading(null);
    }
  };

  const InterestCard = ({
    item,
    type,
  }: {
    item: InterestItem;
    type: "received" | "sent" | "accepted";
  }) => {
    const isActioning = actionLoading === item._id;

    return (
      <Card className="glass-card overflow-hidden hover:shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row">
          {/* Left: Profile Image — exact same as MatchCard */}
          <div className="sm:w-48 w-full h-48 sm:h-auto relative overflow-hidden bg-muted rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
            <OptimizedProfileImage
              src={getProfilePhoto(item.user.photos)}
              alt={item.user.fullName}
              isLocked={false}
            />

            {/* Match Badge */}
            {item.matchScore > 0 && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-secondary">
                  {item.matchScore}% Match
                </Badge>
              </div>
            )}
          </div>

          {/* Right: Content — exact same as MatchCard */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {item.user.fullName}, {calculateAge(item.user.dateOfBirth)}
                </h3>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.user.city}, {item.user.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {item.user.education?.name || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {item.user.profession?.name || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Interests tags */}
            {item.user.interests.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {item.user.interests.map((interest, idx) => (
                    <Badge key={`${interest}-${idx}`} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons — same flex layout as MatchCard */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                onClick={() => handleViewProfile(item.user._id)}
              >
                View Profile
              </Button>

              {type === "received" && (
                <>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleAccept(item._id, item.user.fullName)}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleReject(item._id, item.user.fullName)}
                    disabled={isActioning}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}

              {type === "sent" && (
                <>
                  {item.status?.toLowerCase() === "accepted" ? (
                    <Button
                      disabled
                      className="flex-1 bg-green-500 text-white cursor-default hover:bg-green-500"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accepted
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleCancel(item._id, item.user.fullName)}
                      disabled={isActioning}
                    >
                      {isActioning ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Cancel Interest
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
              {type === "accepted" && (
                <Button
                  disabled
                  className="flex-1 bg-green-500 text-white cursor-default hover:bg-green-500"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accepted
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="glass-card p-12 text-center max-w-lg w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back later for updates.
        </p>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Loading interests… 💜</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Interests</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-hide lg:overflow-visible px-1 -mx-1">
          <TabsList className="w-max lg:w-auto flex-nowrap">
            <TabsTrigger value="received">Received Interests</TabsTrigger>
            <TabsTrigger value="accepted">Accepted Interests</TabsTrigger>
            <TabsTrigger value="sent">Requested Interests</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="received" className="mt-6">
          {received.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {received.map((item) => (
                <InterestCard key={item._id} item={item} type="received" />
              ))}
            </div>
          ) : (
            <EmptyState message="No interests received yet." />
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sent.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sent.map((item) => (
                <InterestCard key={item._id} item={item} type="sent" />
              ))}
            </div>
          ) : (
            <EmptyState message="No interests sent yet." />
          )}
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          {accepted.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accepted.map((item) => (
                <InterestCard key={item._id} item={item} type="accepted" />
              ))}
            </div>
          ) : (
            <EmptyState message="No accepted interests yet." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Interests;
