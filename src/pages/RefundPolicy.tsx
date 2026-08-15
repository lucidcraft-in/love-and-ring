import DynamicStaticPage from "./DynamicStaticPage";
import { Link } from "react-router-dom";

const FallbackRefundContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Refund & Cancellation Policy</h2>
        <p className="text-sm leading-relaxed text-foreground/80 text-justify">
          This Refund & Cancellation Policy is established for <span className="font-semibold text-foreground">Love & Ring Ltd</span>. All payments made for subscription plans are generally non-refundable. However, refunds may be considered in exceptional cases such as technical errors or duplicate transactions.
        </p>
      </div>
    </div>
  );
};

export default function RefundPolicy() {
  return (
    <DynamicStaticPage
      forcedSlug="refund-policy"
      fallbackTitle="Refund Policy"
      fallbackContent={<FallbackRefundContent />}
    />
  );
}
