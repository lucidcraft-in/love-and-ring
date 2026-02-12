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
import { set } from "date-fns";
import { useEffect, useState } from "react";

interface StepTwoProps {
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
}

interface MotherTongue {
  _id: string;
  name: string;
}
const StepTwo = ({ formData, updateFormData }: StepTwoProps) => {
  const [religions, setReligions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [castes, setCastes] = useState<any[]>([]);
  const [loadingCastes, setLoadingCastes] = useState(false);
  const [motherTongues, setMotherTongues] = useState<MotherTongue[]>([]);

  const handleChange = (field: keyof RegistrationData, value: string) => {
    if (updateFormData) {
      updateFormData(field, value);
    }
  };

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await Axios.get("/api/master/religions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReligions(response.data.data);
      } catch (err) {
        console.error("Failed to fetch religions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReligions();
  }, []);

  const safeReligions = Array.isArray(religions) ? religions : [];

  useEffect(() => {
    if (!formData?.religion) {
      setCastes([]);
      return;
    }

    const fetchCastes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await Axios.get("/api/master/castes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allCastes = res.data.data || [];

        const filtered = allCastes.filter(
          (caste: any) => caste.religion?._id === formData.religion,
        );

        setCastes(filtered);
      } catch (err) {
        console.error("Failed to fetch castes", err);
        setCastes([]);
      }
    };

    fetchCastes();
  }, [formData?.religion]);

  useEffect(() => {
    const fetchMotherTongues = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await Axios.get("/api/master/languages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const list = response.data?.data;

        if (Array.isArray(list)) {
          setMotherTongues(list);
        } else {
          setMotherTongues([]);
        }
      } catch (err) {
        console.error("Failed to fetch mother tongues", err);
        setMotherTongues([]);
      }
    };

    fetchMotherTongues();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about your background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="religion">Religion *</Label>
          <Select
            value={formData?.religion}
            onValueChange={(value) => handleChange("religion", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loading ? "Loading..." : "Select religion"}
              />
            </SelectTrigger>
            <SelectContent>
              {safeReligions.map((religion) => (
                <SelectItem key={religion._id} value={religion._id}>
                  {religion.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caste">Caste *</Label>
          <Select
            value={formData?.caste}
            onValueChange={(value) => handleChange("caste", value)}
            disabled={!formData?.religion}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  formData?.religion ? "Select caste" : "Select religion first"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {castes.length === 0 ? (
                <SelectItem value="no-data" disabled>
                  No castes available
                </SelectItem>
              ) : (
                castes.map((caste) => (
                  <SelectItem key={caste._id} value={caste._id}>
                    {caste.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Options vary based on selected religion
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="motherTongue">Mother Tongue *</Label>
          <Select
            value={formData?.motherTongue || undefined}
            onValueChange={(value) => handleChange("motherTongue", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mother tongue" />
            </SelectTrigger>
            <SelectContent>
              {motherTongues.length === 0 ? (
                <SelectItem value="no-data" disabled>
                  No mother tongues available
                </SelectItem>
              ) : (
                motherTongues.map((tongue) => (
                  <SelectItem key={tongue._id} value={String(tongue._id)}>
                    {tongue.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
