import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Link } from "react-router-dom";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. The services we provide",
    paragraph:
      "Our mission is to give individuals the power to find a suitable partner and join their hands to be a Bride and Groom, and to walk a journey of life together. To help advance this mission, weprovide the Products and services described below to you:",

    subSections: [
      {
        title: "1.1  Provide a personalised experience for you : ",
        paragraph: `Love & Ring Ltd. offers you a platform ( www.loveandring.com ) where you can register your
profile with information that are relevant and specific to you, and you express a definite
intention of willingness to share your information that will in turn support Love & Ring Ltd. to
find you a suitable partner. In this process, you agree that your registered information is
sharable to individuals who is / are searching for partners with equal or comparable intentions
of finding a Partner. If you don’t want to share or limit the information that you want to share, you
must -formally (in writing, via email, recorded voice message, WhatsApp message) notify Love
& Ring Ltd. with clear instructions of what information of you can be shared, and with who.`,
      },
      {
        title: "1.2 Connect you with Individuals and organisations:",
        paragraph: `Love & Ring Ltd. help you in finding and connect with individuals, groups, businesses,
organisations and others that matter to you in search of a suitable partner. We use your data to
make suggestions for you and others – for example, registered individuals to look at your profile,
to communicate with you using our in-built technologies, to join events organised by Love &
Ring Ltd. or to meet an individual of interest in a previously agreed meeting place with an
intention of understanding one’s suitability.
`,
      },
      {
        title: "1.3 Research ways to make our services better:",
        paragraph: `Our Products help you find and connect with people, groups, businesses, organisations and
others that are important to you. We design our systems so that your experience is consistent
and seamless across the Love & Ring Ltd. platform(s).
`,
      },
      {
        title:
          "1.4 Access to our services from various countries and geographical locations",
        paragraph: `To deliver our services across various geographical locations and jurisdictions and enable you
to connect with people around the world, we need to transfer, store and distribute your
information and data to our data centres, partners, service providers, vendors and systems
around the world, including outside your country of residence. The use of this global
infrastructure is necessary and essential for us to deliver our services. This infrastructure may
be owned, operated or controlled by Love & Ring Ltd. and / or our contractors, on basis of an
agreement relevant to individual jurisdictions.
`,
      },
    ],

    items: [],
  },
  {
    title: "2. How our services are funded",
    paragraph: `You (the ‘Client’) can choose to use our Products for free if it is for a baseline profile registration.
Once the profile registration is accomplished on our platform, any client engagement achieved
through our service will be charged. The price of our service will depend on the ‘package’ or
‘price plan’ you have selected. This agreed pricing will be consistent with the price pan you -
selected, unless until it is adjusted by Love & Ring Ltd. based on special or ad-hoc provision (s)
to ensure that the client is treated fairly and satisfactorily.`,
    items: [],
  },
  {
    title: "3. Refund Policy",
    paragraph: `As our services are delivered across various countries and jurisdictions, our refund
policy is anchored to the client’s / registrant’s home country, which will where the client
resides. We will ensure that our compliance team will meet consumer rights of client’s
residing jurisdiction and associated customer refund policy. It is up to the client to
ensure that any refund request is made within the legal boundaries of the residing
country’s consumer rights. Whilst we endeavour to meet our service obligations within
the reasonable provisions of our capabilities, it is important for the client to understand
that there are elements that may be classed under the legal / contractual term of
‘Forced Majeure’, therefore Love & Ring Ltd. may not be able to meet its legal obligations due
to extraordinary events that could be outside its control. `,
    items: [],
  },
  {
    title: "4. Account Suspension and / or Termination",
    paragraph: `The intended objectives of Love & Ring Ltd. are to be a platform where individuals feel
welcome and safe to join and publish themselves, and invite interested similar minded
individuals with an intention of engaging in a partnership in the form of a ‘Marriage’. The
term ‘Marriage’ is defined under the terms and jurisdiction of the registrant’s residing
country; therefore, any expectations must be adjusted accordingly.
Based our assessment if we establish that you have clearly, seriously and / or
repeatedly breached our Terms oof Policies, including, the Terms of Service, we may
suspend or permanently disable your access to services provided by Love & Ring Ltd. ,
and we may permanently disable or delete your account. We may also disable or delete
your account if you repeatedly infringe other people's rights or where we are required to
do so for legal reasons.
We may deactivate or suspend your account if, after registration, your account is not
confirmed, your account is unused and remains inactive for more than 14-days from the
date of registration or if we detect that someone may have used it without your
permission and we are unable to confirm your ownership of the account.
In such situations, we will notify you and will set out any options you may be able to
request such as a review of our decision, unless doing so may expose us or others to
legal liability, harm another client, compromise or interfere with the integrity or
operation of any of our services, systems or Products, where we are restricted due to
technical limitations or where we are prohibited from doing so for legal reasons.`,
    items: [],
  },
  {
    title: "5.  Limits on liability",
    paragraph: `These Terms are not intended to exclude or limit our liability for death, personal injury or
fraudulent misrepresentation caused by our negligence, or to affect your statutory rights.
We will exercise professional diligence in providing our services to you and in keeping a safe,
and secure environment. Provided that we have acted with professional diligence, we will not
accept any responsibilities for losses not caused by our negligence and beyond our reasonable
control.
`,
    items: [],
  },
  {
    title: "6. Service Guarantees and Assurances",
    paragraph: `The company, as a facilitator of connecting people (individuals), does not and cannot explicitly
assure a guaranteed outcome in finding a partner, as it solely depends on individuals’ choice
and suitability. The company only has a role of facilitation by providing a platform to connect
individuals. However, will endeavour to support our clients within the boundaries of our
capabilities.`,
    items: [],
  },
  {
    title: "7.  Complaints and Legal Disputes",
    paragraph: `In case of a claim or dispute arises out of or relates to your use of services provided by Love &
Ring Ltd., as a consumer, both you and us agree that you may resolve your individual claim or
dispute against us, and we may resolve our claim or dispute against you, in any competent
court in the country of your main residence that has jurisdiction over your claim or dispute, and
the laws of that country will apply without regard to conflict of law provisions.
If a claim or dispute arises between us that relates to use of services provided by Love & Ring
Ltd. in any other capacity, including, but not limited to, access or use of the Love & Ring Ltd.
services for a business or commercial purpose, or that an entity brings on your behalf, you
agree that any such claim or dispute must be resolved in a competent court.`,
    items: [],
  },
  // {
  //   title: "8. Changes to Terms",
  //   paragraph:
  //     "We may update these terms at any time. Users will be notified of significant changes. Continued use of the platform means acceptance of updated terms.",
  //   items: [],
  // },
];

