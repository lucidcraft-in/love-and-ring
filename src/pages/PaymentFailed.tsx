import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reason = searchParams.get("reason") || "payment_failed";

  const getErrorMessage = (errReason: string) => {
    switch (errReason) {
      case "signature_mismatch":
        return "Payment verification failed due to data security mismatch.";
      case "server_error":
        return "An internal server error occurred while processing your order.";
      case "invalid_user":
      case "user_not_found":
        return "User session was lost during checkout.";
      default:
        return "Your transaction could not be completed. Any deducted amount will be refunded automatically by your bank.";
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full stat-card-shadow text-center p-6 border-0">
        <CardContent className="space-y-6 pt-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
            <p className="text-sm text-muted-foreground">{getErrorMessage(reason)}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/pricing")}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;