import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, GraduationCap, Briefcase, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("new");
  const navigate = useNavigate();

  // Mock matches data
  const matches = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      city: "New York",
      education: "MBA",
      profession: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      matchScore: 95,
      interests: ["Travel", "Reading", "Yoga"],
      liked: false
    },
    {
      id: 2,
      name: "Emily Davis",
      age: 26,
      city: "Los Angeles",
      education: "B.Tech",
      profession: "Software Engineer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      matchScore: 88,
      interests: ["Music", "Hiking", "Photography"],
      liked: true
    },
    {
      id: 3,
      name: "Jessica Wilson",
      age: 29,
      city: "Chicago",
      education: "MD",
      profession: "Doctor",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
      matchScore: 92,
      interests: ["Fitness", "Cooking", "Art"],
      liked: false
    },
  ];

  const likedProfiles = matches.filter(m => m.liked);

  const MatchCard = ({ match }: { match: typeof matches[0] }) => (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto relative">
          <img 
            src={match.image} 
            alt={match.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-primary to-secondary">
              {match.matchScore}% Match
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{match.name}, {match.age}</h3>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {match.city}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {match.education}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {match.profession}
                </span>
              </div>
            </div>
            <Button
              size="icon"
              variant={match.liked ? "default" : "outline"}
              className={match.liked ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              <Heart className={`w-4 h-4 ${match.liked ? 'fill-white' : ''}`} />
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Interests:</p>
            <div className="flex flex-wrap gap-2">
              {match.interests.map(interest => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate(`/profile/${match.id}`)}
            >
              View Profile
            </Button>
            <Button variant="outline" className="flex-1">
              Send Interest
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Matches</h2>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="new">New Matches</TabsTrigger>
          <TabsTrigger value="all">My Matches</TabsTrigger>
          <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4 mt-6">
          {matches.slice(0, 2).map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </TabsContent>

        <TabsContent value="liked" className="space-y-4 mt-6">
          {likedProfiles.length > 0 ? (
            likedProfiles.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <Card className="glass-card p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Liked Profiles Yet</h3>
              <p className="text-muted-foreground">
                Start liking profiles to see them here
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
