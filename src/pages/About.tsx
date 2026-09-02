import DynamicStaticPage from "./DynamicStaticPage";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We prioritize your safety with verified profiles and secure data handling",
  },
  {
    icon: Heart,
    title: "Genuine Profiles",
    description: "Helping people find meaningful relationships based on shared values",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a community that is welcoming, supportive and spreading human spirit",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to bring best match finding experience",
  },
];

const FallbackAboutContent = () => {
  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            At Love & Ring, our mission is to help individuals find their perfect life partner through a secure, trustworthy, and culturally sensitive platform. We believe that every person deserves to find true love and companionship.
          </p>
        </div>
        <Card className="p-4 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
            alt="Happy couple"
            className="w-full rounded-lg"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <Card key={i} className="p-6 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <v.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-xs text-muted-foreground">{v.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function About() {
  return (
    <DynamicStaticPage
      forcedSlug="about"
      fallbackTitle="About Love & Ring Matrimony"
      fallbackContent={<FallbackAboutContent />}
    />
  );
}
