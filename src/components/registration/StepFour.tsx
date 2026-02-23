import Axios from "@/axios/axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistrationData } from "@/pages/Register";
import { useEffect, useState } from "react";

interface StepFourProps {
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
}

const StepFour = ({ formData, updateFormData }: StepFourProps) => {
  const [primaryEducations, setPrimaryEducations] = useState<any[]>([]);
  const [higherEducations, setHigherEducations] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      </div>
    </div>
  );
};

export default StepFour;
