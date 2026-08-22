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
  Lock,
  Eye,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OptimizedProfileImage from "./OptimizedProfileImage";
import Axios from "@/axios/axios";
import socket from "@/socket";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";

interface InterestUser {
  _id: string;
  fullName: string;
  gender?: string;
  dateOfBirth: string;
  heightCm?: number;
  interests: string[];
  education?: { name: string };
  profession?: { name: string };
  city?: string;
  state?: string;
  profileStatus?: string;
  isMillionClub?: boolean;
  photos?: {
    url: string;
    isPrimary: boolean;
    isHidden?: boolean;
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
  const [accepted, setAccepted] = useState<InterestItem[]>([]);
  const [rejected, setRejected] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState<string | null>(null);
  const [profileLimitReached, setProfileLimitReached] = useState(false);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const checkMillionStatus = (userObj: any) => {
    if (!userObj) return false;
    const status = (userObj.profileStatus || "").toLowerCase();
    const planName = (userObj.membership?.plan?.name || "").toLowerCase();
    const isPlanMillion = userObj.membership?.plan?.millionClub === true;
    return status.includes("million") || planName.includes("million") || isPlanMillion === true || userObj.isMillionClub === true;
  };
  const [isCurrentMillionClubUser, setIsCurrentMillionClubUser] = useState<boolean>(() => checkMillionStatus(parsedUser));
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  console.log("userId", userId);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [receivedRes, sentRes, acceptedRes, rejectedRes] = await Promise.all([
        Axios.get("/api/user/interests/received", { headers }),
        Axios.get("/api/user/interests/sent", { headers }),
        Axios.get("/api/user/interests/accepted/interest", { headers }),
        Axios.get("/api/user/interests/rejected/interest", { headers }),
      ]);
      console.log("res", receivedRes.data, sentRes.data, acceptedRes.data, rejectedRes.data);
      const mapInterest = (item: any, userKey: string): InterestItem => ({
        _id: item._id,
        user: {
          _id: item[userKey]._id,
          fullName: item[userKey].fullName,
          dateOfBirth: item[userKey].dateOfBirth,
          city: item[userKey].city,
          state: item[userKey].state,
          profileStatus: item[userKey].profileStatus,
          isMillionClub: checkMillionStatus(item[userKey]),
          interests: item[userKey].interests || [],
          education: (item[userKey].primaryEducation || item[userKey].highestEducation || item[userKey].education)
            ? { name: (item[userKey].primaryEducation || item[userKey].highestEducation || item[userKey].education).name }
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

      setSent(
        (sentRes.data || [])
          .map((i: any) => mapInterest(i, "toUser"))
          .filter((i) => i.status?.toLowerCase() !== "rejected"),
      );
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
              profileStatus: otherUser.profileStatus,
              isMillionClub: checkMillionStatus(otherUser),
              interests: otherUser.interests || [],
              education: (otherUser?.primaryEducation || otherUser?.highestEducation || otherUser?.education)
                ? { name: (otherUser.primaryEducation || otherUser.highestEducation || otherUser.education).name }
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

      setRejected(
        (rejectedRes.data || []).map((item: any) => {
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
              profileStatus: otherUser.profileStatus,
              isMillionClub: checkMillionStatus(otherUser),
              interests: otherUser.interests || [],
              education: (otherUser?.primaryEducation || otherUser?.highestEducation || otherUser?.education)
                ? { name: (otherUser.primaryEducation || otherUser.highestEducation || otherUser.education).name }
                : undefined,
              profession: otherUser.profession
                ? { name: otherUser.profession.name }
                : undefined,
              photos: otherUser.photos || [],
            },
            matchScore: item.matchPercentage ?? 0,
            status: item.status || "rejected",
          };
        }),
      );
    } catch (err) {
      console.error("Failed to fetch interests", err);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileLimit = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        console.warn("User or token missing");
        return;
      }
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

  useEffect(() => {
    Promise.all([fetchInterests(), checkProfileLimit()]);

    const handleInterestChanged = () => {
      fetchInterests();
    };

    socket.on("interest-status-changed", handleInterestChanged);
    return () => {
      socket.off("interest-status-changed", handleInterestChanged);
    };
  }, []);

  const calculateAge = (dob: string) => {
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
    return photos.find((p: any) => p.isPrimary)?.url || photos[0].url || DummyProfile;
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
      const token = localStorage.getItem("token");

      const res = await Axios.get(
        `/api/membership/view-profile/${targetUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data?.limitReached) {
        setProfileLimitReached(true);
        toast.error("Profile view limit reached. Upgrade your plan 🔒");
        return;
      }

      navigate(`/profile/${targetUserId}`);
    } catch (err: any) {
      setProfileLimitReached(true);
      toast.error(err.response?.data?.message || "Profile view limit reached");
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

      setReceived((prev) => {
        const rejectedItem = prev.find((i) => i._id === interestId);
        if (rejectedItem) {
          setRejected((r) => [...r, { ...rejectedItem, status: "rejected" }]);
        }
        return prev.filter((i) => i._id !== interestId);
      });

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
    type: "received" | "sent" | "accepted" | "rejected";
  }) => {
    const isActioning = actionLoading === item._id;
    const alreadyViewed = viewedProfiles.some((id) => String(id) === String(item.user._id));
    const locked = profileLimitReached && !alreadyViewed;
    const primaryPhoto = item.user.photos?.find((p) => p.isPrimary);
    const isPhotoHidden = primaryPhoto?.isHidden;

    const canViewHiddenPhoto = false;

    return (
      <Card className="glass-card overflow-hidden hover:shadow-md md:hover:shadow-lg transition-all rounded-xl md:rounded-2xl border border-border/40">
        <div className="grid grid-cols-[90px_1fr] md:grid-cols-[160px_1fr] min-h-[145px] md:h-[240px]">
          {/* Image Section */}
          <div className="relative overflow-hidden bg-muted rounded-l-xl md:rounded-l-2xl">
            <OptimizedProfileImage
              src={getProfilePhoto(item.user.photos, item.user.gender)}
              alt={item.user.fullName}
              isLocked={false}
              className={`w-full h-full object-cover ${isPhotoHidden && !canViewHiddenPhoto ? "blur-md" : ""
                }`}
            />

            {/* Match Badge */}
            {item.matchScore > 0 && (
              <div className="absolute top-1 left-1 md:top-2 md:right-2 md:left-auto z-10">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-[9px] md:text-xs px-1 md:px-2 py-0 md:py-0.5">
                  {item.matchScore}% Match
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-2.5 md:p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-1.5 min-w-0 mb-0.5 md:mb-1">
                <h3 className="text-xs md:text-base font-bold truncate leading-tight">
                  {item.user.fullName}, {calculateAge(item.user.dateOfBirth)}
                </h3>
                {(item.user.isMillionClub || item.user.profileStatus?.toLowerCase().includes("million")) && (
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
              <div className="flex flex-col gap-0.5 mt-0.5 md:mt-1 text-[11px] md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {item.user.city}{item.user.state ? `, ${item.user.state}` : ""}
                </span>
                <span className="hidden md:flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary/80" />
                  {item.user.education?.name || "—"}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-primary/80" />
                  {item.user.profession?.name || "—"}
                </span>
              </div>

              {item.user.interests && item.user.interests.length > 0 && (
                <div className="mt-1 md:mt-2">
                  <p className="hidden md:block text-xs font-semibold mb-1 text-foreground/80">Interests:</p>

                  {/* Mobile Interests (Compact) */}
                  <div className="flex md:hidden flex-wrap gap-1">
                    {item.user.interests.slice(0, 2).map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                        {interest}
                      </Badge>
                    ))}
                    {item.user.interests.length > 2 && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
                        +{item.user.interests.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Desktop Interests (Compact with count) */}
                  <div className="hidden md:flex flex-wrap gap-1.5 items-center">
                    {item.user.interests.slice(0, 3).map((interest, idx) => (
                      <Badge key={`${interest}-${idx}`} variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                        {interest}
                      </Badge>
                    ))}
                    {item.user.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground font-normal">
                        +{item.user.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-2 pt-1 md:pt-1.5 border-t border-border/30">
              {(type === "accepted" || (type === "sent" && item.status?.toLowerCase() === "accepted")) && (
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                  onClick={() => {
                    if (locked) {
                      toast.error("Profile view limit reached. Upgrade your plan 🔒");
                      navigate("/pricing");
                      return;
                    }
                    handleViewProfile(item.user._id);
                  }}
                >
                  {locked ?

                    <>
                      <Lock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Upgrade
                    </> :
                    <>
                      <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                      View Profile
                    </>
                  }
                </Button>
              )}

              {type === "received" && (
                <>
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    onClick={() => handleAccept(item._id, item.user.fullName)}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    onClick={() => handleReject(item._id, item.user.fullName)}
                    disabled={isActioning}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </>
              )}

              {type === "sent" && (
                <>
                  {item.status?.toLowerCase() === "accepted" ? (
                    <Button
                      disabled
                      className="flex-1 bg-green-500 text-white cursor-default hover:bg-green-500 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Accepted
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                      onClick={() => handleCancel(item._id, item.user.fullName)}
                      disabled={isActioning}
                    >
                      {isActioning ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" />
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
                  className="flex-1 bg-green-500 text-white cursor-default hover:bg-green-500 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Accepted
                </Button>
              )}

              {type === "rejected" && (
                <Button
                  disabled
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive cursor-default bg-destructive/10 text-[10px] md:text-xs h-7 md:h-8 px-1.5 md:px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  Rejected
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

  const displayedReceived = received;
  const displayedSent = sent;
  const displayedAccepted = accepted;
  const displayedRejected = rejected;

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
            <TabsTrigger value="rejected">Rejected Interests</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="received" className="mt-6">
          {displayedReceived.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedReceived.map((item) => (
                <InterestCard key={item._id} item={item} type="received" />
              ))}
            </div>
          ) : (
            <EmptyState message="No interests received yet." />
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {displayedSent.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedSent.map((item) => (
                <InterestCard key={item._id} item={item} type="sent" />
              ))}
            </div>
          ) : (
            <EmptyState message="No interests sent yet." />
          )}
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          {displayedAccepted.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedAccepted.map((item) => (
                <InterestCard key={item._id} item={item} type="accepted" />
              ))}
            </div>
          ) : (
            <EmptyState message="No accepted interests yet." />
          )}
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          {displayedRejected.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedRejected.map((item) => (
                <InterestCard key={item._id} item={item} type="rejected" />
              ))}
            </div>
          ) : (
            <EmptyState message="No rejected interests." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Interests;
