import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileDashboard from "@/components/dashboard/ProfileDashboard";
import Matches from "@/components/dashboard/Matches";
import BrowseProfiles from "@/components/dashboard/BrowseProfiles";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Card className="glass-card p-2 mb-6">
            <TabsList className="w-full grid grid-cols-3 h-auto bg-transparent gap-2">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl"
              >
                Profile Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="matches"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl"
              >
                Matches
              </TabsTrigger>
              <TabsTrigger 
                value="browse"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl"
              >
                Browse Profiles
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="profile">
            <ProfileDashboard />
          </TabsContent>

          <TabsContent value="matches">
            <Matches />
          </TabsContent>

          <TabsContent value="browse">
            <BrowseProfiles />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
