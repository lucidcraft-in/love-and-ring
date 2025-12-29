import { Toaster } from "@/components/ui/toaster";
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
import UserDashboard from "./pages/UserDashboard";
import SingleProfile from "./pages/SingleProfile";
import ContactsViewed from "./pages/ContactsViewed";
import ChatsPage from "./pages/ChatsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  
  // Hero routes have transparent navbar overlay - no padding needed
  const heroRoutes = ["/", "/login", "/register"];
  const isHeroRoute = heroRoutes.includes(location.pathname);

  // Public pages where WhatsApp button should show
  const publicRoutes = ["/", "/about", "/pricing", "/faq", "/contact", "/success-stories"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Single Navbar for all routes - handles hero/standard styling internally */}
      <Navbar />
      <main className={`flex-1 ${!isHeroRoute ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/contacts-viewed" element={<ContactsViewed />} />
          <Route path="/dashboard/chats" element={<ChatsPage />} />
          <Route path="/profile/:id" element={<SingleProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* WhatsApp floating button - only on public pages */}
      {isPublicRoute && <WhatsAppButton />}
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
