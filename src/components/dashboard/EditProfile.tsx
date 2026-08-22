import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Crown, Edit, Upload } from "lucide-react";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  gender?: string;
  dob?: string;
  height?: string;
  weight?: string;
  religion?: string;
  caste?: string;
  address?: string;
  bio?: string;
  education?: string;
  primaryEducation?: string;
  profession?: string;
  profileImage?: string;
  membership?: string;
  profileStatus?: string;
  hasPlan?: boolean;
}

interface Option {
  _id: string;
  name: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [religions, setReligions] = useState<Option[]>([]);
  const [castes, setCastes] = useState<Option[]>([]);
  const [primaryEducations, setPrimaryEducations] = useState<Option[]>([]);
  const [professions, setProfessions] = useState<Option[]>([]);
  const [isCustomProfession, setIsCustomProfession] = useState(false);
  const [customProfessionText, setCustomProfessionText] = useState("");
  const [hidePhoto, setHidePhoto] = useState(false);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);

  const currentMembership = profile?.membership || "Free";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;
  const [cvData, setCvData] = useState<{
    cvUrl?: string;
    cvFileName?: string;
    cvUploadedAt?: string;
  }>({});

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
      console.log("User", user);
      const primaryPhoto = user.photos?.find((p: any) => p.isPrimary);

      const planTitle =
        (typeof user.membership?.plan === "object" && user.membership?.plan?.title) ||
        (user.profileStatus && user.profileStatus.toUpperCase() !== "BASIC"
          ? user.profileStatus
          : null);

      const hasPlan = Boolean(user.membership?.plan || planTitle);

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
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        gender: formatGender(user.gender),
        dob: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        height: user.heightCm ? String(user.heightCm) : "",
        weight: user.weightKg ? String(user.weightKg) : "",
        religion: user.religion?._id || user.religion || "",
        caste: user.caste?._id || user.caste || "",
        primaryEducation: user.primaryEducation?._id || user.primaryEducation || "",
        profession: user.profession?._id || user.profession || "",
        address: user.address || "",
        bio: user.bio || "",
        membership: planTitle || "Free Account",
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchMasterData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [religionRes, primaryEduRes, higherEduRes, professionRes] =
        await Promise.all([
          Axios.get("/api/master/religions", { headers }),
          Axios.get("/api/master/primaryEducations", { headers }),
          Axios.get("/api/master/higherEducations", { headers }),
          Axios.get("/api/master/occupations", { headers }),
        ]);

      setReligions(religionRes.data.data);
      setPrimaryEducations(primaryEduRes.data.data);
      setProfessions(professionRes.data.data);
    } catch (err: any) {
      console.error("Failed to load master data", err?.response || err);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (!profile?.religion) return;

    const token = localStorage.getItem("token");

    Axios.get(`/api/master/castes?religionId=${profile.religion}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setCastes(res.data.data))
      .catch((err) =>
        console.error("Failed to load castes", err?.response || err),
      );
  }, [profile?.religion]);

  const handleSave = async () => {
    if (!profile) return;
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");

      await Axios.put(
        `/api/users/${userId}`,
        {
          fullName: profile.fullName,
          mobile: profile.mobile,
          gender: profile.gender,
          dateOfBirth: profile.dob,
          heightCm: Number(profile.height),
          weightKg: Number(profile.weight),
          religion: profile.religion,
          caste: profile.caste,
          primaryEducation: profile.primaryEducation,
          profession: profile.profession,
          address: profile.address,
          bio: profile.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Profile updated successfully", {
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

  if (
    loading ||
    !profile ||
    primaryEducations.length === 0 ||
        professions.length === 0 ||
    religions.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Badge variant="outline" className="gap-2">
          <Crown className="w-4 h-4" />
          {currentMembership} Member
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

      {/* Basic Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Basic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
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
        </div>
      </Card>

      {/* Personal Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <Label>Hide Profile Photo</Label>

            <button
              onClick={handleHidePhotoToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                hidePhoto ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  hidePhoto ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={profile.height || ""}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, height: e.target.value } : p))
              }
            />{" "}
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={profile.weight || ""}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, weight: e.target.value } : p))
              }
            />{" "}
          </div>
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
          <div>
            <Label htmlFor="caste">Caste</Label>
            <Select
              value={profile.caste || ""}
              onValueChange={(value) =>
                setProfile((p) => (p ? { ...p, caste: value } : p))
              }
              disabled={!profile.religion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Caste" />
              </SelectTrigger>
              <SelectContent>
                {castes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={profile?.address || ""}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, address: e.target.value } : p))
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Bio</Label>
            <Textarea
              id="bio"
              value={profile?.bio || ""}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, bio: e.target.value } : p))
              }
            />
          </div>
        </div>
      </Card>

      {/* Educational Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Educational Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Qualification Level */}
          <div>
            <Label>Qualification Level</Label>
            <Select
              value={profile.primaryEducation || ""}
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
            <Select
              value={isCustomProfession ? "OTHER" : (profile.profession || "")}
              onValueChange={(value) => {
                if (value === "OTHER") {
                  setIsCustomProfession(true);
                  setProfile((p) => (p ? { ...p, profession: customProfessionText } : p));
                } else {
                  setIsCustomProfession(false);
                  setProfile((p) => (p ? { ...p, profession: value } : p));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Profession" />
              </SelectTrigger>
              <SelectContent>
                {professions.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectItem value="OTHER" className="text-primary font-medium">
                  + Add Custom Profession
                </SelectItem>
              </SelectContent>
            </Select>

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
        </div>
      </Card>

      {/* CV / Resume Section */}
      <CvSection
        userId={userId}
        cvUrl={cvData.cvUrl}
        cvFileName={cvData.cvFileName}
        cvUploadedAt={cvData.cvUploadedAt}
        onCvUpdated={fetchProfile}
      />

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button
          className="bg-gradient-to-r from-primary to-secondary"
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
    </div>
  );
};

export default EditProfile;
