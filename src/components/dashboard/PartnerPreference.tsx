import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const PartnerPreference = () => {
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [heightRange, setHeightRange] = useState([150, 180]);
  
  const [selectedReligions, setSelectedReligions] = useState(["Hindu", "Christian"]);
  const [selectedEducation, setSelectedEducation] = useState(["Graduate", "Post Graduate"]);
  const [selectedInterests, setSelectedInterests] = useState(["Travel", "Music", "Reading"]);

  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain"];
  const educationLevels = ["Graduate", "Post Graduate", "Doctorate", "Diploma"];
  const interests = ["Travel", "Music", "Reading", "Sports", "Cooking", "Art", "Technology"];

  const toggleSelection = (item: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partner Preference</h2>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          Save Preferences
        </Button>
      </div>

      {/* Preference Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Range */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Age Range</Label>
          <div className="space-y-4">
            <Slider 
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{ageRange[0]} years</span>
              <span>{ageRange[1]} years</span>
            </div>
          </div>
        </Card>

        {/* Height Range */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Height Range (cm)</Label>
          <div className="space-y-4">
            <Slider 
              value={heightRange}
              onValueChange={setHeightRange}
              min={140}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{heightRange[0]} cm</span>
              <span>{heightRange[1]} cm</span>
            </div>
          </div>
        </Card>

        {/* Religion */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Religion</Label>
          <div className="flex flex-wrap gap-2">
            {religions.map(religion => (
              <Badge
                key={religion}
                variant={selectedReligions.includes(religion) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-2 px-4 ${
                  selectedReligions.includes(religion) 
                    ? 'bg-gradient-to-r from-primary to-secondary' 
                    : ''
                }`}
                onClick={() => toggleSelection(religion, selectedReligions, setSelectedReligions)}
              >
                {religion}
                {selectedReligions.includes(religion) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Education Level</Label>
          <div className="flex flex-wrap gap-2">
            {educationLevels.map(edu => (
              <Badge
                key={edu}
                variant={selectedEducation.includes(edu) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-2 px-4 ${
                  selectedEducation.includes(edu) 
                    ? 'bg-gradient-to-r from-primary to-secondary' 
                    : ''
                }`}
                onClick={() => toggleSelection(edu, selectedEducation, setSelectedEducation)}
              >
                {edu}
                {selectedEducation.includes(edu) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Interests */}
        <Card className="glass-card p-6 lg:col-span-2">
          <Label className="text-lg font-semibold mb-4 block">Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-2 px-4 ${
                  selectedInterests.includes(interest) 
                    ? 'bg-gradient-to-r from-primary to-secondary' 
                    : ''
                }`}
                onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
              >
                {interest}
                {selectedInterests.includes(interest) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerPreference;
