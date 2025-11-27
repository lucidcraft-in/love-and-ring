import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RegistrationData } from "@/pages/Register";

interface StepTwoProps {
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
}

const StepTwo = ({ formData, updateFormData }: StepTwoProps) => {
  const handleChange = (field: keyof RegistrationData, value: string) => {
    if (updateFormData) {
      updateFormData(field, value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about your background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="religion">Religion *</Label>
          <Select value={formData?.religion} onValueChange={(value) => handleChange("religion", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="sikh">Sikh</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caste">Caste *</Label>
          <Select value={formData?.caste} onValueChange={(value) => handleChange("caste", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select caste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brahmin">Brahmin</SelectItem>
              <SelectItem value="kshatriya">Kshatriya</SelectItem>
              <SelectItem value="vaishya">Vaishya</SelectItem>
              <SelectItem value="shudra">Shudra</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Options vary based on selected religion</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="motherTongue">Mother Tongue *</Label>
          <Select value={formData?.motherTongue} onValueChange={(value) => handleChange("motherTongue", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select mother tongue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="telugu">Telugu</SelectItem>
              <SelectItem value="bengali">Bengali</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
              <SelectItem value="gujarati">Gujarati</SelectItem>
              <SelectItem value="kannada">Kannada</SelectItem>
              <SelectItem value="malayalam">Malayalam</SelectItem>
              <SelectItem value="punjabi">Punjabi</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
