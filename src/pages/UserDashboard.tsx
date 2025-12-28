import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import ProfileDashboard from "@/components/dashboard/ProfileDashboard";
import Summary from "@/components/dashboard/Summary";
import EditProfile from "@/components/dashboard/EditProfile";
import MyPhotos from "@/components/dashboard/MyPhotos";
import PartnerPreference from "@/components/dashboard/PartnerPreference";
import Matches from "@/components/dashboard/Matches";
import BrowseProfiles from "@/components/dashboard/BrowseProfiles";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");

  // Lock body scroll only on tablet/desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        document.body.classList.add("dashboard-view");
      } else {
        document.body.classList.remove("dashboard-view");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.body.classList.remove("dashboard-view");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
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
    <>
      {/* Mobile Layout - Original stacked layout with ProfileDashboard */}
      <div className="md:hidden min-h-screen bg-muted">
        <ProfileDashboard />
      </div>

      {/* Tablet/Desktop Layout - Fixed sidebar + scrollable content */}
      <div className="hidden md:flex h-screen overflow-hidden bg-[#f7f9fc] dark:bg-background">
        {/* Left: Fixed Profile Sidebar */}
        <ProfileSidebar 
          isOpen={false} 
          onToggle={() => {}}
          activeTab={activeTab}
          onNavigate={handleNavigate}
        />

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto md:ml-[280px]">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
