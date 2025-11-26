import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "./Summary";
import EditProfile from "./EditProfile";
import MyPhotos from "./MyPhotos";
import PartnerPreference from "./PartnerPreference";

const ProfileDashboard = () => {
  const [activeSection, setActiveSection] = useState("summary");

  return (
    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent h-auto mb-6">
        <TabsTrigger value="summary" className="rounded-lg">Summary</TabsTrigger>
        <TabsTrigger value="edit" className="rounded-lg">Edit Profile</TabsTrigger>
        <TabsTrigger value="photos" className="rounded-lg">My Photos</TabsTrigger>
        <TabsTrigger value="preference" className="rounded-lg">Partner Preference</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <Summary />
      </TabsContent>

      <TabsContent value="edit">
        <EditProfile />
      </TabsContent>

      <TabsContent value="photos">
        <MyPhotos />
      </TabsContent>

      <TabsContent value="preference">
        <PartnerPreference />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileDashboard;
