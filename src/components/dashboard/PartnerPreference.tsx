import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "@/axios/axios";
import { toast } from "sonner";

/* ================= TYPES ================= */
interface Religion {
  _id: string;
  name: string;
}

interface Education {
  _id: string;
  name: string;
}

/* ================= COMPONENT ================= */
const PartnerPreference = () => {
  /* ---------- Sliders ---------- */
  const [ageRange, setAgeRange] = useState<number[]>([25, 35]);
  const [heightRange, setHeightRange] = useState<number[]>([150, 180]);

  /* ---------- Master Data ---------- */
  const [religions, setReligions] = useState<Religion[]>([]);

  /* ---------- Selected Values (IDs) ---------- */
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  /* ---------- Static (can later convert to API) ---------- */
  const [educations, setEducations] = useState<Education[]>([]);

  const interests = [
    "Travel",
    "Music",
    "Reading",
    "Sports",
    "Cooking",
    "Art",
    "Technology",
  ];

  /* ================= FETCH RELIGIONS ================= */
  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("No auth token found. Please login again.");
          return;
        }

        const response = await Axios.get("/api/master/religions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // API returns: { total, take, skip, data: [] }
        setReligions(response.data.data);
      } catch (error: any) {
        console.error(error);

        if (error?.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
        } else {
          toast.error("Failed to load religions");
        }
      }
    };

    fetchReligions();
  }, []);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("No auth token found. Please login again.");
          return;
        }

        const response = await Axios.get("/api/master/educations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // paginated response
        setEducations(response.data.data);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load education levels");
      }
    };

    fetchEducations();
  }, []);

  /* ================= TOGGLE HANDLER ================= */
  const toggleSelection = (
    value: string,
    list: string[],
    setter: (val: string[]) => void,
  ) => {
    if (list.includes(value)) {
      setter(list.filter((i) => i !== value));
    } else {
      setter([...list, value]);
    }
  };

  /* ================= SAVE API ================= */
  const handleSavePreferences = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No auth token found. Please login again.");
        return;
      }

      const payload = {
        ageRange: {
          min: ageRange[0],
          max: ageRange[1],
        },
        heightRangeCm: {
          min: heightRange[0],
          max: heightRange[1],
        },
        religions: selectedReligions, // IDs
        educationLevels: selectedEducation, // IDs
        interests: selectedInterests,
      };

      await Axios.post("/api/user/partner-preferences/me", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Partner preferences saved successfully ✅");
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to save preferences",
        );
      }
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partner Preference</h2>
        <Button
          className="bg-gradient-to-r from-primary to-secondary"
          onClick={handleSavePreferences}
        >
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Range */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Age Range</Label>
          <Slider
            value={ageRange}
            onValueChange={setAgeRange}
            min={18}
            max={60}
            step={1}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>{ageRange[0]} years</span>
            <span>{ageRange[1]} years</span>
          </div>
        </Card>

        {/* Height Range */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">
            Height Range (cm)
          </Label>
          <Slider
            value={heightRange}
            onValueChange={setHeightRange}
            min={140}
            max={200}
            step={1}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>{heightRange[0]} cm</span>
            <span>{heightRange[1]} cm</span>
          </div>
        </Card>

        {/* Religion (API Driven) */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Religion</Label>
          <div className="flex flex-wrap gap-2">
            {religions.map((religion) => (
              <Badge
                key={religion._id}
                variant={
                  selectedReligions.includes(religion._id)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer py-2 px-4 ${
                  selectedReligions.includes(religion._id)
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : ""
                }`}
                onClick={() =>
                  toggleSelection(
                    religion._id,
                    selectedReligions,
                    setSelectedReligions,
                  )
                }
              >
                {religion.name}
                {selectedReligions.includes(religion._id) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">
            Education Level
          </Label>
          <div className="flex flex-wrap gap-2">
            {educations.map((edu) => (
              <Badge
                key={edu._id}
                variant={
                  selectedEducation.includes(edu._id) ? "default" : "outline"
                }
                className={`cursor-pointer py-2 px-4 ${
                  selectedEducation.includes(edu._id)
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : ""
                }`}
                onClick={() =>
                  toggleSelection(
                    edu._id,
                    selectedEducation,
                    setSelectedEducation,
                  )
                }
              >
                {edu.name}
                {selectedEducation.includes(edu._id) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Interests */}
        <Card className="glass-card p-6 lg:col-span-2">
          <Label className="text-lg font-semibold mb-4 block">Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge
                key={interest}
                variant={
                  selectedInterests.includes(interest) ? "default" : "outline"
                }
                className={`cursor-pointer py-2 px-4 ${
                  selectedInterests.includes(interest)
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : ""
                }`}
                onClick={() =>
                  toggleSelection(
                    interest,
                    selectedInterests,
                    setSelectedInterests,
                  )
                }
              >
                {interest}
                {selectedInterests.includes(interest) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerPreference;
