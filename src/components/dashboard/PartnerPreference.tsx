import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "@/axios/axios";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/* ================= TYPES ================= */
interface Religion {
  _id: string;
  name: string;
}

interface Education {
  _id: string;
  name: string;
}

interface Caste {
  _id: string;
  name: string;
  religion?: string | { _id: string; name: string };
}

const staticDietOptions = [
  { id: "veg", name: "Vegetarian", icon: "🥗" },
  { id: "non-veg", name: "Non-Veg", icon: "🍗" },
  { id: "vegan", name: "Vegan", icon: "🌱" },
  { id: "eggetarian", name: "Eggetarian", icon: "🥚" },
  { id: "jain", name: "Jain", icon: "🙏" },
];

const staticTraitsOptions = [
  { id: "friendly", name: "Friendly", icon: "😊" },
  { id: "ambitious", name: "Ambitious", icon: "🎯" },
  { id: "creative", name: "Creative", icon: "💡" },
  { id: "honest", name: "Honest", icon: "✨" },
  { id: "caring", name: "Caring", icon: "❤️" },
  { id: "funny", name: "Funny", icon: "😄" },
  { id: "intelligent", name: "Intelligent", icon: "🧠" },
  { id: "patient", name: "Patient", icon: "🕊️" },
];

const staticMaritalStatusOptions = [
  "Single",
  "Widowed",
  "Divorced",
  "Awaiting Divorce",
  "Married",
  "Annulled",
];

const staticLocationSuggestions = [
  "Kochi",
  "Trivandrum",
  "Kozhikode",
  "Thrissur",
  "Kottayam",
  "Palakkad",
  "Kannur",
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Dubai",
];

