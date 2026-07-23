import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const txnid = searchParams.get("txnid") || "N/A";
  const plan = searchParams.get("plan") || "Membership Plan";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full stat-card-shadow text-center p-6 border-0">
        <CardContent className="space-y-6 pt-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-sm text-muted-foreground">
              Thank you for subscribing. Your <strong>{plan}</strong> subscription has been activated successfully.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-medium">{txnid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-green-600">SUCCESS</span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;