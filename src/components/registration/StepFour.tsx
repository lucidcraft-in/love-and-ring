import Axios from "@/axios/axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import type { RegistrationData } from "@/pages/Register";
import { useEffect, useState, useRef } from "react";

interface StepFourProps {
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
}

const StepFour = ({ formData, updateFormData }: StepFourProps) => {
  const [primaryEducations, setPrimaryEducations] = useState<any[]>([]);
  const [higherEducations, setHigherEducations] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
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
    setCvFile(file);
  };

  const removeCv = () => {
    setCvFile(null);
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
    const fetchHigherEducation = async () => {
      if (!formData?.primaryEducation) {
        setHigherEducations([]);
        return;
      }

      try {
        const { data } = await Axios.get(
          `/api/master/higherEducations?primaryEducation=${formData.primaryEducation}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setHigherEducations(data.data);
      } catch (error) {
        console.error("Error fetching higher education:", error);
      }
    };

    fetchHigherEducation();
  }, [formData?.primaryEducation]);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get("/api/master/occupations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfessions(data.data);
      } catch (error) {
        console.error("Error fetching professions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Educational Details</h2>
        <p className="text-muted-foreground">
          Tell us about your education and profession
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Education */}
        <div className="space-y-2">
          <Label>Qualification Level *</Label>
          <Select
            value={formData?.primaryEducation}
            onValueChange={(v) => {
              handleChange("primaryEducation", v);
              handleChange("highestEducation", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary education" />
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

        {/* Education */}
        <div className="space-y-2">
          <Label>Highest Education *</Label>
          <Select
            value={formData?.highestEducation}
            onValueChange={(v) => handleChange("highestEducation", v)}
            disabled={!formData?.primaryEducation}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  formData?.primaryEducation
                    ? "Select highest education"
                    : "Select primary education first"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {higherEducations.map((item) => (
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
            value={formData?.profession}
            onValueChange={(v) => handleChange("profession", v)}
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
            </SelectContent>
          </Select>
        </div>

        {/* CV Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label>Upload Your CV</Label>
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvChange}
            className="hidden"
          />

          {cvFile ? (
            <Card
              className="p-6 border-2 border-primary bg-primary/5 transition-colors cursor-pointer"
              onClick={() => cvInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{cvFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
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
                    Click to upload or drag and drop (PDF, DOC, DOCX – Max 5MB)
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
