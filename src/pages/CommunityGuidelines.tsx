import DynamicStaticPage from "./DynamicStaticPage";

const FallbackCommunityContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Safety & Community Guidelines</h2>
        <p className="text-sm leading-relaxed text-foreground/80 text-justify">
          These Community Guidelines are designed to ensure a safe, respectful, and trustworthy environment for individuals seeking meaningful relationships on <span className="font-semibold text-foreground">Love & Ring</span>.
        </p>
      </div>
    </div>
  );
};

export default function CommunityGuidelines() {
  return (
    <DynamicStaticPage
      forcedSlug="community-guidelines"
      fallbackTitle="Community Guidelines"
      fallbackContent={<FallbackCommunityContent />}
    />
  );
}
