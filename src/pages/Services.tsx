import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
  Star,
  ArrowLeft,
  ChevronRight,
  Filter,
  Grid,
  CalendarCheck,
  Wine,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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

const categoryTiles = [
  {
    id: "Photographers",
    label: "Photographers",
    subtitle: "Wedding Photography & Cinematography",
    description: "Capture timeless moments with expert wedding photographers, candid cinematographers & pre-wedding shoots.",
    icon: Camera,
  },
  {
    id: "Catering Teams",
    label: "Catering Teams",
    subtitle: "Gourmet Catering & Feast Management",
    description: "Delight your guests with authentic multi-course menus, live food counters & custom feast packages.",
    icon: Utensils,
  },
  {
    id: "Wedding Halls & Venues",
    label: "Wedding Halls & Venues",
    subtitle: "Banquet Halls & Outdoor Destinations",
    description: "Book grand auditoriums, luxury resorts, beachside venues & elegant banquet halls for your ceremony.",
    icon: Building,
  },
  {
    id: "Decorators",
    label: "Decorators",
    subtitle: "Stage Floral & Event Styling",
    description: "Transform your venue with floral arches, royal mandap setups, ambient lighting & themed wedding styling.",
    icon: Palette,
  },
  {
    id: "Makeup Artists",
    label: "Makeup Artists",
    subtitle: "Bridal Makeup & Hair Styling",
    description: "Look your absolute best with professional bridal makeup artists, HD airbrush makeup & hair styling.",
    icon: Sparkles,
  },
  {
    id: "DJ & Music",
    label: "DJ & Music",
    subtitle: "DJs, Live Bands & Entertainment",
    description: "Bring your celebration alive with top wedding DJs, live instrumentalists, sangeet choreographers & sound.",
    icon: Music,
  },
  {
    id: "Bridal Wear",
    label: "Bridal Wear",
    subtitle: "Bridal Sarees, Lehengas & Grooms Suits",
    description: "Explore designer bridal wear, silk sarees, heavy lehengas, sherwanis & custom wedding attire designers.",
    icon: Shirt,
  },
  {
    id: "Transportation",
    label: "Transportation",
    subtitle: "Luxury Cars & Guest Coaches",
    description: "Arrive in style with luxury wedding cars, vintage automobiles & comfortable AC coaches for family guests.",
    icon: Car,
  },
  {
    id: "Event Management",
    label: "Event Management",
    subtitle: "Full-Service Event Planning & Production",
    description: "Flawless ceremony planning, vendor coordination, budget management & complete wedding execution.",
    icon: CalendarCheck,
  },
  {
    id: "Cocktail Launch",
    label: "Cocktail Launch",
    subtitle: "Bar Setups, Mixology & Reception Drinks",
    description: "Premium cocktail counters, professional mixologists, mocktails & custom beverage bars for pre-wedding events.",
    icon: Wine,
  },
  {
    id: "Anchors & Hostesses",
    label: "Anchors & Hostesses",
    subtitle: "Professional Anchors, Emcees & Event Hostesses",
    description: "Engaging event hosts, celebrity emcees, bilingual anchors & professional hospitality hostesses for weddings.",
    icon: Mic,
  },
  {
    id: "Other Services",
    label: "Other Services",
    subtitle: "Planners, Invitations & Keepsakes",
    description: "Discover wedding planners, digital video invitation designers, return gift vendors & event coordinators.",
    icon: Briefcase,
  },
];

// Flexible category matching helper
const isCategoryMatch = (serviceCategory?: string, targetCategory?: string | null) => {
  if (!targetCategory || targetCategory === "ALL") return true;
  if (!serviceCategory) return false;

  const sCat = serviceCategory.trim().toLowerCase();
  const tCat = targetCategory.trim().toLowerCase();

  if (sCat === tCat) return true;

  const keywordsMap: { [key: string]: string[] } = {
    "photographers": ["photo", "candid", "shoot", "studio"],
    "catering teams": ["cater", "food", "feast", "dining", "menu"],
    "wedding halls & venues": ["hall", "venue", "auditorium", "resort", "banquet", "palace"],
    "decorators": ["decor", "stage", "flower", "floral", "mandap"],
    "makeup artists": ["makeup", "beauty", "salon", "styling", "draping"],
    "dj & music": ["dj", "music", "band", "sound", "dance", "choreograph"],
    "bridal wear": ["wear", "saree", "lehenga", "suit", "attire", "dress"],
    "transportation": ["transport", "car", "bus", "travel", "coach", "vehicle"],
    "event management": ["event", "manage", "plan", "coordinat", "organiz", "production"],
    "cocktail launch": ["cocktail", "launch", "bar", "drink", "beverage", "lounge", "wine", "mixolog"],
    "anchors & hostesses": ["anchor", "host", "emcee", "mc", "hostess", "compere", "presenter"],
    "other services": ["other", "planner", "invitation", "gift"],
  };

  const keywords = keywordsMap[tCat];
  if (keywords && keywords.some((k) => sCat.includes(k))) {
    return true;
  }

  return sCat.includes(tCat) || tCat.includes(sCat);
};

