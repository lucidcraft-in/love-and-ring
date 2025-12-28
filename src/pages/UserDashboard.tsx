import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileDashboard from "@/components/dashboard/ProfileDashboard";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import Matches from "@/components/dashboard/Matches";
import BrowseProfiles from "@/components/dashboard/BrowseProfiles";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Two-column layout */}
      <div className="flex min-h-screen">
        {/* Left: Fixed Profile Sidebar */}
        <ProfileSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={handleNavigate}
        />

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 lg:ml-0 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 lg:pl-8">
            {/* Mobile header spacing for menu button */}
            <div className="lg:hidden h-12" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <Card className="glass-card p-2 mb-6">
                <TabsList className="w-full grid grid-cols-3 h-auto bg-transparent gap-2">
                  <TabsTrigger 
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl text-xs sm:text-sm"
                  >
                    Profile Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="matches"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl text-xs sm:text-sm"
                  >
                    Matches
                  </TabsTrigger>
                  <TabsTrigger 
                    value="browse"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white py-3 rounded-xl text-xs sm:text-sm"
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
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
