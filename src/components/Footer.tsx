import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import ringLogo from "@/assets/ring-logo.png";

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Success Stories", path: "/success-stories" },
      { name: "Contact", path: "/contact" },
    ],
    Support: [
      { name: "FAQ", path: "/faq" },
      { name: "Privacy Policy", path: "/privacy-details" },
      { name: "Terms of Use", path: "/terms" },
    ],
    Plans: [
      { name: "Pricing", path: "/pricing" },
      { name: "Free Plan", path: "/pricing#free" },
      { name: "Premium Plans", path: "/pricing#premium" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={ringLogo} alt="Love & Ring" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold gradient-text">Love & Ring</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Find your perfect match with trust, security, and complete privacy.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Social link ${index + 1}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
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

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Love & Ring. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