/* ================= COMPONENT ================= */
const PartnerPreference = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  /* ---------- Sliders ---------- */
  const [ageRange, setAgeRange] = useState<number[]>([25, 35]);
  const [heightRange, setHeightRange] = useState<number[]>([150, 180]);

  /* ---------- Master Data ---------- */
  const [religions, setReligions] = useState<Religion[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [loadingCastes, setLoadingCastes] = useState<boolean>(false);

  /* ---------- Selected Values (IDs) ---------- */
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [newLocationInput, setNewLocationInput] = useState<string>("");

  /* ---------- Master & Custom Interests ---------- */
  const [educations, setEducations] = useState<Education[]>([]);
  const [masterInterests, setMasterInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newInterestInput, setNewInterestInput] = useState<string>("");

  /* ================= LOAD EXISTING PREFERENCES ================= */
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await Axios.get("/api/user/partner-preferences/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (!data) return;

        // 🔹 Set sliders
        if (data.ageRange) {
          setAgeRange([data.ageRange.min, data.ageRange.max]);
        }

        if (data.heightRangeCm) {
          setHeightRange([data.heightRangeCm.min, data.heightRangeCm.max]);
        }

        // 🔹 Set selected IDs
        if (data.religions) {
          setSelectedReligions(data.religions);
        }

        if (data.castes) {
          setSelectedCastes(data.castes);
        }

        if (data.educationLevels) {
          setSelectedEducation(data.educationLevels);
        }

        if (data.interests) {
          setSelectedInterests(data.interests);
        }

        if (data.diets || data.dietPreferences) {
          setSelectedDiets(data.diets || data.dietPreferences);
        }

        if (data.personalityTraits || data.traits) {
          setSelectedTraits(data.personalityTraits || data.traits);
        }

        if (data.maritalStatuses || data.maritalStatus) {
          setSelectedMaritalStatuses(data.maritalStatuses || data.maritalStatus);
        }

        if (data.locations || data.places) {
          setSelectedLocations(data.locations || data.places);
        }
      } catch (error: any) {
        console.error("Failed to load preferences", error);
      }
    };

    fetchPreferences();
  }, []);

  /* ================= ADD CUSTOM LOCATION ================= */
  const handleAddLocation = (locName?: string) => {
    const target = (locName || newLocationInput).trim();
    if (!target) return;

    const formatted = target.charAt(0).toUpperCase() + target.slice(1);

    if (!selectedLocations.some((l) => l.toLowerCase() === formatted.toLowerCase())) {
      setSelectedLocations((prev) => [...prev, formatted]);
    }
    if (!locName) setNewLocationInput("");
  };

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

  /* ================= FETCH CASTES ================= */
  useEffect(() => {
    const fetchCastes = async () => {
      try {
        setLoadingCastes(true);
        const token = localStorage.getItem("token");
        const response = await Axios.get("/api/master/castes", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = response.data?.data || response.data || [];
        setCastes(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to fetch castes", error);
      } finally {
        setLoadingCastes(false);
      }
    };

    fetchCastes();
  }, []);

  useEffect(() => {
    const fetchQualificationLevels = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await Axios.get("/api/master/primaryEducations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEducations(response.data.data || []);
      } catch (error: any) {
        console.error("Qualification level fetch error:", error);
        toast.error("Failed to load qualification levels");
      }
    };

    fetchQualificationLevels();
  }, []);

  /* ================= FETCH MASTER INTERESTS ================= */
  useEffect(() => {
    const fetchMasterInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await Axios.get("/api/master/interests", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const items = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        if (Array.isArray(items) && items.length > 0) {
          const names = items
            .map((item: any) => (typeof item === "object" ? item.name : item))
            .filter(Boolean);
          setMasterInterests(names);
        }
      } catch (error) {
        console.error("Failed to load master interests:", error);
      }
    };

    fetchMasterInterests();
  }, []);

  /* ================= ADD CUSTOM INTEREST ================= */
  const handleAddCustomInterest = () => {
    const trimmed = newInterestInput.trim();
    if (!trimmed) return;

    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    if (!selectedInterests.includes(formatted)) {
      setSelectedInterests((prev) => [...prev, formatted]);
    }
    if (!customInterests.includes(formatted)) {
      setCustomInterests((prev) => [...prev, formatted]);
    }
    setNewInterestInput("");
  };

  /* Combine master, saved, and custom interests from backend */
  const allInterests = Array.from(
    new Set([
      ...masterInterests,
      ...selectedInterests,
      ...customInterests,
    ]),
  );

  /* Filter castes based on selected religions */
  const filteredCastes = castes.filter((caste) => {
    if (selectedReligions.length === 0) return false;
    const relId = typeof caste.religion === "object" ? caste.religion?._id : caste.religion;
    return selectedReligions.includes(relId || "");
  });

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
    setSaveLoading(true);
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
        castes: selectedCastes, // IDs
        educationLevels: selectedEducation, // IDs
        interests: selectedInterests,
        diets: selectedDiets,
        personalityTraits: selectedTraits,
        maritalStatuses: selectedMaritalStatuses,
        locations: selectedLocations,
      };

      await Axios.post("/api/user/partner-preferences/me", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Partner preferences saved successfully");
      setShowConfirm(false);
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to save preferences",
        );
      }
    } finally {
      setSaveLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partner Preference</h2>
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
          <div className="flex items-center justify-between mb-4">
            <Label className="text-lg font-semibold block">Religion</Label>
            {selectedReligions.length > 0 && (
              <span className="text-xs text-muted-foreground font-medium">
                {selectedReligions.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {religions.map((religion) => (
              <Badge
                key={religion._id}
                variant={
                  selectedReligions.includes(religion._id)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer py-2 px-4 transition-all ${
                  selectedReligions.includes(religion._id)
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "hover:bg-accent"
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

        {/* Caste / Community (Dynamically loaded based on selected Religion) */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-lg font-semibold block">Caste / Community</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedReligions.length === 0
                  ? "Select religion(s) to filter castes"
                  : `Castes matching selected religion(s)`}
              </p>
            </div>
            {filteredCastes.length > 0 && selectedReligions.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-primary hover:text-primary/80"
                onClick={() => {
                  const allFilteredIds = filteredCastes.map((c) => c._id);
                  const isAllSelected = allFilteredIds.every((id) => selectedCastes.includes(id));
                  if (isAllSelected) {
                    setSelectedCastes((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
                  } else {
                    setSelectedCastes((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
                  }
                }}
              >
                {filteredCastes.every((c) => selectedCastes.includes(c._id))
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            )}
          </div>

          {loadingCastes ? (
            <p className="text-xs text-muted-foreground py-2">Loading castes...</p>
          ) : selectedReligions.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted/30 text-center border border-dashed border-border/60">
              <p className="text-xs text-muted-foreground">
                Please select at least one religion above to view corresponding castes.
              </p>
            </div>
          ) : filteredCastes.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted/30 text-center border border-dashed border-border/60">
              <p className="text-xs text-muted-foreground">
                No castes found in master data for the selected religion(s).
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1 pt-1">
              {filteredCastes.map((caste) => {
                const isSelected = selectedCastes.includes(caste._id);
                return (
                  <Badge
                    key={caste._id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer py-2 px-4 transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "hover:bg-accent"
                    }`}
                    onClick={() =>
                      toggleSelection(
                        caste._id,
                        selectedCastes,
                        setSelectedCastes,
                      )
                    }
                  >
                    {caste.name}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          )}
        </Card>

        {/* Diet Preference */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">
            Diet Preference
          </Label>
          <div className="flex flex-wrap gap-2">
            {staticDietOptions.map((diet) => {
              const isSelected = selectedDiets.includes(diet.name) || selectedDiets.includes(diet.id);
              return (
                <Badge
                  key={diet.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-accent"
                  }`}
                  onClick={() =>
                    toggleSelection(
                      diet.name,
                      selectedDiets,
                      setSelectedDiets,
                    )
                  }
                >
                  <span className="mr-1">{diet.icon}</span>
                  {diet.name}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </Card>

        {/* Personality Traits */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">
            Personality Traits
          </Label>
          <div className="flex flex-wrap gap-2">
            {staticTraitsOptions.map((trait) => {
              const isSelected = selectedTraits.includes(trait.name) || selectedTraits.includes(trait.id);
              return (
                <Badge
                  key={trait.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-accent"
                  }`}
                  onClick={() =>
                    toggleSelection(
                      trait.name,
                      selectedTraits,
                      setSelectedTraits,
                    )
                  }
                >
                  <span className="mr-1">{trait.icon}</span>
                  {trait.name}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </Card>

        {/* Interests */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-3 block">Interests</Label>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
            {allInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Badge
                  key={interest}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-accent"
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
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </Card>

        {/* Qualification Level */}
        <Card className="glass-card p-6 lg:col-span-2">
          <Label className="text-lg font-semibold mb-4 block">
            Qualification Level
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
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
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

        {/* Marital Status Preference */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-lg font-semibold block">
                Marital Status Preference
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select preferred marital status(es) for your partner match
              </p>
            </div>
            {selectedMaritalStatuses.length > 0 && (
              <span className="text-xs text-muted-foreground font-medium">
                {selectedMaritalStatuses.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {staticMaritalStatusOptions.map((status) => {
              const isSelected = selectedMaritalStatuses.includes(status);
              return (
                <Badge
                  key={status}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-accent"
                  }`}
                  onClick={() =>
                    toggleSelection(
                      status,
                      selectedMaritalStatuses,
                      setSelectedMaritalStatuses,
                    )
                  }
                >
                  {status}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </Card>

        {/* Preferred Places / Locations */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-lg font-semibold block">
                Preferred Places / Location
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add cities, states, or locations you prefer for matching candidates
              </p>
            </div>
            {selectedLocations.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-primary hover:text-primary/80"
                onClick={() => setSelectedLocations([])}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Location Input */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter a city or location (e.g. Kochi, Bangalore, Dubai)..."
              value={newLocationInput}
              onChange={(e) => setNewLocationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLocation();
                }
              }}
              className="max-w-md text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddLocation()}
              className="shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Place
            </Button>
          </div>

          {/* Selected Places Tags */}
          {selectedLocations.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Selected Places ({selectedLocations.length}):
              </span>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {selectedLocations.map((loc) => (
                  <Badge
                    key={loc}
                    variant="default"
                    className="py-1.5 px-3 bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{loc}</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        setSelectedLocations((prev) =>
                          prev.filter((item) => item !== loc)
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Popular Suggestions */}
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-2">
              Popular City Suggestions:
            </span>
            <div className="flex flex-wrap gap-2">
              {staticLocationSuggestions.map((loc) => {
                const isSelected = selectedLocations.some(
                  (l) => l.toLowerCase() === loc.toLowerCase()
                );
                return (
                  <Badge
                    key={loc}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer py-1.5 px-3 text-xs transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "hover:bg-accent hover:border-primary/50"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedLocations((prev) =>
                          prev.filter((item) => item.toLowerCase() !== loc.toLowerCase())
                        );
                      } else {
                        handleAddLocation(loc);
                      }
                    }}
                  >
                    {loc}
                    {isSelected ? (
                      <X className="w-3 h-3 ml-1" />
                    ) : (
                      <Plus className="w-3 h-3 ml-1 text-muted-foreground" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4 pb-2">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 font-semibold shadow-md hover:shadow-lg transition-all"
          onClick={() => setShowConfirm(true)}
        >
          Save Preferences
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Partner Preferences"
        description="Are you sure you want to update your partner preferences?"
        confirmText="Save Preferences"
        loading={saveLoading}
        onConfirm={handleSavePreferences}
      />
    </div>
  );
};

export default PartnerPreference;