const Terms = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  const formatTextWithLinks = (text) => {
    if (!text) return text;

    const parts = text.split(/(www\.loveandring\.com|Love & Ring Ltd\.)/g);

    return parts.map((part, index) => {
      if (part === "www.loveandring.com") {
        return (
          <Link
            key={index}
            to="https://www.loveandring.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline px-1"
          >
            {part}
          </Link>
        );
      }

      if (part === "Love & Ring Ltd.") {
        return (
          <span key={index} className="font-medium text-foreground">
            {part}
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div className="min-h-screen">
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <FloatingBrandLogo />

        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Terms of{" "}
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Use
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </motion.div>
        </div>
      </section>

      <div
        className="mx-auto px-4 py-12 md:py-16"
        style={{ maxWidth: "1200px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {" "}
              Overview
            </h1>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
              This is the Terms of Service established for{" "}
              <span className="font-medium text-black px-1">
                Love & Ring Ltd
              </span>
              . (collectively referred to as{" "}
              <span className="font-medium text-black px-1">
                "Love and Ring"
              </span>
              , “The Company”, “we”, “us” or “our” in this policy), our sites
              such as
              <Link
                to="https://www.loveandring.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline px-1"
              >
                www.loveandring.com
              </Link>
              and our associated apps (“our sites”).{" "}
              <span className="font-medium text-black px-1">
                Love & Ring Ltd
              </span>
              . establishes and manages technologies and services that enable
              individuals to connect with each other with an intended purpose of
              finding a suitable partner or match. The company act as
              facilitator for those individuals in finding a suitable partner
              and in that process collectively acting as a ‘Matrimony Website’
              or ‘Match Making Website’. The company, as a facilitator of
              connecting people, does not and cannot explicitly assure a
              guarantied outcome in finding a partner, however, endeavour to
              support our clients within the boundaries of our capabilities.
              These Terms of Service (the "Terms") govern your access and use of
              the website{" "}
              <Link
                to="https://www.loveandring.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline px-1"
              >
                www.loveandring.com
              </Link>
              and its built-in service provisions (the Love & Ring Products).
              These Terms also govern how Love and Ring uses clients’
              information in the process of acting as a facilitator platform.
              These Terms, therefore, constitute an agreement between you
              (client) and{" "}
              <span className="font-medium text-black px-1">
                Love & Ring Ltd
              </span>
              . If you do not agree to these Terms of Service, then do not
              access or use our website
              <Link
                to="https://www.loveandring.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline px-1"
              >
                www.loveandring.com
              </Link>{" "}
              or the other products and services covered by these Terms. Our
              Products enable you to connect with similar match seeking clients
              and communities, and to receive personalised service support
              guided by{" "}
              <span className="font-medium text-black px-1">
                Love & Ring Ltd
              </span>
              . Our Privacy Policy explains how we collect and use your
              information.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {section.title}
              </h2>
              <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
                {formatTextWithLinks(section.paragraph)}
              </p>
              {section.subSections?.length > 0 && (
                <div className="space-y-4 mb-5">
                  {section.subSections.map((sub) => (
                    <div key={sub.title}>
                      <h3 className="text-[15px] md:text-[16px] font-semibold text-foreground mb-1">
                        {sub.title}
                      </h3>
                      <p className="text-[15px] text-foreground/80 leading-[1.7] text-justify">
                        {formatTextWithLinks(sub.paragraph)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {section.items.length > 0 && (
                <ul className="space-y-2.5 text-foreground/70 text-[15px] leading-[1.7]">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              8. Contact Information
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions regarding these Terms of Use, please
              contact:
            </p>
            <p className="text-[15px]">
              <a
                href="mailto:support@loveandring.com"
                className="text-primary font-medium hover:underline"
              >
                support@loveandring.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
