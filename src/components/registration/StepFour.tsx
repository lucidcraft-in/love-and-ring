import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StepFour = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Educational Details</h2>
        <p className="text-muted-foreground">Tell us about your education and profession</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="education">Highest Education *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
              <SelectItem value="professional">Professional Degree</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Options from CRUD-based master list</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course/Specialization *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="business">Business Administration</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="law">Law</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Dependent on selected education level</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profession">Profession *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="chartered-accountant">Chartered Accountant</SelectItem>
              <SelectItem value="lawyer">Lawyer</SelectItem>
              <SelectItem value="government-employee">Government Employee</SelectItem>
              <SelectItem value="private-employee">Private Employee</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="not-working">Not Working</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Options from Profession master (CRUD-supported)</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> All dropdown options are managed through a CRUD-based master data system, 
          making it easy to add, update, or remove options as needed.
        </p>
      </div>
    </div>
  );
};

export default StepFour;
