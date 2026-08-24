import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, MapPin, ArrowRight, Camera, Utensils, Building, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeddingService, getPublicWeddingServices } from "@/services/WeddingServiceApi";

export default function HomeServicesSection() {
  const navigate = useNavigate();
  const [services, setServices] = useState<WeddingService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getPublicWeddingServices();
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch home services preview", err);
    } finally {
      setLoading(false);
    }
  };

  // Take top 6 services to show as tiles
  const previewServices = services.slice(0, 6);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3"
        >
          <Badge className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-semibold uppercase tracking-wider gap-1.5 inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5" />
            Wedding Concierge &amp; Partners
          </Badge>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Essential <span className="gradient-text">Wedding Services</span>
          </h2>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            From premier photographers to exquisite catering and dream banquet halls — connect with trusted professionals for your special day.
          </p>
        </motion.div>

        {/* Services Grid (6 Tiles) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl overflow-hidden bg-muted animate-pulse h-80" />
            ))}
          </div>
        ) : previewServices.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border-2 border-dashed border-border rounded-2xl max-w-md mx-auto p-8 space-y-4">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-base font-bold text-foreground">Explore Our Services Catalog</h3>
            <p className="text-xs text-muted-foreground">
              Browse curated photographers, catering teams, banquet halls, and wedding vendors.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/services">View Wedding Services</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewServices.map((service, idx) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => {
                  const cat = service.category ? `category=${encodeURIComponent(service.category)}&` : "";
                  navigate(`/services?${cat}serviceId=${service._id}`);
                }}
                className="group bg-card border border-border/60 hover:border-primary/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
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

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30 text-amber-300 text-[11px] font-bold shadow-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{Number(service.rating ?? 5.0).toFixed(1)}</span>
                    </div>

                    {service.location && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs font-medium backdrop-blur-sm bg-black/50 px-3 py-1 rounded-full border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-rose-300" />
                        <span>{service.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {service.title}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      {service.priceRange && (
                        <div className="inline-block px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                          {service.priceRange}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(service.rating ?? 5.0).toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const cat = service.category ? `category=${encodeURIComponent(service.category)}&` : "";
                      navigate(`/services?${cat}serviceId=${service._id}&openEnquiry=true`);
                    }}
                    className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform hover:underline text-left"
                  >
                    <span>Enquire &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All / Show More Services Button */}
        <div className="text-center mt-10 sm:mt-14">
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full px-8 py-6 text-sm sm:text-base border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm transition-all duration-300 group"
          >
            <Link to="/services" className="inline-flex items-center gap-2">
              <span>Show More Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
