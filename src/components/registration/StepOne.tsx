import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Phone, Users, Mail } from "lucide-react";
import type { RegistrationData } from "@/pages/Register";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface StepOneProps {
  errors?: { [key: string]: string };
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: string) => void;
  otpSent?: boolean;
}

const StepOne = ({
  errors = {},
  formData,
  updateFormData,
  otpSent,
}: StepOneProps) => {
  const handleChange = (field: keyof RegistrationData, value: string) => {
    if (updateFormData) {
      updateFormData(field, value);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center pb-1">
        <h2 className="text-lg font-bold mb-0.5">Create Your Profile</h2>
        <p className="text-muted-foreground text-xs">
          Enter your basic details to get started
        </p>
      </div>

      {/* 2-Column Grid for Desktop/Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        {/* Row 1: Create Profile For */}
        <div className="space-y-1.5">
          <Label
            htmlFor="accountFor"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            Create Profile For *
          </Label>
          <Select
            value={formData?.accountFor}
            onValueChange={(value) => handleChange("accountFor", value)}
          >
            <SelectTrigger
              className={`h-10 rounded-lg text-sm ${errors.accountFor ? "border-destructive" : "border-border/50"}`}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="self">Myself</SelectItem>
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="daughter">Daughter</SelectItem>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="sister">Sister</SelectItem>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountFor && (
            <p className="text-xs text-destructive">{errors.accountFor}</p>
          )}
        </div>

        {/* Row 1: Bride/Groom Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fullName"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <User className="w-3.5 h-3.5 text-primary" />
            Bride / Groom Name *
          </Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={formData?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`h-10 rounded-lg text-sm ${errors.fullName ? "border-destructive" : "border-border/50"}`}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Row 2: Email Address (spans full width on mobile, single column on desktop) */}
        <div className="space-y-1.5 md:col-span-2">
          <Label
            htmlFor="email"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={otpSent}
            className={`h-10 rounded-lg text-sm ${errors.email ? "border-destructive" : "border-border/50"}`}
          />
          <p className="text-[11px] text-muted-foreground">
            An OTP will be sent to your email address for verification
          </p>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Row 3: Mobile Number with Country Code */}
        <div className="space-y-1.5">
          <Label
            htmlFor="mobile"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            Mobile Number *
          </Label>

          <PhoneInput
            country={"in"}
            value={`${formData?.countryCode || ""}${formData?.mobile || ""}`}
            onChange={(value, country) => {
              if (!updateFormData) return;

              const dialCode = (country as any).dialCode ?? "";
              const phoneNumber = dialCode ? value.replace(dialCode, "") : value;

              updateFormData("countryCode", dialCode ? `+${dialCode}` : "");
              updateFormData("mobile", phoneNumber);
            }}
            inputClass="!w-full !h-10 !rounded-lg !text-sm !border-border/50"
            containerClass="!w-full"
            buttonClass="!rounded-l-lg !border-border/50"
            dropdownClass="!bg-background"
            placeholder="Mobile number"
          />

          {(errors.countryCode || errors.mobile) && (
            <p className="text-xs text-destructive">
              {errors.countryCode || errors.mobile}
            </p>
          )}
        </div>

        {/* Row 3: Gender (Dropdown) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="gender"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            Gender *
          </Label>
          <Select
            value={formData?.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger
              className={`h-10 rounded-lg text-sm ${errors.gender ? "border-destructive" : "border-border/50"}`}
            >
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="male">Male (Groom)</SelectItem>
              <SelectItem value="female">Female (Bride)</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepOne;
