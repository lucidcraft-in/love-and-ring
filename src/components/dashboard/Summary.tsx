import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Heart, Eye, Phone, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const isPremium = false; // Mock user membership status

  const handlePremiumFeature = () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
    }
  };

  const handleCardClick = (cardTitle: string, premium: boolean) => {
    if (premium && !isPremium) {
      handlePremiumFeature();
      return;
    }
    
    // Navigate to respective pages
    if (cardTitle === "Contact Viewed") {
      navigate("/dashboard/contacts-viewed");
    } else if (cardTitle === "Chats") {
      navigate("/dashboard/chats");
    }
  };

  const summaryCards = [
    { title: "Pending Invitations", count: 5, icon: Heart, color: "from-violet-500 to-purple-600" },
    { title: "Accepted Invitations", count: 12, icon: Heart, color: "from-primary to-secondary" },
    { title: "Recent Visitors", count: 23, icon: Eye, color: "from-blue-500 to-cyan-500" },
    { title: "Contact Viewed", count: 8, icon: Phone, color: "from-pink-500 to-rose-600", premium: true },
    { title: "Chats", count: 15, icon: MessageCircle, color: "from-green-500 to-emerald-600", premium: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Summary</h2>
      
      {/* 5 cards in a single row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isLocked = card.premium && !isPremium;
          
          return (
            <Card 
              key={card.title}
              className={`glass-card p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all`}
              onClick={() => handleCardClick(card.title, !!card.premium)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                  {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <h3 className="text-2xl font-bold mb-1">{isLocked ? '••' : card.count}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{card.title}</p>
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
            <DialogTitle className="text-2xl gradient-text">Upgrade to Premium</DialogTitle>
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
