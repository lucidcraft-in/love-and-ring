import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Users } from "lucide-react";
import type { RegistrationData } from "@/pages/Register";

interface StepOneProps {
  errors?: { [key: string]: string };
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
}

const StepOne = ({ errors = {}, formData, updateFormData }: StepOneProps) => {
  const handleChange = (field: keyof RegistrationData, value: string) => {
    if (updateFormData) {
      updateFormData(field, value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center pb-1">
        <h2 className="text-lg font-bold mb-0.5">Create Your Profile</h2>
        <p className="text-muted-foreground text-xs">Enter your basic details to get started</p>
      </div>

      {/* 2-Column Grid for Desktop/Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        {/* Row 1: Create Profile For */}
        <div className="space-y-1.5">
          <Label htmlFor="accountFor" className="flex items-center gap-1.5 text-xs font-medium">
            <Users className="w-3.5 h-3.5 text-primary" />
            Create Profile For *
          </Label>
          <Select value={formData?.accountFor} onValueChange={(value) => handleChange("accountFor", value)}>
            <SelectTrigger className={`h-9 rounded-lg text-sm ${errors.accountFor ? "border-destructive" : "border-border/50"}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Myself</SelectItem>
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="daughter">Daughter</SelectItem>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="sister">Sister</SelectItem>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountFor && <p className="text-xs text-destructive">{errors.accountFor}</p>}
        </div>

        {/* Row 1: Bride/Groom Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-medium">
            <User className="w-3.5 h-3.5 text-primary" />
            Bride / Groom Name *
          </Label>
          <Input 
            id="fullName" 
            placeholder="Enter full name" 
            value={formData?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`h-9 rounded-lg text-sm ${errors.fullName ? "border-destructive" : "border-border/50"}`}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        {/* Row 2: Mobile Number with Country Code */}
        <div className="space-y-1.5">
          <Label htmlFor="mobile" className="flex items-center gap-1.5 text-xs font-medium">
            <Phone className="w-3.5 h-3.5 text-primary" />
            Mobile Number *
          </Label>
          <div className="flex gap-1.5">
            <Select value={formData?.countryCode || "+91"} onValueChange={(value) => handleChange("countryCode", value)}>
              <SelectTrigger className={`w-20 h-9 rounded-lg text-sm ${errors.countryCode ? "border-destructive" : "border-border/50"}`}>
                <SelectValue placeholder="+91" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">+91</SelectItem>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+61">+61</SelectItem>
                <SelectItem value="+971">+971</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              id="mobile" 
              type="tel" 
              placeholder="Mobile number" 
              value={formData?.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className={`flex-1 h-9 rounded-lg text-sm ${errors.mobile ? "border-destructive" : "border-border/50"}`}
            />
          </div>
          {(errors.countryCode || errors.mobile) && (
            <p className="text-xs text-destructive">{errors.countryCode || errors.mobile}</p>
          )}
        </div>

        {/* Row 2: Gender */}
        <div className="space-y-1.5">
          <Label htmlFor="gender" className="flex items-center gap-1.5 text-xs font-medium">
            Gender *
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleChange("gender", "male")}
              className={`h-9 rounded-lg border transition-all duration-200 font-medium text-xs ${
                formData?.gender === "male"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Male (Groom)
            </button>
            <button
              type="button"
              onClick={() => handleChange("gender", "female")}
              className={`h-9 rounded-lg border transition-all duration-200 font-medium text-xs ${
                formData?.gender === "female"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Female (Bride)
            </button>
          </div>
          {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepOne;
