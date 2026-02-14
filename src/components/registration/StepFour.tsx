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
  const [Education, setEducation] = useState<any>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RegistrationData, value: string) => {
    updateFormData?.(field, value);
  };

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data } = await Axios.get("/api/master/educations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEducation(data.data);
      } catch (error) {
        console.error("Error fetching education:", error);
      }
    };

    fetchEducation();
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
        {/* Education */}

        <div className="space-y-2">
          <Label>Highest Education *</Label>
          <Select
            value={formData?.highestEducation}
            onValueChange={(v) => handleChange("highestEducation", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>

            <SelectContent>
              {Education.map((item: any) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course */}
        <div className="space-y-2">
          <Label>Course / Specialization</Label>
          <Select
            value={formData?.course}
            onValueChange={(v) => handleChange("course", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="business">Business Administration</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="law">Law</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
