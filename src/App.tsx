import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import SuccessStories from "./pages/SuccessStories";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import SingleProfile from "./pages/SingleProfile";
import ContactsViewed from "./pages/ContactsViewed";
import ChatsPage from "./pages/ChatsPage";
import ClientTerms from "./pages/ClientTerms";
import ClientRegistration from "./pages/ClientRegistration";
import PlanDetail from "./pages/PlanDetail";
import Support from "./pages/Support";
import PrivacyDetails from "./pages/PrivacyDetails";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import CallPage from "./pages/CallPage";
import socket from "@/socket";
import { useNavigate } from "react-router-dom";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import RefundPolicy from "./pages/RefundPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState<any>(null);

  // Hero routes have transparent navbar overlay - no padding needed
  const heroRoutes = ["/", "/login", "/register", "/client-terms", "/client-registration", "/about", "/success-stories", "/pricing", "/contact", "/forgot-password", "/privacy-details", "/terms"];
  const isHeroRoute = heroRoutes.includes(location.pathname);

  // Public pages where WhatsApp button should show
  const publicRoutes = ["/", "/about", "/pricing", "/faq", "/contact", "/success-stories"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Dashboard routes have their own footer - hide global footer
  const dashboardRoutes = ["/dashboard", "/dashboard/contacts-viewed", "/dashboard/chats"];
  const isDashboardRoute = dashboardRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // Video call page should be full screen without header/footer
  const isCallRoute = location.pathname.startsWith("/call/");

  // socket.io connection & call notifications
  useEffect(() => {
    const registerUser = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?._id) {
        console.log("Registering user on socket:", user._id);
        socket.emit("register", user._id);
      }
    };

    if (socket.connected) {
      registerUser();
    }

    socket.on("connect", registerUser);

    const handleIncomingCall = (data: any) => {
      console.log("Incoming call received:", data);
      setIncomingCall(data);
    };

    const handleCallCanceled = ({ roomId }: { roomId: string }) => {
      setIncomingCall((prev: any) => (prev?.roomId === roomId ? null : prev));
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-canceled", handleCallCanceled);

    return () => {
      socket.off("connect", registerUser);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-canceled", handleCallCanceled);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Single Navbar for all routes - hidden on full-screen video call pages */}
      {!isCallRoute && <Navbar />}
      <main className={`flex-1 ${!isHeroRoute && !isCallRoute ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pricing/:plan" element={<PlanDetail />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/client-terms" element={<ClientTerms />} />
          <Route path="/client-registration" element={<ClientRegistration />} />
          <Route path="/privacy-details" element={<PrivacyDetails />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/contacts-viewed" element={<ContactsViewed />} />
            <Route path="/dashboard/chats" element={<ChatsPage />} />
            <Route path="/profile/:id" element={<SingleProfile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/call/:roomId" element={<CallPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Hide global footer on dashboard and video call routes */}
      {!isDashboardRoute && !isCallRoute && <Footer />}
      {/* WhatsApp floating button - only on public pages */}
      {isPublicRoute && <WhatsAppButton />}

      {incomingCall && (
        <div className="fixed bottom-5 right-5 bg-white shadow-xl rounded-xl p-4 w-80 z-50 border border-primary/20 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            {incomingCall.fromUser?.photos?.[0]?.url ? (
              <img
                src={incomingCall.fromUser.photos[0].url}
                alt={incomingCall.fromUser.fullName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                {incomingCall.fromUser?.fullName?.charAt(0) || "C"}
              </div>
            )}
            <div>
              <p className="font-semibold text-base">
                {incomingCall.fromUser?.fullName || "Incoming Call"}
              </p>
              <p className="text-xs text-muted-foreground">
                Calling you...
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
              onClick={() => {
                socket.emit("accept-call", {
                  to: incomingCall.from,
                  roomId: incomingCall.roomId,
                });
                navigate(`/call/${incomingCall.roomId}`);
                setIncomingCall(null);
              }}
            >
              Accept
            </button>

            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
              onClick={() => {
                socket.emit("reject-call", {
                  to: incomingCall.from,
                  roomId: incomingCall.roomId,
                });
                setIncomingCall(null);
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>


  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
