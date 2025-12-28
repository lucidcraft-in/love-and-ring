import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import Summary from "@/components/dashboard/Summary";
import EditProfile from "@/components/dashboard/EditProfile";
import MyPhotos from "@/components/dashboard/MyPhotos";
import PartnerPreference from "@/components/dashboard/PartnerPreference";
import Matches from "@/components/dashboard/Matches";
import BrowseProfiles from "@/components/dashboard/BrowseProfiles";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll on mount
  useEffect(() => {
    document.body.classList.add("dashboard-view");
    return () => {
      document.body.classList.remove("dashboard-view");
    };
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <Summary />;
      case "edit-profile":
        return <EditProfile />;
      case "my-photos":
        return <MyPhotos />;
      case "partner-preference":
        return <PartnerPreference />;
      case "matches":
        return <Matches />;
      case "browse":
        return <BrowseProfiles />;
      default:
        return <Summary />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f9fc] dark:bg-background">
      <div className="flex h-full">
        {/* Left: Fixed Profile Sidebar */}
        <ProfileSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          onNavigate={handleNavigate}
        />

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Mobile header spacing for menu button */}
            <div className="lg:hidden h-8" />
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
