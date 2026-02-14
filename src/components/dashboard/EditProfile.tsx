import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Crown, Edit, Upload } from "lucide-react";
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

interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  dob?: string;
  height?: string;
  weight?: string;
  religion?: string;
  caste?: string;
  address?: string;
  bio?: string;
  education?: string;
  profession?: string;
  profileImage?: string;
  membership?: string;
}

interface Option {
  _id: string;
  name: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [religions, setReligions] = useState<Option[]>([]);
  const [castes, setCastes] = useState<Option[]>([]);
  const [educations, setEducations] = useState<Option[]>([]);
  const [professions, setProfessions] = useState<Option[]>([]);

  const currentMembership = profile?.membership || "Free";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

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
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dob: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        height: user.heightCm ? String(user.heightCm) : "",
        weight: user.weightKg ? String(user.weightKg) : "",
        religion: user.religion?._id || user.religion || "",
        caste: user.caste?._id || user.caste || "",
        education: user.highestEducation?._id || "",
        profession: user.profession?._id || "",
        address: user.address || "",
        bio: user.bio || "",
        membership: user.profileStatus === "BASIC" ? "Free" : "Premium",
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

      const [religionRes, educationRes, professionRes] = await Promise.all([
        Axios.get("/api/master/religions", { headers }),
        Axios.get("/api/master/educations", { headers }),
        Axios.get("/api/master/occupations", { headers }),
      ]);

      setReligions(religionRes.data.data);
      setEducations(educationRes.data.data);
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
    try {
      const token = localStorage.getItem("token");

      await Axios.put(
        `/api/users/${userId}`,
        {
          fullName: profile.fullName,
          mobile: profile.mobile,
          dateOfBirth: profile.dob,
          heightCm: Number(profile.height),
          weightKg: Number(profile.weight),
          religion: profile.religion,
          caste: profile.caste,
          highestEducation: profile.education,
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

      toast.success("Profile updated successfully 🎉", {
        description: "Your changes have been saved.",
        duration: 3000,
      });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading || !profile) {
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
              Upgrade to unlock premium features and find your match faster
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => navigate("/pricing")}
          >
            Upgrade Now
          </Button>
        </div>
      </Card>

      {/* Profile Image */}
      {/* <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Profile Image
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <Button variant="outline" className="mb-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 400x400px
            </p>
          </div>
        </div>
      </Card> */}

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
          <div>
            <Label htmlFor="education">Highest Education</Label>
            <Select
              value={profile.education || ""}
              onValueChange={(value) =>
                setProfile((p) => (p ? { ...p, education: value } : p))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Education" />
              </SelectTrigger>
              <SelectContent>
                {educations.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Select
              value={profile.profession || ""}
              onValueChange={(value) =>
                setProfile((p) => (p ? { ...p, profession: value } : p))
              }
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button
          className="bg-gradient-to-r from-primary to-secondary"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
