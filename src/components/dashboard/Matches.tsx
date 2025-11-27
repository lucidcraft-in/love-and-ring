import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, GraduationCap, Briefcase, Filter, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [sentInterests, setSentInterests] = useState<number[]>([]);
  const [sendingInterest, setSendingInterest] = useState<number | null>(null);
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

  const handleSendInterest = (matchId: number, matchName: string) => {
    if (sentInterests.includes(matchId)) return;
    
    setSendingInterest(matchId);
    
    // Simulate sending interest
    setTimeout(() => {
      setSentInterests(prev => [...prev, matchId]);
      setSendingInterest(null);
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Interest sent to {matchName}!</span>
        </div>,
        {
          description: "They will be notified about your interest.",
          duration: 3000,
        }
      );
    }, 1000);
  };

  const MatchCard = ({ match }: { match: typeof matches[0] }) => {
    const isInterestSent = sentInterests.includes(match.id);
    const isSending = sendingInterest === match.id;

    return (
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
              <AnimatePresence mode="wait">
                {isInterestSent ? (
                  <motion.div
                    key="sent"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Interest Sent
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full relative overflow-hidden"
                      onClick={() => handleSendInterest(match.id, match.name)}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
                        />
                      ) : null}
                      <span className="relative z-10 flex items-center">
                        {isSending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Send Interest
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    );
  };

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