const Services = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [services, setServices] = useState<WeddingService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const topRef = useRef<HTMLDivElement>(null);

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

  const handleSelectCategory = (catId: string) => {
    if (catId === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCategories = () => {
    setSearchParams({});
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Active Category Details Object if selected
  const activeTile = categoryTiles.find((t) => t.id === selectedCategory);

  const filteredServices = services.filter((service) => {
    const matchesCategory = isCategoryMatch(service.category, selectedCategory);
    const matchesSearch =
      !searchQuery ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.location && service.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={topRef} className="min-h-screen bg-background pt-20 pb-16">
      {/* Dynamic Header Section */}
      <div className="relative bg-gradient-to-b from-primary/10 via-background to-background py-10 md:py-14 mb-6 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 max-w-6xl">
          {selectedCategory ? (
            /* Selected Category Detailed Header */
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToCategories}
                  className="rounded-full gap-2 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back </span>
                </Button>

                <Badge variant="outline" className="rounded-full text-xs font-bold px-3.5 py-1.5 bg-card border-border shadow-xs shrink-0 whitespace-nowrap">
                  {filteredServices.length} {filteredServices.length === 1 ? "Partner Available" : "Partners Available"}
                </Badge>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 md:p-8 rounded-3xl border border-border/70 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="px-3.5 py-1 bg-primary text-primary-foreground font-semibold text-xs rounded-full gap-1.5 shadow-sm">
                      {activeTile?.icon ? <activeTile.icon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {selectedCategory}
                    </Badge>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    {activeTile?.subtitle || `${selectedCategory} Partners`}
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
                    {activeTile?.description || `Explore verified ${selectedCategory} partners for your wedding.`}
                  </p>
                </div>

                {/* Category Quick Search Bar */}
                <div className="w-full md:w-80 shrink-0">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={`Search in ${selectedCategory}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-9 py-5 rounded-full bg-background border-border text-foreground placeholder:text-muted-foreground text-xs shadow-sm focus-visible:ring-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Main Overview Header */
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <Badge className="px-3.5 py-1 bg-primary/10 text-primary border-primary/20 text-xs font-semibold uppercase tracking-wider gap-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Wedding Services
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Explore Wedding <span className="gradient-text">Service Categories</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Select a category tile below to view photography studios, master catering teams, banquet venues, decorators &amp; makeup artists.
              </p>

              {/* Global Search Bar */}
              <div className="pt-4 max-w-xl mx-auto">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search photographers, catering, venues, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-10 py-6 rounded-full bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary shadow-md text-sm"
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
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Category Quick Filter Chips */}
        <div className="bg-card/80 backdrop-blur-md p-3 rounded-2xl border border-border/60 shadow-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-primary shrink-0" />
              Quick Switch Category
            </span>
            <span className="text-[11px] whitespace-nowrap shrink-0">
              Total {services.length} Listed Partners
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 px-1 scrollbar-none snap-x touch-pan-x">
            <button
              onClick={() => handleSelectCategory("ALL")}
              className={`flex-shrink-0 snap-start flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border shadow-sm ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Categories</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-white/20">
                {services.length}
              </span>
            </button>

            {categoryTiles.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = services.filter((s) => isCategoryMatch(s.category, cat.id)).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex-shrink-0 snap-start flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all border shadow-sm ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                  <span className="whitespace-nowrap">{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {!selectedCategory ? (
          /* ================= MODE 1: CATEGORY TILES GRID (CLEAN WHITE TILES) ================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Grid className="w-5 h-5 text-primary" />
                  Prioritized Service Sections
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Select any category tile below to view partner listings.
                </p>
              </div>
              <Badge variant="outline" className="hidden sm:flex rounded-full text-xs font-semibold px-3 py-1">
                {categoryTiles.length} Categories
              </Badge>
            </div>

            {/* Category Tiles Grid (Clean White Card Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {categoryTiles.map((tile, idx) => {
                const Icon = tile.icon;
                const count = services.filter((s) => isCategoryMatch(s.category, tile.id)).length;

                return (
                  <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onClick={() => handleSelectCategory(tile.id)}
                    className="group bg-card border border-border/80 hover:border-primary/50 rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[250px]"
                  >
                    <div className="space-y-4">
                      {/* Top Row inside Clean Tile */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shadow-sm">
                          <Icon className="w-7 h-7" />
                        </div>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 font-bold text-xs rounded-full">
                          {count} {count === 1 ? "Partner" : "Partners"}
                        </Badge>
                      </div>

                      {/* Content inside Tile */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {tile.label}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed font-normal">
                          {tile.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA Link */}
                    <div className="pt-4 border-t border-border/40 flex items-center text-xs font-bold text-primary group-hover:text-primary/90 transition-colors gap-1">
                      <span>Explore {tile.label}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= MODE 2: CATEGORY SPECIFIC SERVICES LIST ================= */
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-3xl overflow-hidden bg-muted animate-pulse h-80" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border/80 rounded-3xl max-w-lg mx-auto p-8 space-y-4 shadow-sm">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-foreground">No Listings Found in {selectedCategory}</h3>
                <p className="text-xs text-muted-foreground">
                  We currently don't have any active service listings matching your filter criteria.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full text-xs px-5"
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={handleBackToCategories}
                    className="rounded-full text-xs px-5 bg-primary text-primary-foreground"
                  >
                    Back to All Categories
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredServices.map((service) => {
                  const tileInfo = categoryTiles.find((t) => isCategoryMatch(service.category, t.id));
                  const CategoryIcon = tileInfo?.icon || Sparkles;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={service._id}
                      className="group bg-card border border-border/70 hover:border-primary/50 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Section - Admin Added Image Header */}
                        {service.imageUrl ? (
                          <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            {/* Top Category Badge */}
                            <div className="absolute top-3.5 left-3.5">
                              <Badge className="bg-primary text-primary-foreground backdrop-blur-md px-3 py-1 font-semibold text-xs shadow-md border-0 rounded-full">
                                {service.category}
                              </Badge>
                            </div>

                            {/* Top Rating Badge */}
                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 text-amber-300 text-xs font-bold shadow-md">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{Number(service.rating ?? 5.0).toFixed(1)}</span>
                            </div>

                            {/* Bottom Location Badge */}
                            {service.location && (
                              <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white/95 text-xs font-medium backdrop-blur-md bg-black/60 px-3 py-1 rounded-full border border-white/20 shadow-sm max-w-[85%] truncate">
                                <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                                <span className="truncate">{service.location}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Fallback Icon Header if no image */
                          <div className="p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-primary/20 shadow-md flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <CategoryIcon className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 text-xs font-semibold rounded-full">
                                  {service.category}
                                </Badge>
                                {service.location && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span className="truncate max-w-[140px]">{service.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{Number(service.rating ?? 5.0).toFixed(1)}</span>
                            </div>
                          </div>
                        )}

                        {/* Details Section */}
                        <div className="p-6 space-y-3">
                          <h3 className="text-xl font-extrabold text-foreground leading-snug group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>

                          <div className="flex items-center gap-2 flex-wrap">
                            {service.priceRange && (
                              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                                <span>{service.priceRange}</span>
                              </div>
                            )}
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                              Verified Partner
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-normal">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-6 pt-0">
                        <Button
                          onClick={() => handleOpenEnquiry(service)}
                          className="w-full rounded-2xl py-5 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md group-hover:shadow-lg transition-all duration-300 font-bold text-sm"
                        >
                          <Send className="w-4 h-4" />
                          Enquire / Request Quote
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Service Enquiry Modal Dialog */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl overflow-hidden p-0 border border-border shadow-2xl max-h-[90vh] flex flex-col">
          {/* Light Purple Modal Header */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary p-4 sm:p-6 text-white relative shrink-0">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-white" />
              Service Inquiry
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white pr-6">
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-xs sm:text-sm mt-1">
              Submit an enquiry to request pricing, availability, or custom packages.
            </DialogDescription>
          </div>

          <div className="p-4 sm:p-6 space-y-4 bg-card overflow-y-auto max-h-[calc(90vh-100px)]">
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
