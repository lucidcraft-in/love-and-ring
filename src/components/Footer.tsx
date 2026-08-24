import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import ringLogo from "@/assets/ring-logo.png";
import Axios from "@/axios/axios";

interface CMSStaticPage {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  status?: string;
}

interface FooterLinkItem {
  name: string;
  path: string;
}

const defaultLinks: Record<string, FooterLinkItem[]> = {
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "Contact", path: "/contact" },
  ],
  Support: [
    { name: "FAQ", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy-details" },
    { name: "Terms of Use", path: "/terms" },
    { name: "Community Guidelines", path: "/community-guidelines" },
    { name: "Refund Policy", path: "/refund-policy" },
  ],
  Plans: [
    { name: "Pricing", path: "/pricing" },
    // { name: "Free Plan", path: "/pricing#free" },
    { name: "Premium Plans", path: "/pricing#million-club" },
  ],
};

const slugToPathMap: Record<string, string> = {
  about: "/about",
  "about-us": "/about",
  "success-stories": "/success-stories",
  contact: "/contact",
  "contact-us": "/contact",
  faq: "/faq",
  "privacy-details": "/privacy-details",
  privacy: "/privacy-details",
  terms: "/terms",
  "terms-of-use": "/terms",
  "community-guidelines": "/community-guidelines",
  "refund-policy": "/refund-policy",
  pricing: "/pricing",
};

const Footer = () => {
  const [footerSections, setFooterSections] = useState<Record<string, FooterLinkItem[]>>(defaultLinks);

  useEffect(() => {
    let isMounted = true;
    Axios.get<CMSStaticPage[]>("/api/cms/static-pages")
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const publishedPages = res.data.filter((p) => p.status !== "DRAFT");

          if (publishedPages.length === 0) return;

          const dynamicSections: Record<string, FooterLinkItem[]> = {
            Company: [
              { name: "About Us", path: "/about" },
              { name: "Success Stories", path: "/success-stories" },
              { name: "Contact", path: "/contact" },
            ],
            Support: [
              { name: "FAQ", path: "/faq" },
            ],
            Legal: [],
            Plans: [
              { name: "Pricing", path: "/pricing" },
              // { name: "Free Plan", path: "/pricing#free" },
              { name: "Premium Plans", path: "/pricing#million-club" },
            ],
          };

          publishedPages.forEach((page) => {
            const targetPath = slugToPathMap[page.slug] || `/pages/${page.slug}`;
            const linkItem: FooterLinkItem = { name: page.title, path: targetPath };

            let targetCategory = page.category || "Support";
            if (targetCategory === "General") targetCategory = "Support";

            if (!dynamicSections[targetCategory]) {
              dynamicSections[targetCategory] = [];
            }

            // Prevent duplicate entries by path or title
            const exists = dynamicSections[targetCategory].some(
              (item) => item.path === targetPath || item.name.toLowerCase() === page.title.toLowerCase()
            );

            if (!exists) {
              dynamicSections[targetCategory].push(linkItem);
            }
          });

          // Cleanup empty categories
          Object.keys(dynamicSections).forEach((cat) => {
            if (dynamicSections[cat].length === 0) {
              delete dynamicSections[cat];
            }
          });

          setFooterSections(dynamicSections);
        }
      })
      .catch((err) => {
        console.warn("Failed to load CMS pages for footer dynamic links:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/17jBoT87vC/?mibextid=wwXIfr" },
    { icon: Instagram, href: "https://www.instagram.com/_loveandring_?igsi=anE0em51OXphajIz" },
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={ringLogo}
                alt="Love & Ring"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold gradient-text">
                Love & Ring
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Find your perfect match with trust, security, and complete
              privacy.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Social link ${index + 1}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerSections).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 text-sm text-muted-foreground space-y-6">
          <div className="text-center">
            <p className="font-semibold text-base text-foreground">Love & Ring Ltd.</p>
          </div>

          {/* Three Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2 text-sm">
            {/* 1st: Ernakulam Address (First / Left) */}
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-foreground font-semibold">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Ernakulam Office</span>
              </div>
              <p className="leading-relaxed">
                Door Number. 66/127, Marika P O,<br />
                Koothattukulam, Ernakulam,<br />
                Kerala, India – 686662
              </p>
            </div>

            {/* 2nd: Corporate Office in Kozhikode (Middle) */}
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center space-x-2 text-foreground font-semibold">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Corporate Office (Kozhikode)</span>
              </div>
              <p className="leading-relaxed">
                Room Number 1215,<br />
                HiLite Business Park,<br />
                Calicut, Kerala, India
              </p>
            </div>

            {/* 3rd: UK Address (Right End) */}
            <div className="space-y-2 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-2 text-foreground font-semibold">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>UK Office</span>
              </div>
              <p className="leading-relaxed">
                4 Lime Close, Chichester,<br />
                PO19 6SW, UK
              </p>
              <p>
                <span className="font-medium text-foreground">No: </span>
                <a href="tel:+447397877796" className="hover:text-primary transition-colors">
                  +447397877796
                </a>
              </p>
            </div>
          </div>

          {/* Contact Details & Copyright */}
          <div className="border-t border-border/60 pt-6 text-center space-y-3">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs">
              <p className="flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground ml-1">Email:</span>
                <a
                  href="mailto:loveandring.support@gmail.com"
                  className="hover:text-primary transition-colors ml-1"
                >
                  loveandring.support@gmail.com
                </a>
              </p>
              <p className="flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground ml-1">India:</span>
                <a href="tel:+919074503259" className="hover:text-primary transition-colors ml-1">
                  +91-9074503259
                </a>
              </p>
              <p className="flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground ml-1">UK:</span>
                <a href="tel:+447397877796" className="hover:text-primary transition-colors ml-1">
                  +447397877796
                </a>
              </p>
            </div>

            <p className="text-xs pt-2">
              &copy; {new Date().getFullYear()} Love & Ring Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
