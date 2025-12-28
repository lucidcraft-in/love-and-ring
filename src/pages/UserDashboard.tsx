import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import Summary from "@/components/dashboard/Summary";
import EditProfile from "@/components/dashboard/EditProfile";
import MyPhotos from "@/components/dashboard/MyPhotos";
import PartnerPreference from "@/components/dashboard/PartnerPreference";
import Matches from "@/components/dashboard/Matches";
import BrowseProfiles from "@/components/dashboard/BrowseProfiles";
import Footer from "@/components/Footer";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll on desktop/tablet only
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
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
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-background lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:min-h-[120vh]">
        {/* Left: Fixed Profile Sidebar - Desktop/Tablet only */}
        <div className="hidden lg:block lg:w-[260px] lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden lg:flex-shrink-0">
          <ProfileSidebar 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <ProfileSidebar 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 lg:overflow-y-auto lg:h-screen">
          <div className="min-h-[120vh] flex flex-col">
            <div className="flex-1 p-6 lg:p-8">
              {/* Mobile header spacing for menu button */}
              <div className="lg:hidden h-8" />
              
              {renderContent()}
            </div>

            {/* Footer inside right content area - Desktop/Tablet only */}
            <div className="hidden lg:block mt-auto pb-8">
              <Footer />
            </div>
          </div>

          {/* Footer for mobile - normal position */}
          <div className="lg:hidden">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
