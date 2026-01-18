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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-1">Create Your Profile</h2>
        <p className="text-muted-foreground text-sm">Enter your basic details to get started</p>
      </div>

      <div className="space-y-4">
        {/* Create Profile For */}
        <div className="space-y-2">
          <Label htmlFor="accountFor" className="flex items-center gap-2 text-sm font-medium">
            <Users className="w-4 h-4 text-primary" />
            Create Profile For *
          </Label>
          <Select value={formData?.accountFor} onValueChange={(value) => handleChange("accountFor", value)}>
            <SelectTrigger className={`h-11 rounded-xl ${errors.accountFor ? "border-destructive" : "border-border/50"}`}>
              <SelectValue placeholder="Select who this profile is for" />
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

        {/* Bride/Groom Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-primary" />
            Bride / Groom Name *
          </Label>
          <Input 
            id="fullName" 
            placeholder="Enter full name" 
            value={formData?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`h-11 rounded-xl ${errors.fullName ? "border-destructive" : "border-border/50"}`}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        {/* Mobile Number with Country Code */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium">
            <Phone className="w-4 h-4 text-primary" />
            Mobile Number *
          </Label>
          <div className="flex gap-2">
            <Select value={formData?.countryCode || "+91"} onValueChange={(value) => handleChange("countryCode", value)}>
              <SelectTrigger className={`w-24 h-11 rounded-xl ${errors.countryCode ? "border-destructive" : "border-border/50"}`}>
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
              placeholder="Enter mobile number" 
              value={formData?.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className={`flex-1 h-11 rounded-xl ${errors.mobile ? "border-destructive" : "border-border/50"}`}
            />
          </div>
          {(errors.countryCode || errors.mobile) && (
            <p className="text-xs text-destructive">{errors.countryCode || errors.mobile}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
            Gender *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange("gender", "male")}
              className={`h-11 rounded-xl border transition-all duration-200 font-medium text-sm ${
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
              className={`h-11 rounded-xl border transition-all duration-200 font-medium text-sm ${
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

      {/* Info Note */}
      <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
        <p className="text-xs text-muted-foreground text-center">
          An OTP will be sent to verify your mobile number
        </p>
      </div>
    </div>
  );
};

export default StepOne;
