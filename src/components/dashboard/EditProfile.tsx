import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Crown, Edit, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [currentMembership] = useState("Free");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Badge variant="outline" className="gap-2">
          <Crown className="w-4 h-4" />
          {currentMembership} Member
        </Badge>
      </div>

      {/* Membership Section */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Membership: {currentMembership}</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock premium features and find your match faster
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => navigate("/pricing")}
          >
            Upgrade Now
          </Button>
        </div>
      </Card>

      {/* Profile Image */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Profile Image
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <Button variant="outline" className="mb-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 400x400px
            </p>
          </div>
        </div>
      </Card>

      {/* Basic Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Basic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" defaultValue="+1 234 567 8900" />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" />
          </div>
        </div>
      </Card>

      {/* Personal Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="5'10&quot;" />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" defaultValue="75 kg" />
          </div>
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input id="religion" defaultValue="Christian" />
          </div>
          <div>
            <Label htmlFor="caste">Caste</Label>
            <Input id="caste" defaultValue="N/A" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" defaultValue="123 Main Street, New York, NY" />
          </div>
        </div>
      </Card>

      {/* Educational Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Educational Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="education">Highest Education</Label>
            <Input id="education" defaultValue="Master's Degree" />
          </div>
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" defaultValue="Software Engineer" />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
