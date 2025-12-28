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
        {/* Left: Fixed Profile Sidebar - Hidden on mobile */}
        <ProfileSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={handleNavigate}
        />

        {/* Sidebar spacer for desktop/tablet */}
        <div className="hidden lg:block w-[280px] flex-shrink-0" />

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 h-screen overflow-y-auto">
          <div className="p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab navigation - Mobile only */}
              <Card className="glass-card p-2 mb-6 lg:hidden">
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

              <TabsContent value="profile" className="mt-0">
                <ProfileDashboard />
              </TabsContent>

              <TabsContent value="matches" className="mt-0">
                <Matches />
              </TabsContent>

              <TabsContent value="browse" className="mt-0">
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
