import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const StepFive = () => {
  const [incomeRange, setIncomeRange] = useState([25]);
  const [incomeType, setIncomeType] = useState("yearly");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const interests = [
    { id: "reading", name: "Reading", icon: "📚" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "travel", name: "Travel", icon: "✈️" },
    { id: "cooking", name: "Cooking", icon: "🍳" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "movies", name: "Movies", icon: "🎬" },
    { id: "photography", name: "Photography", icon: "📸" },
    { id: "art", name: "Art", icon: "🎨" },
  ];

  const traits = [
    { id: "friendly", name: "Friendly", icon: "😊" },
    { id: "ambitious", name: "Ambitious", icon: "🎯" },
    { id: "creative", name: "Creative", icon: "💡" },
    { id: "honest", name: "Honest", icon: "✨" },
    { id: "caring", name: "Caring", icon: "❤️" },
    { id: "funny", name: "Funny", icon: "😄" },
    { id: "intelligent", name: "Intelligent", icon: "🧠" },
    { id: "patient", name: "Patient", icon: "🕊️" },
  ];

  const toggleSelection = (id: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(id)) {
      setter(list.filter(item => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
        <p className="text-muted-foreground">Final touches to complete your profile</p>
      </div>

      <div className="space-y-6">
        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests (Select multiple)</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge
                key={interest.id}
                variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => toggleSelection(interest.id, selectedInterests, setSelectedInterests)}
              >
                <span className="mr-1">{interest.icon}</span>
                {interest.name}
                {selectedInterests.includes(interest.id) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">From CRUD-based list with icons</p>
        </div>

        {/* Personality Traits */}
        <div className="space-y-3">
          <Label>Personality Traits (Select multiple)</Label>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <Badge
                key={trait.id}
                variant={selectedTraits.includes(trait.id) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => toggleSelection(trait.id, selectedTraits, setSelectedTraits)}
              >
                <span className="mr-1">{trait.icon}</span>
                {trait.name}
                {selectedTraits.includes(trait.id) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Income */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Income Range</Label>
            <RadioGroup value={incomeType} onValueChange={setIncomeType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="font-normal cursor-pointer">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="font-normal cursor-pointer">Yearly</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Slider
            value={incomeRange}
            onValueChange={setIncomeRange}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            {incomeType === "monthly" ? (
              <>
                <span>₹25k/mo</span>
                <span className="font-semibold text-foreground">
                  ₹{incomeRange[0]}k/mo
                </span>
                <span>₹100k/mo</span>
              </>
            ) : (
              <>
                <span>₹3L/yr</span>
                <span className="font-semibold text-foreground">
                  ₹{incomeRange[0] * 12 / 10}L/yr
                </span>
                <span>₹120L/yr</span>
              </>
            )}
          </div>
        </div>

        {/* Membership */}
        <div className="space-y-2">
          <Label htmlFor="membership">Membership Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">🆓 Free (Public)</SelectItem>
              <SelectItem value="silver">🥈 Silver (Private)</SelectItem>
              <SelectItem value="gold">🥇 Gold (Private)</SelectItem>
              <SelectItem value="premium">💎 Premium (Private)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Membership types with name, account type, and icon (CRUD-supported)
          </p>
        </div>

        {/* Diet */}
        <div className="space-y-2">
          <Label>Diet Preference</Label>
          <RadioGroup defaultValue="veg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="veg" id="veg" />
                <Label htmlFor="veg" className="font-normal cursor-pointer flex-1">🥗 Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="non-veg" id="non-veg" />
                <Label htmlFor="non-veg" className="font-normal cursor-pointer flex-1">🍗 Non-Veg</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="vegan" id="vegan" />
                <Label htmlFor="vegan" className="font-normal cursor-pointer flex-1">🌱 Vegan</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="eggetarian" id="eggetarian" />
                <Label htmlFor="eggetarian" className="font-normal cursor-pointer flex-1">🥚 Eggetarian</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="jain" id="jain" />
                <Label htmlFor="jain" className="font-normal cursor-pointer flex-1">🙏 Jain</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm font-medium mb-2">✨ Almost there!</p>
        <p className="text-sm text-muted-foreground">
          After clicking Continue, you'll see a summary of your information before final submission.
        </p>
      </div>
    </div>
  );
};

export default StepFive;
