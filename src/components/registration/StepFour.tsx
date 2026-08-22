import Axios from "@/axios/axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { RegistrationData } from "@/pages/Register";
import { useEffect, useState, useRef } from "react";

interface StepFourProps {
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: any) => void;
}

const StepFour = ({ formData, updateFormData }: StepFourProps) => {
  const [primaryEducations, setPrimaryEducations] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCustomProfession, setIsCustomProfession] = useState(false);
  const [customProfessionName, setCustomProfessionName] = useState("");

  const cvInputRef = useRef<HTMLInputElement>(null);

  const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_CV_SIZE) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }
    updateFormData?.("cv", file);
  };

  const removeCv = () => {
    updateFormData?.("cv", null);
    if (cvInputRef.current) cvInputRef.current.value = "";
  };

  const handleChange = (field: keyof RegistrationData, value: string) => {
    updateFormData?.(field, value);
  };

  useEffect(() => {
    const fetchPrimaryEducation = async () => {
      try {
        const { data } = await Axios.get("/api/master/primaryEducations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setPrimaryEducations(data.data);
      } catch (error) {
        console.error("Error fetching primary education:", error);
      }
    };

    fetchPrimaryEducation();
  }, []);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get("/api/master/occupations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const professionList = data.data || [];
        setProfessions(professionList);

        // Check if current formData profession is custom (not in fetched list IDs)
        if (formData?.profession) {
          const matched = professionList.some((item: any) => item._id === formData.profession);
          if (!matched && formData.profession !== "OTHER") {
            setIsCustomProfession(true);
            setCustomProfessionName(formData.profession);
          }
        }
      } catch (error) {
        console.error("Error fetching professions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, []);

  const handleProfessionSelectChange = (value: string) => {
    if (value === "OTHER") {
      setIsCustomProfession(true);
      handleChange("profession", customProfessionName);
    } else {
      setIsCustomProfession(false);
      handleChange("profession", value);
    }
  };

  const handleCustomProfessionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomProfessionName(val);
    handleChange("profession", val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Educational Details</h2>
        <p className="text-muted-foreground">
          Tell us about your qualification level and profession
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qualification Level */}
        <div className="space-y-2 md:col-span-2">
          <Label>Qualification Level *</Label>
          <Select
            value={formData?.primaryEducation}
            onValueChange={(v) => handleChange("primaryEducation", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select qualification level" />
            </SelectTrigger>

            <SelectContent>
              {primaryEducations.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Profession */}
        <div className="space-y-2 md:col-span-2">
          <Label>Profession *</Label>
          <Select
            value={isCustomProfession ? "OTHER" : (formData?.profession || "")}
            onValueChange={handleProfessionSelectChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loading ? "Loading professions..." : "Select profession"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {professions.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
              <SelectItem value="OTHER" className="text-primary font-medium">
                + Add Custom Profession
              </SelectItem>
            </SelectContent>
          </Select>

          {isCustomProfession && (
            <div className="pt-2 animate-fade-in">
              <Label className="text-xs text-muted-foreground mb-1 block">Specify Custom Profession *</Label>
              <Input
                placeholder="Type your profession name..."
                value={customProfessionName}
                onChange={handleCustomProfessionTextChange}
                className="h-10 text-sm"
              />
            </div>
          )}
        </div>

        {/* CV Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label>Upload Your CV <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvChange}
            className="hidden"
          />

          {formData?.cv ? (
            <Card
              className="p-6 border-2 border-primary bg-primary/5 transition-colors cursor-pointer"
              onClick={() => cvInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{formData.cv.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(formData.cv.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCv();
                  }}
                  className="flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </Card>
          ) : (
            <Card
              className="p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer"
              onClick={() => cvInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">Upload your CV</p>
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop (PDF, DOC, DOCX, TXT – Max 5MB)
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepFour;
