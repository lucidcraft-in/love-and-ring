import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Heart, Eye, Phone, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "@/axios/axios";

interface SummaryData {
  pendingInvitations: number;
  acceptedInvitations: number;
  recentVisitors: number;
  contactViewed: number | null;
  chats: number | null;
}

const Summary = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const isPremium = false;

  const handlePremiumFeature = () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
    }
  };

  const handleCardClick = (cardTitle: string) => {
    // Navigate to respective pages directly
    if (cardTitle === "Contact Viewed") {
      navigate("/dashboard/contacts-viewed");
    } else if (cardTitle === "Chats") {
      navigate("/dashboard/chats");
    }
  };

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await Axios.get("/api/user/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const summaryCards = [
    {
      title: "Pending Invitations",
      count: summaryData?.pendingInvitations ?? 0,
      icon: Heart,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Accepted Invitations",
      count: summaryData?.acceptedInvitations ?? 0,
      icon: Heart,
      color: "from-primary to-secondary",
    },
    {
      title: "Recent Visitors",
      count: summaryData?.recentVisitors ?? 0,
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Contact Viewed",
      count: summaryData?.contactViewed ?? 0,
      icon: Phone,
      color: "from-pink-500 to-rose-600",
      premium: true,
    },
    {
      title: "Chats",
      count: summaryData?.chats ?? 0,
      icon: MessageCircle,
      color: "from-green-500 to-emerald-600",
      premium: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Summary</h2>

      {/* First row: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.slice(0, 3).map((card) => {
          const Icon = card.icon;
          const isLocked = card.premium && !isPremium;

          return (
            <Card
              key={card.title}
              className={`glass-card p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all`}
              onClick={() => handleCardClick(card.title)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                  {isLocked && (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLocked ? "••" : card.count}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {card.title}
                </p>
                {isLocked && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePremiumFeature();
                    }}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Second row: 2 cards centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-2/3 lg:mx-auto">
        {summaryCards.slice(3).map((card) => {
          const Icon = card.icon;
          const isLocked = card.premium && !isPremium;

          return (
            <Card
              key={card.title}
              className={`glass-card p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all`}
              onClick={() => handleCardClick(card.title)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                  {isLocked && (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLocked ? "••" : card.count}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {card.title}
                </p>
                {isLocked && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePremiumFeature();
                    }}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription className="text-base">
              Unlock exclusive features to find your perfect match faster!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  View contact details of profiles
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Unlimited messaging with matches
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  See who viewed your profile
                </li>
              </ul>
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              Choose a Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Summary;
