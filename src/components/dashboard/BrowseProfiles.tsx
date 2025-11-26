import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, MapPin, GraduationCap, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock profiles data
  const profiles = [
    {
      id: 1,
      name: "Michael Brown",
      age: 30,
      city: "San Francisco",
      education: "MBA",
      profession: "Product Manager",
      religion: "Christian",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      isPrivate: false,
      bio: "Looking for a life partner to share adventures with"
    },
    {
      id: 2,
      name: "David Wilson",
      age: 32,
      city: "Seattle",
      education: "MS Computer Science",
      profession: "Software Architect",
      religion: "Hindu",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      isPrivate: true,
      bio: "Believes in traditional values and modern thinking"
    },
    {
      id: 3,
      name: "James Anderson",
      age: 28,
      city: "Boston",
      education: "B.Tech",
      profession: "Data Scientist",
      religion: "Muslim",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      isPrivate: false,
      bio: "Family oriented and career focused"
    },
    {
      id: 4,
      name: "Robert Taylor",
      age: 29,
      city: "Austin",
      education: "MBA Finance",
      profession: "Investment Banker",
      religion: "Christian",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      isPrivate: false,
      bio: "Looking for someone who shares my values"
    },
  ];

  const ProfileCard = ({ profile }: { profile: typeof profiles[0] }) => (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64">
        <img 
          src={profile.image} 
          alt={profile.name}
          className={`w-full h-full object-cover ${profile.isPrivate ? 'blur-sm' : ''}`}
        />
        {profile.isPrivate && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge className="bg-white text-foreground">
              Private Profile
            </Badge>
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
        <h3 className="text-lg font-bold mb-2">{profile.name}, {profile.age}</h3>
        
        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {profile.city}
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {profile.education}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {profile.bio}
        </p>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-secondary gap-2"
            onClick={() => navigate(`/profile/${profile.id}`)}
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
                      <SelectItem value="postgraduate">Post Graduate</SelectItem>
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
        {profiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProfiles;
