import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Edit, Upload, Camera, Plus, Star, Check, Sparkles } from "lucide-react";
import ProtectedProfileImage from "./ProtectedProfileImage";
import CvSection from "@/components/dashboard/CvSection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "@/axios/axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserProfile {
  accountFor?: string;
  fullName: string;
  email: string;
  mobile: string;
  alternateMobile?: string;
  gender?: string;
  dob?: string;
  preferredLanguage?: string;
  address?: string;

  height?: string;
  weight?: string;
  maritalStatus?: string;
  bodyType?: string;
  physicallyChallenged?: boolean;
  livingWithFamily?: boolean;
  bio?: string;

  primaryEducation?: string;
  profession?: string;
  incomeAmount?: string;
  incomeType?: string;

  city?: string;
  religion?: string;
  caste?: string;
  motherTongue?: string;

  interests?: string[];
  personalityTraits?: string;
  dietPreference?: string;

  profileImage?: string;
  membership?: string;
  profileStatus?: string;
  hasPlan?: boolean;
}

interface Option {
  _id: string;
  name: string;
}

interface EditProfileProps {
  onNavigate?: (tab: string) => void;
}

interface PhotoItem {
  _id: string;
  url: string;
  isPrimary: boolean;
  approvalStatus?: string;
  isHidden?: boolean;
}

const PREDEFINED_INTERESTS = [
  "Spending Time with Friends",
  "Café & Coffee",
  "Spending Time with Family",
  "Exploring New Places",
  "Playing Musical Instruments",
  "Singing",
  "Spiritual Activities",
  "Volunteering & Charity",
  "Social Activities",
  "Beach & Nature",
  "Food & Dining",
  "Shopping",
  "Writing",
  "Business & Entrepreneurship",
  "Technology",
  "Outdoor Activities",
  "Cycling",
  "Swimming",
  "Yoga & Meditation",
  "Pets & Animals",
  "Gardening",
  "Dancing",
  "Art & Drawing",
  "Photography",
  "Cooking",
  "Gaming",
  "Fitness & Gym",
  "Sports",
  "Travelling",
  "Movies & TV Shows",
  "Music",
  "Reading",
];

