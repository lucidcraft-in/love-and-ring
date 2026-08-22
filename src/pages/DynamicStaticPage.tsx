import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import Axios from "@/axios/axios";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Loader2, ArrowLeft, Calendar, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

interface StaticPageData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  status?: string;
  updatedAt?: string;
}

interface DynamicStaticPageProps {
  forcedSlug?: string;
  fallbackTitle?: string;
  fallbackContent?: React.ReactNode;
}

export default function DynamicStaticPage({ forcedSlug, fallbackTitle, fallbackContent }: DynamicStaticPageProps) {
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState<StaticPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    Axios.get<StaticPageData>(`/api/cms/static-pages/slug/${slug}`)
      .then((res) => {
        if (isMounted) {
          if (res.data && (res.data.content || res.data.title)) {
            setPage(res.data);
          } else {
            setPage(null);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Failed to fetch CMS static page for slug:", slug, err);
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const displayTitle = page?.title || fallbackTitle || "Information";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section
        id="hero-section"
        className="relative min-h-[45vh] flex items-center justify-center overflow-hidden"
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <FloatingBrandLogo />

        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            {page?.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                <Tag className="w-3.5 h-3.5" />
                {page.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {displayTitle}
            </h1>
            {page?.updatedAt && (
              <p className="text-xs sm:text-sm text-white/80 flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Last updated: {new Date(page.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Page Body Content */}
      <div className="container mx-auto px-4 py-12 md:py-16" style={{ maxWidth: "1100px" }}>
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading page content...</p>
          </div>
        ) : page && page.content ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card p-6 md:p-10 rounded-2xl border shadow-sm space-y-6"
          >
            <div
              className="prose max-w-none dark:prose-invert text-foreground/90 leading-relaxed space-y-4 font-sans cms-content-render"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            <div className="border-t pt-6 text-xs text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Official Love & Ring Policy
              </span>
              <span>&copy; {new Date().getFullYear()} Love & Ring Ltd.</span>
            </div>
          </motion.div>
        ) : fallbackContent ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {fallbackContent}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-card border rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              The requested content page is currently unavailable or has been moved.
            </p>
            <Button asChild className="mt-2">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
