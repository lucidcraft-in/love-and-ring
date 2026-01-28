import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

import type { RegistrationData } from "@/pages/Register";

interface StepFiveProps {
  errors?: { [key: string]: string };
  formData?: RegistrationData;
  updateFormData?: (field: keyof RegistrationData, value: any) => void;
}

const StepFive = ({ formData, updateFormData }: StepFiveProps) => {
  const [incomeRange, setIncomeRange] = useState([25]);
  const [incomeType, setIncomeType] = useState("yearly");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

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

  const dietOptions = [
    { id: "veg", name: "Vegetarian", icon: "🥗" },
    { id: "non-veg", name: "Non-Veg", icon: "🍗" },
    { id: "vegan", name: "Vegan", icon: "🌱" },
    { id: "eggetarian", name: "Eggetarian", icon: "🥚" },
    { id: "jain", name: "Jain", icon: "🙏" },
  ];

  const toggleSelection = (
    id: string,
    list: string[],
    setter: (val: string[]) => void,
  ) => {
    if (list.includes(id)) {
      setter(list.filter((item) => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  // ---- sync interests ----
  useEffect(() => {
    updateFormData?.("interests", selectedInterests);
  }, [selectedInterests]);

  // ---- sync traits ----
  useEffect(() => {
    updateFormData?.("traits", selectedTraits);
  }, [selectedTraits]);

  // ---- sync diets ----
  useEffect(() => {
    updateFormData?.("diets", selectedDiets);
  }, [selectedDiets]);

  // ---- sync income ----
  useEffect(() => {
    if (!updateFormData) return;

    const amount =
      incomeType === "monthly"
        ? incomeRange[0] * 1000
        : Math.round((incomeRange[0] * 12) / 10) * 100000;

    updateFormData("income", {
      amount,
      type: incomeType === "monthly" ? "Monthly" : "Yearly",
    });
  }, [incomeRange, incomeType]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
        <p className="text-muted-foreground">
          Final touches to complete your profile
        </p>
      </div>

      <div className="space-y-6">
        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests (Select multiple)</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge
                key={interest.id}
                variant={
                  selectedInterests.includes(interest.id)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() =>
                  toggleSelection(
                    interest.id,
                    selectedInterests,
                    setSelectedInterests,
                  )
                }
              >
                <span className="mr-1">{interest.icon}</span>
                {interest.name}
                {selectedInterests.includes(interest.id) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            From CRUD-based list with icons
          </p>
        </div>

        {/* Personality Traits */}
        <div className="space-y-3">
          <Label>Personality Traits (Select multiple)</Label>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <Badge
                key={trait.id}
                variant={
                  selectedTraits.includes(trait.id) ? "default" : "outline"
                }
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() =>
                  toggleSelection(trait.id, selectedTraits, setSelectedTraits)
                }
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
            <RadioGroup
              value={incomeType}
              onValueChange={setIncomeType}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="font-normal cursor-pointer">
                  Monthly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="font-normal cursor-pointer">
                  Yearly
                </Label>
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
                  ₹{(incomeRange[0] * 12) / 10}L/yr
                </span>
                <span>₹120L/yr</span>
              </>
            )}
          </div>
        </div>

        {/* Diet - Multiple Select */}
        <div className="space-y-3">
          <Label>Diet Preference (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietOptions.map((diet) => (
              <div
                key={diet.id}
                className={`flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedDiets.includes(diet.id)
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() =>
                  toggleSelection(diet.id, selectedDiets, setSelectedDiets)
                }
              >
                <Checkbox
                  id={diet.id}
                  checked={selectedDiets.includes(diet.id)}
                />
                <Label
                  htmlFor={diet.id}
                  className="font-normal cursor-pointer flex-1"
                >
                  {diet.icon} {diet.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm font-medium mb-2">✨ Almost there!</p>
        <p className="text-sm text-muted-foreground">
          After clicking Continue, you'll see a summary of your information
          before final submission.
        </p>
      </div>
    </div>
  );
};

export default StepFive;
