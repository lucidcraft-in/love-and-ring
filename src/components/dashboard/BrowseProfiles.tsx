import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  GraduationCap,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Axios from "@/axios/axios";

interface Profile {
  _id: string;
  fullName: string;
  dateOfBirth?: string;
  city?: { name: string };
  highestEducation?: { name: string };
  photos?: { url: string; isPrimary: boolean }[];
  profileStatus?: string;
}

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchProfiles = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // 👈 get token

    const response = await Axios.get(
      "/api/users?take=100&skip=0",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfiles(response.data || []);
    console.log("Profiles:", response.data);
  } catch (error: any) {
    console.error(
      "Error fetching profiles:",
      error?.response || error
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProfiles();
  }, []);

  const calculateAge = (dob?: string) => {
    if (!dob) return "--";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getProfileImage = (photos?: any[]) => {
    if (!photos || photos.length === 0)
      return "https://via.placeholder.com/400x400?text=No+Photo";
    return photos.find((p) => p.isPrimary)?.url || photos[0].url;
  };

  const filteredProfiles = profiles.filter((p) =>
    (p.fullName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Mock profiles data
  // const profiles = [
  //   {
  //     id: 1,
  //     name: "Arjun Nair",
  //     age: 31,
  //     city: "Kochi, Kerala",
  //     education: "B.Tech (Mechanical)",
  //     profession: "Project Engineer",
  //     religion: "Hindu",
  //     image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  //     isPrivate: false,
  //     bio: "Calm, responsible, and family-oriented. Loves traveling and fitness.",
  //   },
  //   {
  //     id: 2,
  //     name: "Anjana Menon",
  //     age: 27,
  //     city: "Thrissur, Kerala",
  //     education: "MBA – HR",
  //     profession: "HR Business Partner",
  //     religion: "Hindu",
  //     image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  //     isPrivate: false,
  //     bio: "Positive thinker who values honesty, respect, and meaningful relationships.",
  //   },
  //   {
  //     id: 3,
  //     name: "Fahad Rahman",
  //     age: 29,
  //     city: "Malappuram, Kerala",
  //     education: "B.Com",
  //     profession: "Business Development Executive",
  //     religion: "Muslim",
  //     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  //     isPrivate: true,
  //     bio: "Ambitious professional with strong family values and spiritual grounding.",
  //   },
  //   {
  //     id: 4,
  //     name: "Neha Thomas",
  //     age: 26,
  //     city: "Kottayam, Kerala",
  //     education: "MSc Nursing",
  //     profession: "Clinical Nurse",
  //     religion: "Christian",
  //     image: "https://images.unsplash.com/photo-1524250502433-9a6b67db8f11?w=400",
  //     isPrivate: false,
  //     bio: "Compassionate, caring, and looking for a life partner with shared values.",
  //   },
  //   {
  //     id: 5,
  //     name: "Rahul Krishnan",
  //     age: 32,
  //     city: "Palakkad, Kerala",
  //     education: "LLB",
  //     profession: "Legal Advisor",
  //     religion: "Hindu",
  //     image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  //     isPrivate: false,
  //     bio: "Grounded individual who enjoys reading, music, and meaningful conversations.",
  //   },
  //   {
  //     id: 6,
  //     name: "Swathi Mohan",
  //     age: 28,
  //     city: "Kannur, Kerala",
  //     education: "BSc Computer Science",
  //     profession: "QA Analyst",
  //     religion: "Hindu",
  //     image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
  //     isPrivate: false,
  //     bio: "Tech enthusiast with a love for travel, photography, and healthy living.",
  //   },
  //   {
  //     id: 7,
  //     name: "Ameen Ali",
  //     age: 30,
  //     city: "Calicut, Kerala",
  //     education: "MBA – Marketing",
  //     profession: "Brand Manager",
  //     religion: "Muslim",
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  //     isPrivate: true,
  //     bio: "Career-focused, respectful, and looking for a balanced life partnership.",
  //   },
  //   {
  //     id: 8,
  //     name: "Divya Ramesh",
  //     age: 29,
  //     city: "Ernakulam, Kerala",
  //     education: "B.Arch",
  //     profession: "Interior Designer",
  //     religion: "Hindu",
  //     image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400",
  //     isPrivate: false,
  //     bio: "Creative soul who enjoys design, art, and meaningful connections.",
  //   },
  //   {
  //     id: 9,
  //     name: "Joel Mathew",
  //     age: 33,
  //     city: "Pathanamthitta, Kerala",
  //     education: "MCA",
  //     profession: "IT Operations Manager",
  //     religion: "Christian",
  //     image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  //     isPrivate: false,
  //     bio: "Simple, honest, and family-first person seeking a lifelong companion.",
  //   },
  //   {
  //     id: 10,
  //     name: "Hiba Saleem",
  //     age: 25,
  //     city: "Alappuzha, Kerala",
  //     education: "BA English",
  //     profession: "Content Writer",
  //     religion: "Muslim",
  //     image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
  //     isPrivate: false,
  //     bio: "Creative writer who values kindness, empathy, and shared growth.",
  //   },
  // ];

  const ProfileCard = ({ profile }: { profile: (typeof profiles)[0] }) => (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64">
        <img
          src={getProfileImage(profile.photos)}
          alt={profile.fullName}
          className={`w-full h-full object-cover ${profile.profileStatus === "private" ? "blur-sm" : ""}`}
        />
        {profile.profileStatus === "private" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge className="bg-white text-foreground">Private Profile</Badge>
          </div>
        )}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">
          {profile.fullName},{" "}
          {profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : "--"}
        </h3>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {typeof profile.city === "string"
              ? "Location not specified"
              : profile.city?.name}
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {profile.highestEducation
              ? profile.highestEducation.name
              : "Education not specified"}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {"No bio available."}
        </p>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary gap-2"
            onClick={() => navigate(`/profile/${profile._id}`)}
          >
            <Eye className="w-4 h-4" />
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse Profiles</h2>
      </div>

      {/* Search and Filter Section */}
      <Card className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label>Religion</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Education</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">
                        Post Graduate
                      </SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Profession</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Marital Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widow">Widow/Widower</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Age Range</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <div>
                  <Label>Income Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5">₹0 - ₹5L</SelectItem>
                      <SelectItem value="5-10">₹5L - ₹10L</SelectItem>
                      <SelectItem value="10-20">₹10L - ₹20L</SelectItem>
                      <SelectItem value="20+">₹20L+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProfiles;
