import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

const StepThree = () => {
  const [physicallyChallenged, setPhysicallyChallenged] = useState("no");
  const [livesWithFamily, setLivesWithFamily] = useState("yes");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
        <p className="text-muted-foreground">Share your personal characteristics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height (in cm) *</Label>
          <Input id="height" type="number" placeholder="e.g., 170" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (in kg) *</Label>
          <Input id="weight" type="number" placeholder="e.g., 65" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="widow">Widow</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="awaiting-divorce">Awaiting Divorce</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="annulled">Annulled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Physically Challenged? *</Label>
          <RadioGroup value={physicallyChallenged} onValueChange={setPhysicallyChallenged}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pc-no" />
                <Label htmlFor="pc-no" className="font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pc-yes" />
                <Label htmlFor="pc-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
            </div>
          </RadioGroup>
          {physicallyChallenged === "yes" && (
            <Textarea 
              placeholder="Please provide details" 
              className="mt-2"
              rows={2}
            />
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="city">City You Live In *</Label>
          <Input 
            id="city" 
            placeholder="Start typing city name..." 
            required 
          />
          <p className="text-xs text-muted-foreground">Google Places autocomplete integration</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Do You Live With Family? *</Label>
          <RadioGroup value={livesWithFamily} onValueChange={setLivesWithFamily}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="lwf-yes" />
                <Label htmlFor="lwf-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="lwf-no" />
                <Label htmlFor="lwf-no" className="font-normal cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
          {livesWithFamily === "no" && (
            <Input 
              placeholder="Family location" 
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Profile Image *</Label>
          <Card className="p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Upload your profile photo</p>
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop (Max 5MB)
                </p>
              </div>
            </div>
          </Card>
          <p className="text-xs text-muted-foreground">
            You'll be able to crop, rotate, and resize the image after upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