const EditProfile: React.FC<EditProfileProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [religions, setReligions] = useState<Option[]>([]);
  const [castes, setCastes] = useState<Option[]>([]);
  const [primaryEducations, setPrimaryEducations] = useState<Option[]>([]);
  const [professions, setProfessions] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<Option[]>([]);
  const [masterInterests, setMasterInterests] = useState<Option[]>([]);

  const [isCustomProfession, setIsCustomProfession] = useState(false);
  const [customProfessionText, setCustomProfessionText] = useState("");
  const [hidePhoto, setHidePhoto] = useState(false);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const [userPhotos, setUserPhotos] = useState<PhotoItem[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // Email update modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"INPUT" | "OTP">("INPUT");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);

  const currentMembership = profile?.membership || "Free";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;
  const [cvData, setCvData] = useState<{
    cvUrl?: string;
    cvFileName?: string;
    cvUploadedAt?: string;
  }>({});

  const handleSendEmailOtp = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (newEmail.trim().toLowerCase() === profile?.email?.trim().toLowerCase()) {
      toast.error("New email must be different from current email");
      return;
    }

    setSendingEmailOtp(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.post(
        `/api/users/${userId}/send-email-otp`,
        { newEmail: newEmail.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "OTP sent to your new email");
      setEmailStep("OTP");
    } catch (err: any) {
      console.error("Failed to send email update OTP", err);
      toast.error(err.response?.data?.message || "Failed to send OTP to new email");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.trim().length < 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    setVerifyingEmailOtp(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.post(
        `/api/users/${userId}/verify-email-otp`,
        { newEmail: newEmail.trim(), otp: emailOtp.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Email address updated successfully!");

      setProfile((prev) => (prev ? { ...prev, email: res.data.email || newEmail.trim() } : prev));

      try {
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (cachedUser) {
          cachedUser.email = res.data.email || newEmail.trim();
          localStorage.setItem("user", JSON.stringify(cachedUser));
        }
      } catch (e) {
        console.error("Error updating local storage user:", e);
      }

      window.dispatchEvent(new Event("userProfileUpdated"));
      setShowEmailModal(false);
    } catch (err: any) {
      console.error("Failed to verify email OTP", err);
      toast.error(err.response?.data?.message || "Invalid OTP. Verification failed.");
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await Axios.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;
      const primaryPhoto = user.photos?.find((p: any) => p.isPrimary);

      const planTitle =
        (typeof user.membership?.plan === "object" && (user.membership?.plan?.title || user.membership?.plan?.name)) ||
        (typeof user.membership?.plan === "string" && user.membership.plan) ||
        (user.profileStatus && user.profileStatus.toLowerCase().includes("million")
          ? "Million Club"
          : null);

      const hasPlan = Boolean(planTitle && planTitle !== "Free Plan");

      const formatGender = (g?: string) => {
        if (!g) return "";
        const lower = g.toLowerCase();
        if (lower === "male") return "Male";
        if (lower === "female") return "Female";
        if (lower === "gay") return "Gay";
        if (lower === "lesbian") return "Lesbian";
        return g;
      };

      setPrimaryPhotoId(primaryPhoto?._id || null);
      setHidePhoto(primaryPhoto?.isHidden || false);
      setProfile({
        accountFor: user.accountFor || "Self",
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        alternateMobile: user.alternateMobile || "",
        gender: formatGender(user.gender),
        dob: user.dateOfBirth
          ? (typeof user.dateOfBirth === "string" ? user.dateOfBirth.slice(0, 10) : new Date(user.dateOfBirth).toISOString().slice(0, 10))
          : "",
        preferredLanguage: user.preferredLanguage || "English",
        address: user.address || "",

        height: user.heightCm ? String(user.heightCm) : "",
        weight: user.weightKg ? String(user.weightKg) : "",
        maritalStatus: user.maritalStatus || "Single",
        bodyType: user.bodyType || "Average",
        physicallyChallenged: Boolean(user.physicallyChallenged),
        livingWithFamily: user.livingWithFamily !== undefined ? Boolean(user.livingWithFamily) : true,
        bio: user.bio || "",

        primaryEducation: user.primaryEducation?._id || user.primaryEducation || "",
        profession: user.profession?._id || user.profession || "",
        incomeAmount: user.income?.amount ? String(user.income.amount) : "",
        incomeType: user.income?.type || "Yearly",

        city: typeof user.city === "object" ? user.city?.name || user.city?.city || "" : user.city || "",
        religion: user.religion?._id || user.religion || "",
        caste: user.caste?._id || user.caste || "",
        motherTongue: user.motherTongue?._id || user.motherTongue || "",

        interests: Array.isArray(user.interests) ? user.interests : [],
        personalityTraits: Array.isArray(user.personalityTraits)
          ? user.personalityTraits.join(", ")
          : user.personalityTraits || "",
        dietPreference: Array.isArray(user.dietPreference)
          ? user.dietPreference.join(", ")
          : user.dietPreference || "Non-Vegetarian",

        membership: planTitle || "Free Plan",
        hasPlan,
      });

      setCvData({
        cvUrl: user.cv?.url || "",
        cvFileName: user.cv?.fileName || user.cv?.url?.split("/").pop() || "",
        cvUploadedAt: user.cv?.uploadedAt || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPhotos = async () => {
    if (!userId) return;
    setLoadingPhotos(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await Axios.get(`/api/users/${userId}/photos`, { headers });
      setUserPhotos(res.data || []);
      const primary = (res.data || []).find((p: any) => p.isPrimary);
      if (primary) {
        setPrimaryPhotoId(primary._id || primary.id);
        setHidePhoto(primary.isHidden || false);
      }
    } catch (err) {
      console.error("Failed to fetch user photos in EditProfile", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPhotos();
  }, []);

  const fetchMasterData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [religionRes, primaryEduRes, professionRes, langRes, interestRes] =
        await Promise.all([
          Axios.get("/api/master/religions", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/primaryEducations", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/occupations", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/languages", { headers }).catch(() => ({ data: { data: [] } })),
          Axios.get("/api/master/interests", { headers }).catch(() => ({ data: { data: [] } })),
        ]);

      setReligions(religionRes.data?.data || []);
      setPrimaryEducations(primaryEduRes.data?.data || []);
      setProfessions(professionRes.data?.data || []);
      setLanguages(langRes.data?.data || []);
      setMasterInterests(interestRes.data?.data || []);
    } catch (err: any) {
      console.error("Failed to load master data", err?.response || err);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (!profile?.religion) {
      setCastes([]);
      return;
    }

    const token = localStorage.getItem("token");

    Axios.get(`/api/master/castes?religionId=${profile.religion}&religion=${profile.religion}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const rawCastes = res.data?.data || [];
        const filtered = rawCastes.filter((c: any) => {
          const cReligionId = typeof c.religion === "object" ? c.religion?._id : c.religion;
          return cReligionId === profile.religion;
        });
        setCastes(filtered);
      })
      .catch((err) =>
        console.error("Failed to load castes", err?.response || err),
      );
  }, [profile?.religion]);

  const handleSetPrimaryPhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await Axios.patch(
        `/api/users/${userId}/photos/${photoId}/primary`,
        {},
        { headers }
      );

      toast.success("Profile photo updated 🎉");
      setPrimaryPhotoId(photoId);

      setUserPhotos((prev) =>
        prev.map((p) => ({
          ...p,
          isPrimary: (p._id || (p as any).id) === photoId,
        }))
      );

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser && Array.isArray(currentUser.photos)) {
        currentUser.photos = currentUser.photos.map((p: any) => ({
          ...p,
          isPrimary: (p._id || (p as any).id) === photoId,
        }));
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else if (res.data?.photos) {
        currentUser.photos = res.data.photos;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      window.dispatchEvent(new Event("userProfileUpdated"));
    } catch (err: any) {
      console.error("Error setting primary photo:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile photo");
    }
  };

  const handleAddPhotoRedirect = () => {
    if (onNavigate) {
      onNavigate("my-photos");
    } else {
      navigate("/dashboard?tab=my-photos");
    }
  };

  const handleToggleInterest = (interestName: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const current = prev.interests || [];
      const exists = current.includes(interestName);
      const updated = exists
        ? current.filter((i) => i !== interestName)
        : [...current, interestName];
      return { ...prev, interests: updated };
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload: Record<string, any> = {
        accountFor: profile.accountFor,
        fullName: profile.fullName,
        mobile: profile.mobile,
        alternateMobile: profile.alternateMobile,
        gender: profile.gender,
        dateOfBirth: profile.dob,
        dob: profile.dob,
        preferredLanguage: profile.preferredLanguage,
        address: profile.address,

        heightCm: profile.height ? Number(profile.height) : undefined,
        weightKg: profile.weight ? Number(profile.weight) : undefined,
        maritalStatus: profile.maritalStatus,
        bodyType: profile.bodyType,
        physicallyChallenged: profile.physicallyChallenged,
        livingWithFamily: profile.livingWithFamily,
        bio: profile.bio,

        primaryEducation: profile.primaryEducation,
        profession: profile.profession,

        city: profile.city,
        religion: profile.religion,
        caste: profile.caste,
        motherTongue: profile.motherTongue,

        interests: Array.isArray(profile.interests) ? profile.interests : [],
        personalityTraits: typeof profile.personalityTraits === "string"
          ? profile.personalityTraits.split(",").map((s) => s.trim()).filter(Boolean)
          : profile.personalityTraits,
        dietPreference: typeof profile.dietPreference === "string"
          ? profile.dietPreference.split(",").map((s) => s.trim()).filter(Boolean)
          : profile.dietPreference,
      };

      if (profile.incomeAmount) {
        payload.income = {
          amount: Number(profile.incomeAmount),
          type: profile.incomeType || "Yearly",
        };
      }

      await Axios.put(`/api/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully 🎉", {
        description: "Your changes have been saved.",
        duration: 3000,
      });
      window.dispatchEvent(new Event("userProfileUpdated"));
      setShowConfirm(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleHidePhotoToggle = async () => {
    if (!primaryPhotoId) return;

    try {
      const token = localStorage.getItem("token");

      await Axios.patch(
        `/api/users/hide-photo/${primaryPhotoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHidePhoto((prev) => !prev);

      toast.success(
        !hidePhoto
          ? "Profile photo hidden successfully 🔒"
          : "Profile photo is now visible 👁️",
      );
      window.dispatchEvent(new Event("userProfileUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update photo visibility");
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground font-medium animate-pulse">Loading profile…</p>
      </div>
    );
  }

  // Interest list for chips
  const interestList =
    masterInterests.length > 0
      ? masterInterests.map((i) => i.name)
      : PREDEFINED_INTERESTS;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Badge variant="outline" className="gap-2">
          <Crown className="w-4 h-4 text-primary" />
          {currentMembership.includes("Free") ? "Free Plan" : `${currentMembership} Member`}
        </Badge>
      </div>

      {/* Membership Section */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Current Membership: {currentMembership}
            </h3>
            <p className="text-sm text-muted-foreground">
              {profile?.hasPlan
                ? "You have an active membership plan"
                : "Upgrade to unlock premium features and find your match faster"}
            </p>
          </div>
          {!profile?.hasPlan && (
            <Button
              className="bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/pricing")}
            >
              Upgrade Now
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Photo Section */}
      <Card className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/40">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Profile Photo
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your main profile picture from your uploaded photos or add new ones
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs font-medium text-muted-foreground">Hide Photo:</span>
              <button
                type="button"
                onClick={handleHidePhotoToggle}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  hidePhoto ? "bg-primary" : "bg-gray-300"
                }`}
                title="Toggle profile photo visibility"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    hidePhoto ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <Button
              type="button"
              className="bg-gradient-to-r from-primary to-secondary text-white gap-2 font-medium shadow-sm hover:opacity-95 text-xs sm:text-sm"
              onClick={handleAddPhotoRedirect}
            >
              <Plus className="w-4 h-4" />
              Upload / Manage Photos
            </Button>
          </div>
        </div>

        {/* Photos Grid from My Photos */}
        {loadingPhotos ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Loading photos...
          </div>
        ) : userPhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {userPhotos.map((photo) => {
              const photoId = photo._id || (photo as any).id;
              const isPrimary = photo.isPrimary || photoId === primaryPhotoId;

              return (
                <div
                  key={photoId}
                  className={`relative aspect-square rounded-xl overflow-hidden group border-2 transition-all ${
                    isPrimary
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-border/60 hover:border-primary/50"
                  }`}
                >
                  <ProtectedProfileImage
                    src={photo.url}
                    alt="User photo"
                    className="w-full h-full object-cover"
                    showWatermark={false}
                  />

                  {/* Primary Badge or Action Overlay */}
                  {isPrimary ? (
                    <div className="absolute top-2 left-2 z-20">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-[10px] px-2 py-0.5 flex items-center gap-1 font-semibold border-none shadow-sm">
                        <Star className="w-3 h-3 fill-white" />
                        Profile Picture
                      </Badge>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center p-2">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-white/90 hover:bg-white text-foreground text-xs font-semibold gap-1 shadow-md w-full"
                        onClick={() => handleSetPrimaryPhoto(photoId)}
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Set as Profile
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Redirect / Add Photo Slot Card */}
            <div
              onClick={handleAddPhotoRedirect}
              className="aspect-square rounded-xl border-2 border-dashed border-primary/40 hover:border-primary bg-muted/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 p-3 text-center cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-foreground">Add New Photo</span>
              <span className="text-[10px] text-muted-foreground">Goes to My Photos</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/15 rounded-xl border border-dashed border-border/60 p-6 space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No Photos Uploaded Yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your photos in My Photos to select your profile picture.
              </p>
            </div>
            <Button
              type="button"
              className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-full px-5 py-2 flex items-center gap-2 shadow-sm"
              onClick={handleAddPhotoRedirect}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Go to My Photos to Upload</span>
            </Button>
          </div>
        )}
      </Card>

      {/* Main Form Sections Organized into Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <Card className="glass-card p-2 md:p-3 mb-6">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-1.5 bg-transparent h-auto p-0">
            <TabsTrigger value="basic" className="rounded-lg py-2.5 font-semibold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white shadow-none">
              Basic
            </TabsTrigger>
            <TabsTrigger value="personal" className="rounded-lg py-2.5 font-semibold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white shadow-none">
              Personal
            </TabsTrigger>
            <TabsTrigger value="education" className="rounded-lg py-2.5 font-semibold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white shadow-none">
              Education & Work
            </TabsTrigger>
            <TabsTrigger value="additional" className="rounded-lg py-2.5 font-semibold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white shadow-none">
              Additional & Lifestyle
            </TabsTrigger>
          </TabsList>
        </Card>

        {/* TAB 1: BASIC DETAILS */}
        <TabsContent value="basic">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountFor">Account For</Label>
                <Select
                  value={profile?.accountFor || "Self"}
                  onValueChange={(val) => setProfile((p) => p && { ...p, accountFor: val })}
                >
                  <SelectTrigger id="accountFor">
                    <SelectValue placeholder="Select who this account is for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Relative">Relative</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile?.fullName || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, fullName: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmail(profile?.email || "");
                      setEmailStep("INPUT");
                      setEmailOtp("");
                      setShowEmailModal(true);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Email
                  </button>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-gray-50 text-gray-700 border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profile?.mobile || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, mobile: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="alternateMobile">Alternative Mobile Number <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                <Input
                  id="alternateMobile"
                  placeholder="Enter alternative mobile number"
                  value={profile?.alternateMobile || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, alternateMobile: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile?.gender || ""}
                  onValueChange={(value) =>
                    setProfile((prev) =>
                      prev ? { ...prev, gender: value } : prev,
                    )
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Gay">Gay</SelectItem>
                    <SelectItem value="Lesbian">Lesbian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile?.dob?.slice(0, 10) || ""}
                  onChange={(e) =>
                    setProfile((prev) =>
                      prev ? { ...prev, dob: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={profile?.preferredLanguage || "English"}
                  onValueChange={(val) => setProfile((p) => p && { ...p, preferredLanguage: val })}
                >
                  <SelectTrigger id="preferredLanguage">
                    <SelectValue placeholder="Select Preferred Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Malayalam">Malayalam</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Marathi">Marathi</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Gujarati">Gujarati</SelectItem>
                    <SelectItem value="Punjabi">Punjabi</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={profile?.address || ""}
                  onChange={(e) =>
                    setProfile((p) => (p ? { ...p, address: e.target.value } : p))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: PERSONAL DETAILS */}
        <TabsContent value="personal">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g. 170"
                  value={profile?.height || ""}
                  onChange={(e) =>
                    setProfile((p) => (p ? { ...p, height: e.target.value } : p))
                  }
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g. 70"
                  value={profile?.weight || ""}
                  onChange={(e) =>
                    setProfile((p) => (p ? { ...p, weight: e.target.value } : p))
                  }
                />
              </div>
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select
                  value={profile?.maritalStatus || ""}
                  onValueChange={(val) => setProfile((p) => p && { ...p, maritalStatus: val })}
                >
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single / Never Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Awaiting Divorce">Awaiting Divorce</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Annulled">Annulled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bodyType">Body Type</Label>
                <Select
                  value={profile?.bodyType || ""}
                  onValueChange={(val) => setProfile((p) => p && { ...p, bodyType: val })}
                >
                  <SelectTrigger id="bodyType">
                    <SelectValue placeholder="Select Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slim">Slim</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Physically Challenged */}
              <div className="p-3 border rounded-xl bg-muted/10">
                <Label className="block mb-2 text-sm font-medium">Physically Challenged</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="physicallyChallenged"
                      checked={profile?.physicallyChallenged === false}
                      onChange={() => setProfile((p) => p && { ...p, physicallyChallenged: false })}
                      className="accent-primary w-4 h-4"
                    />
                    No
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="physicallyChallenged"
                      checked={profile?.physicallyChallenged === true}
                      onChange={() => setProfile((p) => p && { ...p, physicallyChallenged: true })}
                      className="accent-primary w-4 h-4"
                    />
                    Yes
                  </label>
                </div>
              </div>

              {/* Living With Family */}
              <div className="p-3 border rounded-xl bg-muted/10">
                <Label className="block mb-2 text-sm font-medium">Living With Family</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="livingWithFamily"
                      checked={profile?.livingWithFamily === true}
                      onChange={() => setProfile((p) => p && { ...p, livingWithFamily: true })}
                      className="accent-primary w-4 h-4"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="livingWithFamily"
                      checked={profile?.livingWithFamily === false}
                      onChange={() => setProfile((p) => p && { ...p, livingWithFamily: false })}
                      className="accent-primary w-4 h-4"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio / About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a few lines about yourself..."
                  value={profile?.bio || ""}
                  onChange={(e) =>
                    setProfile((p) => (p ? { ...p, bio: e.target.value } : p))
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: EDUCATION & WORK */}
        <TabsContent value="education">
          <Card className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Educational & Career Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Qualification Level */}
              <div>
                <Label>Qualification Level</Label>
                <Select
                  value={profile?.primaryEducation || ""}
                  onValueChange={(value) =>
                    setProfile((p) => (p ? { ...p, primaryEducation: value } : p))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Qualification Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryEducations.map((e) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Profession */}
              <div>
                <Label htmlFor="profession">Profession</Label>
                <SearchableSelect
                  options={professions}
                  value={profile?.profession || ""}
                  onValueChange={(value) => {
                    if (value === "OTHER") {
                      setIsCustomProfession(true);
                      setProfile((p) => (p ? { ...p, profession: customProfessionText } : p));
                    } else {
                      setIsCustomProfession(false);
                      setProfile((p) => (p ? { ...p, profession: value } : p));
                    }
                  }}
                  placeholder="Select Profession"
                  searchPlaceholder="Search profession..."
                  allowCustom={true}
                  customLabel="+ Add Custom Profession"
                  isCustomSelected={isCustomProfession}
                  onCustomSelect={() => {
                    setIsCustomProfession(true);
                    setProfile((p) => (p ? { ...p, profession: customProfessionText } : p));
                  }}
                />

                {isCustomProfession && (
                  <div className="mt-2 animate-fade-in">
                    <Label className="text-xs text-muted-foreground mb-1 block">Specify Custom Profession</Label>
                    <Input
                      placeholder="Enter custom profession..."
                      value={customProfessionText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomProfessionText(val);
                        setProfile((p) => (p ? { ...p, profession: val } : p));
                      }}
                      className="h-10 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Income Amount */}
              <div>
                <Label htmlFor="incomeAmount">Income Amount</Label>
                <Input
                  id="incomeAmount"
                  type="number"
                  placeholder="e.g. 1200000"
                  value={profile?.incomeAmount || ""}
                  onChange={(e) => setProfile((p) => p && { ...p, incomeAmount: e.target.value })}
                />
              </div>

              {/* Income Type */}
              <div>
                <Label htmlFor="incomeType">Income Type</Label>
                <Select
                  value={profile?.incomeType || "Yearly"}
                  onValueChange={(val) => setProfile((p) => p && { ...p, incomeType: val })}
                >
                  <SelectTrigger id="incomeType">
                    <SelectValue placeholder="Select Income Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CV / Resume Section */}
            <div className="pt-4 border-t">
              <CvSection
                userId={userId}
                cvUrl={cvData.cvUrl}
                cvFileName={cvData.cvFileName}
                cvUploadedAt={cvData.cvUploadedAt}
                onCvUpdated={fetchProfile}
              />
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: ADDITIONAL & LIFESTYLE */}
        <TabsContent value="additional">
          <Card className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Additional Details & Lifestyle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City (Text Input) */}
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Type your city (e.g. Bangalore, Kochi)"
                  value={profile?.city || ""}
                  onChange={(e) => setProfile((p) => p && { ...p, city: e.target.value })}
                />
              </div>

              {/* Religion */}
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Select
                  value={profile?.religion || ""}
                  onValueChange={(value) =>
                    setProfile((p) => p && { ...p, religion: value, caste: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {religions.map((r) => (
                      <SelectItem key={r._id} value={r._id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Caste */}
              <div>
                <Label htmlFor="caste">Caste</Label>
                <Select
                  value={profile?.caste || ""}
                  onValueChange={(value) =>
                    setProfile((p) => (p ? { ...p, caste: value } : p))
                  }
                  disabled={!profile?.religion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Caste" />
                  </SelectTrigger>
                  <SelectContent>
                    {castes.length === 0 ? (
                      <SelectItem value="no-castes" disabled>
                        No castes available
                      </SelectItem>
                    ) : (
                      castes.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Mother Tongue */}
              <div>
                <Label htmlFor="motherTongue">Mother Tongue</Label>
                <Select
                  value={profile?.motherTongue || ""}
                  onValueChange={(val) => setProfile((p) => p && { ...p, motherTongue: val })}
                >
                  <SelectTrigger id="motherTongue">
                    <SelectValue placeholder="Select Mother Tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l._id} value={l._id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Diet Preference */}
              <div>
                <Label htmlFor="dietPreference">Diet Preference</Label>
                <Select
                  value={profile?.dietPreference || "Non-Vegetarian"}
                  onValueChange={(val) => setProfile((p) => p && { ...p, dietPreference: val })}
                >
                  <SelectTrigger id="dietPreference">
                    <SelectValue placeholder="Select Diet Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Personality Traits */}
              <div>
                <Label htmlFor="personalityTraits">Personality Traits <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span></Label>
                <Input
                  id="personalityTraits"
                  placeholder="e.g. friendly, honest, adventourous, calm"
                  value={profile?.personalityTraits || ""}
                  onChange={(e) => setProfile((p) => p && { ...p, personalityTraits: e.target.value })}
                />
              </div>
            </div>

            {/* Interests Chips Selection */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Interests & Hobbies
                </Label>
                <span className="text-xs text-muted-foreground">
                  {(profile?.interests || []).length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-3 rounded-xl border bg-muted/10">
                {interestList.map((interest) => {
                  const isSelected = (profile?.interests || []).includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 font-medium cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-background hover:bg-muted text-foreground border-border/80"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>

              {(profile?.interests || []).length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Selected Interests: </span>
                  {(profile?.interests || []).join(", ")}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={() => fetchProfile()}>
          Cancel
        </Button>
        <Button
          className="bg-gradient-to-r from-primary to-secondary px-8 font-semibold shadow-md"
          onClick={() => setShowConfirm(true)}
        >
          Save Changes
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Profile Changes"
        description="Are you sure you want to update your profile information?"
        confirmText="Save Changes"
        loading={saveLoading}
        onConfirm={handleSave}
      />

      {/* Email Change OTP Dialog */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Update Email Address
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {emailStep === "INPUT"
                ? "Enter your new email address to receive an OTP verification code."
                : `We sent a 4-digit code to ${newEmail}. Please enter it below.`}
            </DialogDescription>
          </DialogHeader>

          {emailStep === "INPUT" ? (
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="modal-new-email" className="text-sm font-medium text-gray-700">
                  New Email Address
                </Label>
                <Input
                  id="modal-new-email"
                  type="email"
                  placeholder="name@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={sendingEmailOtp || !newEmail.trim()}
                  onClick={handleSendEmailOtp}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {sendingEmailOtp ? "Sending OTP..." : "Send OTP"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="modal-otp" className="text-sm font-medium text-gray-700">
                  Verification OTP
                </Label>
                <Input
                  id="modal-otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="mt-1 text-center font-mono text-lg tracking-widest"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  disabled={sendingEmailOtp}
                  onClick={handleSendEmailOtp}
                  className="text-rose-600 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                >
                  {sendingEmailOtp ? "Resending..." : "Resend OTP"}
                </button>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailStep("INPUT")}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={verifyingEmailOtp || !emailOtp.trim()}
                  onClick={handleVerifyEmailOtp}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {verifyingEmailOtp ? "Verifying..." : "Verify & Update Email"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
