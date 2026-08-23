import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Utensils,
  Building,
  Sparkles,
  Palette,
  Music,
  Shirt,
  Car,
  Briefcase,
  MapPin,
  Search,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Heart,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  WeddingService,
  getPublicWeddingServices,
  submitServiceEnquiry,
} from "@/services/WeddingServiceApi";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { id: "ALL", label: "All Services", icon: Sparkles },
  { id: "Photographers", label: "Photographers", icon: Camera },
  { id: "Catering Teams", label: "Catering Teams", icon: Utensils },
  { id: "Wedding Halls & Venues", label: "Wedding Halls & Venues", icon: Building },
  { id: "Decorators", label: "Decorators", icon: Palette },
  { id: "Makeup Artists", label: "Makeup Artists", icon: Sparkles },
  { id: "DJ & Music", label: "DJ & Music", icon: Music },
  { id: "Bridal Wear", label: "Bridal Wear", icon: Shirt },
  { id: "Transportation", label: "Transportation", icon: Car },
  { id: "Other Services", label: "Other Services", icon: Briefcase },
];

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<WeddingService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Enquiry Modal state
  const [selectedService, setSelectedService] = useState<WeddingService | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.mobile || "");
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getPublicWeddingServices();
      setServices(data || []);
    } catch (err) {
      console.error("Failed to load wedding services:", err);
      toast.error("Failed to load wedding services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEnquiry = (service: WeddingService) => {
    setSelectedService(service);
    setTicketSuccess(null);
    setEnquiryOpen(true);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitServiceEnquiry({
        name,
        email,
        phone,
        serviceId: selectedService._id,
        serviceTitle: selectedService.title,
        serviceCategory: selectedService.category,
        eventDate,
        message,
      });

      setTicketSuccess(result.ticketId);
      toast.success("Enquiry request sent successfully! We will contact you soon.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit enquiry request.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "ALL" || service.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.location && service.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 via-background to-background py-12 md:py-16 mb-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-3 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-semibold uppercase tracking-wider gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Wedding Services &amp; Partners
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Curated <span className="gradient-text">Wedding Services</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Connect with top photographers, master catering teams, dream banquet venues, decorators &amp; makeup artists to make your special day unforgettable.
          </p>

          {/* Search Bar */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search photographers, catering, venues, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-6 rounded-full bg-card/90 backdrop-blur-md border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary shadow-md text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5 pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "ALL"
                ? services.length
                : services.filter((s) => s.category === cat.id).length;

            return (
              <Button
                key={cat.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 gap-2 text-xs md:text-sm font-medium transition-all ${
                  isSelected
                    ? "shadow-sm scale-[1.02]"
                    : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-muted animate-pulse h-80" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 border-2 border-dashed border-border rounded-2xl max-w-md mx-auto p-8 space-y-4">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No Services Found</h3>
            <p className="text-xs text-muted-foreground">
              We couldn't find any services matching your search or category filter. Try clearing filters to see all partner listings.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="rounded-full px-6"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={service._id}
                className="group bg-card border border-border/60 hover:border-primary/50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Photo */}
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground backdrop-blur-md px-3 py-1 font-semibold text-xs shadow-md border-0">
                        {service.category}
                      </Badge>
                    </div>

                    {service.location && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs font-medium backdrop-blur-sm bg-black/50 px-3 py-1 rounded-full border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-rose-300" />
                        <span>{service.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>

                    {service.priceRange && (
                      <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                        {service.priceRange}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <Button
                    onClick={() => handleOpenEnquiry(service)}
                    className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm group-hover:shadow-md transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    Enquire / Request Quote
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Service Enquiry Modal Dialog */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="max-w-lg rounded-2xl overflow-hidden p-0 border border-border shadow-2xl">
          {/* Light Purple Modal Header matching user app style */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-white relative">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-white" />
              Service Inquiry
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-sm mt-1">
              Submit an enquiry to request pricing, availability, or custom packages.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4 bg-card">
            {ticketSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-foreground">Enquiry Request Sent!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your request ticket reference is <strong className="text-primary font-mono text-sm">{ticketSuccess}</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground pt-2">
                    We have dispatched an email confirmation to <strong>{email}</strong>. Our team and service partner will reach out to you shortly.
                  </p>
                </div>
                <Button
                  onClick={() => setEnquiryOpen(false)}
                  className="w-full rounded-xl mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="req-name" className="text-xs font-semibold">Your Full Name *</Label>
                  <Input
                    id="req-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="req-email" className="text-xs font-semibold">Email Address *</Label>
                    <Input
                      id="req-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-border focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="req-phone" className="text-xs font-semibold">Phone / WhatsApp</Label>
                    <Input
                      id="req-phone"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl border-border focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req-date" className="text-xs font-semibold">Preferred Event Date</Label>
                  <Input
                    id="req-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="rounded-xl border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req-message" className="text-xs font-semibold">Message &amp; Requirements</Label>
                  <Textarea
                    id="req-message"
                    rows={3}
                    placeholder="Describe your event requirements, location, estimated guest count, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-xl border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEnquiryOpen(false)}
                    disabled={submitting}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
