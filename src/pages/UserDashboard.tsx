import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
    <div className="min-h-screen bg-muted/30 dark:bg-background lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:h-full">
        {/* Left: Sidebar */}
        <ProfileSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          onNavigate={handleNavigate}
        />

        {/* Right: Scrollable Main Content */}
        <main className="flex-1 lg:overflow-y-auto lg:h-screen">
          <div className="min-h-[120vh] flex flex-col">
            <div className="flex-1 p-6 lg:p-8">
              {/* Mobile/Tablet Menu Toggle - Under navbar */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border shadow-sm hover:bg-muted transition-colors"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="text-sm font-medium">Menu</span>
                </button>
              </div>
              
              {renderContent()}
            </div>

            {/* Footer inside right content area */}
            <div className="mt-auto">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
