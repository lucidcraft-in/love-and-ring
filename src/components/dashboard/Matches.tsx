import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  GraduationCap,
  Briefcase,
  Filter,
  Check,
  Sparkles,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import OptimizedProfileImage from "./OptimizedProfileImage";
import FiltersModal from "./FiltersModal";
import Anjali from "@/assets/anjali.jpg";
import Sneha from "@/assets/sneha.jpg";
import Aparna from "@/assets/aparna.jpg";
import Athira from "@/assets/athira.jpg";
import Neethu from "@/assets/neethu.jpg";
import Meera from "@/assets/meera.jpg";
import Lakshmi from "@/assets/Lakshmi.jpg";
import Swathi from "@/assets/swathi.jpg";
import Divya from "@/assets/divya.jpg";
import Revathy from "@/assets/anjali.jpg";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [sentInterests, setSentInterests] = useState<number[]>([]);
  const [sendingInterest, setSendingInterest] = useState<number | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user NRI plan status - set to false to simulate non-NRI user
  const hasNRIPlan = false;

  // Mock matches data
  const matches = [
    {
      id: 9,
      name: "Divya Ramesh",
      age: 28,
      city: "Ernakulam, Kerala",
      education: "B.Arch",
      profession: "Interior Designer",
      image: Divya,
      matchScore: 96,
      interests: ["Design", "Sketching", "Home Decor"],
      liked: true,
    },
    {
      id: 8,
      name: "Swathi Mohan",
      age: 26,
      city: "Kannur, Kerala",
      education: "BSc Nursing",
      profession: "Staff Nurse",
      image: Swathi,
      matchScore: 92,
      interests: ["Healthcare", "Fitness", "Cooking"],
      liked: true,
    },
    {
      id: 7,
      name: "Lakshmi Rajeev",
      age: 30,
      city: "Palakkad, Kerala",
      education: "LLB",
      profession: "Legal Associate",
      image: Lakshmi,
      matchScore: 85,
      interests: ["Law", "Debates", "Classical Music"],
      liked: true,
    },
    {
      id: 6,
      name: "Meera Suresh",
      age: 27,
      city: "Calicut, Kerala",
      education: "MA English",
      profession: "Content Strategist",
      image: Meera,
      matchScore: 88,
      interests: ["Writing", "Blogging", "Poetry"],
      liked: true,
    },
    {
      id: 1,
      name: "Anjali Menon",
      age: 27,
      city: "Kochi, Kerala",
      education: "MBA – HR",
      profession: "HR Executive",
      image: Anjali,
      matchScore: 94,
      interests: ["Reading", "Yoga", "Travel"],
      liked: false,
    },
    {
      id: 2,
      name: "Sneha Nair",
      age: 26,
      city: "Thiruvananthapuram, Kerala",
      education: "B.Tech (CSE)",
      profession: "Software Engineer",
      image: Sneha,
      matchScore: 89,
      interests: ["Coding", "Music", "Photography"],
      liked: false,
    },
    {
      id: 3,
      name: "Aparna Krishnan",
      age: 29,
      city: "Thrissur, Kerala",
      education: "MSc Psychology",
      profession: "Counseling Psychologist",
      image: Aparna,
      matchScore: 91,
      interests: ["Mental Wellness", "Journaling", "Art"],
      liked: false,
    },
    {
      id: 4,
      name: "Athira Varma",
      age: 25,
      city: "Kottayam, Kerala",
      education: "B.Com",
      profession: "Accounts Executive",
      image: Athira,
      matchScore: 87,
      interests: ["Finance", "Cooking", "Travel"],
      liked: false,
    },
    {
      id: 5,
      name: "Neethu Pillai",
      age: 28,
      city: "Alappuzha, Kerala",
      education: "MBA – Finance",
      profession: "Banking Officer",
      image: Neethu,
      matchScore: 90,
      interests: ["Investing", "Yoga", "Reading"],
      liked: false,
    },
    {
      id: 10,
      name: "Revathi Unnikrishnan",
      age: 29,
      city: "Pathanamthitta, Kerala",
      education: "MSc Mathematics",
      profession: "Higher Secondary Teacher",
      image: Revathy,
      matchScore: 93,
      interests: ["Teaching", "Puzzles", "Gardening"],
      liked: false,
    },
  ];

  // Mock NRI profiles data
  const nriProfiles = [
    {
      id: 101,
      name: "Priya Sharma",
      age: 27,
      city: "London, UK",
      education: "MS Computer Science",
      profession: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
      matchScore: 94,
      interests: ["Technology", "Travel", "Music"],
      liked: false,
    },
    {
      id: 102,
      name: "Anjali Patel",
      age: 29,
      city: "Toronto, Canada",
      education: "MBA Finance",
      profession: "Investment Banker",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      matchScore: 89,
      interests: ["Finance", "Yoga", "Reading"],
      liked: false,
    },
    {
      id: 103,
      name: "Meera Krishnan",
      age: 26,
      city: "Sydney, Australia",
      education: "MBBS, MD",
      profession: "Cardiologist",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      matchScore: 91,
      interests: ["Healthcare", "Swimming", "Cooking"],
      liked: false,
    },
    {
      id: 104,
      name: "Divya Menon",
      age: 28,
      city: "Dubai, UAE",
      education: "B.Arch",
      profession: "Senior Architect",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      matchScore: 87,
      interests: ["Architecture", "Art", "Travel"],
      liked: false,
    },
  ];

  const likedProfiles = matches.filter((m) => m.liked);

  const handleSendInterest = (matchId: number, matchName: string) => {
    if (sentInterests.includes(matchId)) return;

    setSendingInterest(matchId);

    // Simulate sending interest
    setTimeout(() => {
      setSentInterests((prev) => [...prev, matchId]);
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

  const MatchCard = ({
    match,
    isNRI = false,
  }: {
    match: (typeof matches)[0];
    isNRI?: boolean;
  }) => {
    const isInterestSent = sentInterests.includes(match.id);
    const isSending = sendingInterest === match.id;
    const isLocked = isNRI && !hasNRIPlan;

    return (
      <Card className="glass-card overflow-hidden hover:shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 w-full h-48 sm:h-auto relative overflow-hidden bg-muted rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
            <OptimizedProfileImage
              src={match.image}
              alt={match.name}
              isLocked={isLocked}
            />

            {/* Match Badge */}
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-primary to-secondary">
                {match.matchScore}% Match
              </Badge>
            </div>

            {/* Lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="bg-white/90 rounded-full p-4 shadow-lg">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {match.name}, {match.age}
                </h3>
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
              {!isLocked && (
                <Button
                  size="icon"
                  variant={match.liked ? "default" : "outline"}
                  className={
                    match.liked
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : ""
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${match.liked ? "fill-white" : ""}`}
                  />
                </Button>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isLocked ? (
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate("/pricing")}
              >
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to View Profile
              </Button>
            ) : (
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
                    <motion.div key="send" className="flex-1">
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
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
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
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Matches</h2>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(filters) => {
          console.log("Applied filters:", filters);
          toast.success("Filters applied successfully");
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Horizontal scroll container for mobile/tablet */}
        <div className="overflow-x-auto scrollbar-hide lg:overflow-visible px-1 -mx-1">
          <TabsList className="w-max lg:w-auto flex-nowrap">
            <TabsTrigger value="new">New Matches</TabsTrigger>
            <TabsTrigger value="all">My Matches</TabsTrigger>
            <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
            <TabsTrigger value="nri">NRI Profiles</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.slice(0, 2).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liked" className="mt-6">
          {likedProfiles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {likedProfiles.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <Card className="glass-card p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No Liked Profiles Yet
              </h3>
              <p className="text-muted-foreground">
                Start liking profiles to see them here
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nri" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nriProfiles.map((match) => (
              <MatchCard key={match.id} match={match} isNRI={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
