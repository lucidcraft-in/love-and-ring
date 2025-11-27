import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepOneProps {
  errors?: { [key: string]: string };
}

const StepOne = ({ errors = {} }: StepOneProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Account Details</h2>
        <p className="text-muted-foreground">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* This Account For - at the top */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="accountFor">This Account For *</Label>
          <Select>
            <SelectTrigger className={errors.accountFor ? "border-destructive" : ""}>
              <SelectValue placeholder="Select profile for" />
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

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input 
            id="fullName" 
            placeholder="Enter your full name" 
            required 
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your.email@example.com" 
            required 
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryCode">Country Code *</Label>
          <Select>
            <SelectTrigger className={errors.countryCode ? "border-destructive" : ""}>
              <SelectValue placeholder="Select country code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+91">+91 (India)</SelectItem>
              <SelectItem value="+1">+1 (USA/Canada)</SelectItem>
              <SelectItem value="+44">+44 (UK)</SelectItem>
              <SelectItem value="+61">+61 (Australia)</SelectItem>
              <SelectItem value="+971">+971 (UAE)</SelectItem>
            </SelectContent>
          </Select>
          {errors.countryCode && <p className="text-xs text-destructive">{errors.countryCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input 
            id="mobile" 
            type="tel" 
            placeholder="Enter mobile number" 
            required 
            className={errors.mobile ? "border-destructive" : ""}
          />
          {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select>
            <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input 
            id="dob" 
            type="date" 
            required 
            className={errors.dob ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Must be at least 21 years old</p>
          {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="language">Preferred Language *</Label>
          <Select>
            <SelectTrigger className={errors.language ? "border-destructive" : ""}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="telugu">Telugu</SelectItem>
              <SelectItem value="bengali">Bengali</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
          {errors.language && <p className="text-xs text-destructive">{errors.language}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepOne;
