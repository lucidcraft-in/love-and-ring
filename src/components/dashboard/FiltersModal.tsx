import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterValues {
  ageRange: [number, number];
  location: string;
  education: string;
  profession: string;
  verifiedOnly: boolean;
}

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

const defaultFilters: FilterValues = {
  ageRange: [22, 35],
  location: "",
  education: "",
  profession: "",
  verifiedOnly: false,
};

const FiltersModal = ({ isOpen, onClose, onApply }: FiltersModalProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6 py-4">
      {/* Age Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
        </Label>
        <Slider
          value={filters.ageRange}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              ageRange: value as [number, number],
            }))
          }
          min={18}
          max={60}
          step={1}
          className="w-full"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Select
          value={filters.location}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, location: value }))
          }
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="kochi">Kochi, Kerala</SelectItem>
            <SelectItem value="trivandrum">Thiruvananthapuram, Kerala</SelectItem>
            <SelectItem value="calicut">Calicut, Kerala</SelectItem>
            <SelectItem value="thrissur">Thrissur, Kerala</SelectItem>
            <SelectItem value="kannur">Kannur, Kerala</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Education</Label>
        <Select
          value={filters.education}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, education: value }))
          }
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select education" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
            <SelectItem value="masters">Master's Degree</SelectItem>
            <SelectItem value="doctorate">Doctorate</SelectItem>
            <SelectItem value="professional">Professional Degree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Profession */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Profession</Label>
        <Select
          value={filters.profession}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, profession: value }))
          }
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select profession" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="it">IT / Software</SelectItem>
            <SelectItem value="medical">Medical / Healthcare</SelectItem>
            <SelectItem value="finance">Finance / Banking</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="business">Business / Entrepreneur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="verified"
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) =>
            setFilters((prev) => ({
              ...prev,
              verifiedOnly: checked as boolean,
            }))
          }
        />
        <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
          Show verified profiles only
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleClear} className="flex-1">
          Clear
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 bg-gradient-to-r from-primary to-secondary"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  // Mobile: Bottom sheet drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="bg-background">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle>Filter Matches</DrawerTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
            <FilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop/Tablet: Centered dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>Filter Matches</DialogTitle>
        </DialogHeader>
        <FilterContent />
      </DialogContent>
    </Dialog>
  );
};

export default FiltersModal;
