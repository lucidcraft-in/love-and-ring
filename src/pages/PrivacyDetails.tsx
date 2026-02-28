import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Button } from "@/components/ui/button";
const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. What Personal Data we will collect about you",
    paragraph: `We collect your personal data when you visit our site(s), subscribe for products or services, make payment for the service, or when you interact with us.

Personal data is any information which can identify you directly, or indirectly, for example when combined. Personal data can include your name, email address or phone number. It can also be information such as your IP address, or how you interact with our sites and services.

When we refer to “personal data” in this policy, we are also referencing “personal information,” as it is defined under California law, and as it is defined under Australian law.

Personal data we collect when you register for a Love & Ring service on www.loveandring.com`,
    items: [
      "Your name.",
      "Your email address.",
      "Other details such as your contact number and residential or billing address when you sign up to support us or purchase a subscription.",
      "Your username, if you comment on our sites.",
      "Your photographs,",
      "Your education and professional details",
      "Your marital status",
      "Your sexual orientation",
      "Your personal preferences in terms of selecting a Partner",
      "Your personal income / wealth / asset details",
      "Your physical and Mantal Health details",
      "Your geographical location (s)",
      "Your Hobbies / Interests",
      "Your religious orientation",
    ],
  },
  {
    title: "2. Personal data we generate about you",
    paragraph: `When you register for a Love & Ring account, sign up for a newsletter, or make a payment, we assign you a unique ID number. We use this to manage your preferences, for example, the newsletters you have subscribed to. We use your unique ID number to recognise you when you are signed in to our services.

We will match your unique ID number to your browsing behaviour to recognise you on a new device or through a different application such as the Love & Ring app on mobile devices.

When you use our site (s) we may also use cookies or similar technologies to collect or generate extra data, including:`,
    items: [
      "Your IP address, which is a numerical code to identify your device, together with the country, region or city where you are based.",
      "Your geolocation data - your IP address can be used to find information about the latitude, longitude, altitude of your device, its direction of travel, your GPS data and data about connection with local Wi-Fi equipment.",
      "Information on how you interact with our services.",
      "Your browsing history of the content you have visited on our sites, including how you were referred to our sites via other websites.",
      "Details of your computer, mobile, TV, tablet or other devices, for example, the unique device ID, mobile advertising ID, unique vendor or advertising ID and browsers used to access our content.",
      "Identifiers derived from those cookies or similar technologies, your device, or generated based on the personal data you share when registering, signing up for newsletters or making a payment, such as your email address, or the data described above.",
    ],
  },
  {
    title: "3. Updating your personal data and your profile page on our sites",
    paragraph: `When you register for a Love & Ring account, you have access to you profile page. Under “Profile” you can review and update what personal data you want to be public.`,
    items: [],
  },
  {
    title: "4. Children’s personal data",
    paragraph: `We do not aim any of our products or services directly at children / individual under the age of 18 and we do not knowingly collect personal data about children / individual under 18 in providing our services. Some of our services may have a higher age restriction and this will be shown at the point of registration.

We also note and comply with the California law which prohibits sale of personal data of consumers between 13-16 years of age.`,
    items: [],
  },
  {
    title: "5. How we collect personal data about you",
    paragraph: `We collect personal data about you in line with applicable laws, in the following ways:`,
    items: [
      "Directly from you, e.g. when you sign up for our services, purchase products or services, including by signing up for newsletters",
      "From third parties, e.g. personal data that helps us to combat fraud or which we collect, with your permission, when you interact with us through your social media accounts and/or payment service providers (e.g. Paypal).",
      "Personal data shared by event partners: when you register or book a ticket for a Love & Ring event organised by an event partner, your registration data may be shared with us by the event partner.",
      "Personal data shared by survey partners: when you participate in a survey conducted by one of our survey partners, your email address may be shared with us by the survey partner to facilitate follow-up research",
    ],
  },
  {
    title: "6. Why and how we use your personal data",
    paragraph: `We use personal data collected through our site (s) only when we have a valid reason and the legal grounds to do so. We determine the legal grounds based on the purposes for which we have collected your personal data.

The legal ground may be one of the following:`,
    items: [
      "Consent: We will use your personal data where we have asked for your consent, which you can withdraw at any time. For example, we will rely on consent to place non-essential cookies and similar technologies including for personalised advertising and to send your hashed email to advertising partners when you have agreed to personalised advertising.",
      "Performance of a contract with you (or in order to take steps prior to entering into a contract with you): We will use your personal data if we need to in order to perform a contract with you, such as processing subscriptions, payments, competitions or prize draws.",
      "Compliance with law: In some cases, we may have a legal obligation to use or keep your personal data, for example to retain records of transactions as required by financial regulations.",
      "Our legitimate interest: We may process your personal data where it is necessary for our legitimate interests in a way that might be expected as part of running the Love & Ring site(s) and in a way which does not materially impact your rights and freedoms.",
      "For internal administrative purposes related to our services, for example our accounting and records.",
      "To enable you to register for an account on our sites.",
      "To enable you to share our content with others using social media or email.",
      "When we moderate comments under our community standards and participation guidelines.",
      "To troubleshoot technical issues on our sites and their functionalities.",
      "When we de-identify or anonymise personal data, or aggregate it so that it can no longer identify you.",
      "For security and fraud prevention, and to ensure that our sites are safe and secure and used in line with our terms of use.",
      "To contact you directly via social media or email if you send us emails or engage with the Love & Ring Ltd.",
      "Service communications: We may send service emails, push notifications or SMS regarding payment failure, T&C changes including price changes.",
      "Newsletters: You can manage your subscription in the “Emails and marketing” tab of your Love & Ring account and unsubscribe at any time.",
    ],
  },
  {
    title: "7. Changes to the Privacy Policy.",
    paragraph: `Original Version 1.0 22 Feb 2026

MM Love & Ring Ltd.`,
    items: [],
  },
];

const cookieSections = [
  {
    title: "1. What is a cookie?",
    paragraph: `A cookie is a small file that contains letters and numbers that is downloaded to your device when you visit a website. It is sent to your browser and stored on your computer’s hard drive, tablet or mobile device. When you visit our site(s) it can allow us to recognise and remember you.

Technologies similar to cookies

Technologies that store or access information on a user’s device are similar to cookies and are also covered by this policy. These technologies may include:`,
    items: [
      "Device fingerprinting – using a set of information without relying on cookies in order to identify a particular device. For this purpose where you are resident in Australia, our partner Ipsos Iris may collect your IP address, monitor settings, type of browser and operating system to create a unique serial number which constitutes a digital “fingerprint”.",
      "Local storage – storage of data in the local device’s cache, for example to load content quicker.",
      "Pixels – a small pixel graphic which is used to track user behaviour, site conversions etc.",
      "Scripts – small computer programs embedded within websites that give them extra functionality but may access user devices.",
      "In this policy we call all cookies and similar technologies “cookies”, for ease.",
    ],
  },

  {
    title: "2. First-party and third-party cookies",
    paragraph: `There are different types of cookies:`,
    items: [
      "First-party cookies – cookies that are set by or on behalf of the Love & Ring Ltd. when you use our site.",
      "Third-party cookies – cookies that are set by parties or organisations other than the Love & Ring Ltd. when you use our site. Some Love & Ring Ltd. web pages may also contain content from or link to other sites which may set their own cookies. If you share a link to a Love & Ring Ltd. page, the service you share it on may set a cookie on your browser.",
    ],
  },

  {
    title: "3. How do we use cookies?",
    paragraph: `We use cookies in a range of ways to improve your experience on our sites, including:`,
    items: [
      "Keeping you signed in.",
      "Delivering content to you.",
      "Showing you journalism that is relevant to you.",
      "Providing a better reading experience for signed in customers and clients with a guest account, including tailored messaging, remembering your preferences across devices and showing you Love & Ring Ltd. products and services that are relevant to you.",
      "Understanding how you use our site, for instance, how long you stay on a page.",
      "Reminding you to complete online registration.",
      "Processing payments and refunds.",
      "Monitoring how users interact with pages on our site to identify and remedy technical issues.",
      "Working with partners to deliver relevant advertising to you.",
    ],
  },

  {
    title: "4. What types of cookies do we use?",
    paragraph: `We use four types of cookies:`,
    items: [
      "Strictly Necessary – These cookies are essential to provide you with services you have requested, which means they cannot be switched off.",
      "Performance – These cookies measure how often you visit our sites and how you use them to improve user experience.",
      "Functionality – These cookies recognise you and remember your preferences when you return to our site.",
      "Advertising – These cookies collect information about your visit to our site, including content viewed, links followed and information about your browser, device and IP address.",
    ],
  },

  {
    title: "5. How long do cookies last?",
    paragraph: "",
    items: [
      "Session cookies – These cookies only last as long as your online session and expire when you close your browser.",
      "Persistent cookies – These cookies stay on your device after your browser has been closed and last for a time specified in the cookie (not longer than 13 months).",
    ],
  },

  {
    title: "6. How do we use cookies for advertising?",
    paragraph: `If you accept cookies, as you browse our site, we will place cookies on your device. Some cookies are for advertising so we can understand what pages you read and display relevant advertising.

Our apps integrate third-party software for online advertising and analytics. We sometimes use information such as your IP address, browser type and identifiers generated by third parties for advertising purposes and may share these with others.

We also allow other organisations to use cookies and similar technologies to analyse site usage and display advertising.`,
    items: [],
  },

  {
    title: "7. How do third parties use cookies for advertising?",
    paragraph: `With your consent we share and receive online data collected through cookies with advertising partners. This may result in advertising shown based on your browsing patterns.

Online retargeting allows us and our partners to show advertising based on interactions with other sites.

We require all contractual partners to treat your personal data with a similar level of respect that we provide.

Social Media – We use cookies and identifiers generated by third parties for marketing purposes when reaching clients through social media.`,
    items: [],
  },

  {
    title: "8. How can you control advertising cookies?",
    paragraph: `You can manage the use of cookies through the “Privacy settings” link in the footer of every page on our site.

California or US residents may opt out via the “California resident – Do not sell” link or the “Do Not Sell My Personal Information” button.

Australian residents may opt out through the “Privacy settings” link.`,
    items: [],
  },

  {
    title: "9. How to manage cookies at the Love & Ring Ltd.?",
    paragraph: `You can control cookies via the “Privacy settings” link.

You can also adjust your browser settings to block cookies. However, some features may not work properly if cookies are disabled.

Helpful browser links include:`,
    items: [
      "Cookie settings in Microsoft Edge.",
      "Cookie settings in Firefox.",
      "Cookie settings in Chrome.",
      "Cookie settings in Safari web and iOS.",
    ],
  },

  {
    title: "10. Useful links",
    paragraph: "",
    items: [
      "All About Cookies.",
      "The Information Commissioner’s Office of the relevant country.",
      "For more information about how we use personal data, please read our privacy policy.",
    ],
  },

  {
    title: "11. Changes to this cookie policy",
    paragraph: `Original Version 1.0 22 Feb 2026

MM Love & Ring Ltd.`,
    items: [],
  },
];

const PrivacyDetails = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [policyType, setPolicyType] = useState("privacy");

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

  return (
    <div className="min-h-screen">
      {/* Hero Section - identical to Home */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        {/* Background Image Carousel */}
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

        {/* Dark Gradient Overlay - same as Home */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Floating Brand Logo - same as Home */}
        <FloatingBrandLogo />

        {/* Hero Content */}
        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Privacy Policy &{" "}
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Data Usage
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Learn how we collect, use, and protect your information.
            </p>
            <Button
              onClick={() =>
                setPolicyType(policyType === "privacy" ? "cookie" : "privacy")
              }
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg"
            >
              {policyType === "privacy" ? "Cookie Policy" : "Privacy Policy"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <motion.div
        key={policyType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto px-4 py-12 md:py-16 space-y-12"
        style={{ maxWidth: "1200px" }}
      >
        <motion.div>
          {policyType === "privacy" ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {" "}
                  Our Commitment to Your Privacy
                </h1>
                <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                  This is the privacy policy established for Love & Ring Ltd.
                  (collectively referred to as “Love and Ring”, “The Company”,
                  “we”, “us” or “our” in this policy), our sites such as
                  www.loveandring.com and our associated apps (“our sites”).
                  <br />
                  <br />
                  This policy also incorporates core principles of specific data
                  privacy rights granted to individuals (as referred as
                  customers / clients) who lives in countries such as India, GCC
                  nations, EU countries Americas, Australia and Canada. It is
                  imperative for a customer who uses our service to understand
                  that establishment and practice of a single applicable global
                  data privacy policy is not always practical. Therefore, we, at
                  Love & Ring Ltd, is applying key principles of data protection
                  linked to an individual that broadly covering the core
                  principles of maintaining privacy of our customers. You will
                  find below information on how we collect, use, share, transfer
                  and apply your personal data. This privacy policy also
                  explains your data privacy rights.
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {" "}
                  Who We Are
                </h1>
                <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                  Love & Ring ltd. (Thekkumattathil House, Marika P O,
                  Koothattukulam, Ernakulam, 686662, KERALA, INIDIA) is a
                  company incorporated in India with intended service reach to
                  multiple regions and countries across EU, Latin America,
                  Australia and GCC nations. We base everything on our values:
                  honesty, cleanness (integrity), fairness, a sense of duty to
                  the customer / Clients. Everything that we do – including our
                  service approach to Clients and how we use their personal
                  data. We are strongly committed to keeping your personal data
                  safe. This commitment exists throughout the lifecycle of your
                  personal data, from the design of any of our services which
                  uses personal data to the deletion of that data. Love & Ring
                  owns a digital platform (www.loveandring.com) through which we
                  deliver ‘Matrimony Services’ to our clients. As part of client
                  registration and onward service engagement, we will collect
                  client’s personal data that will be essential to facilitate
                  and aid our service delivery.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-12"
              >
                {sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
                      {section.paragraph}
                    </p>
                    <ul className="space-y-2.5 text-foreground/70 text-[15px] leading-[1.7]">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Contact Section */}
                {/* <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              8. Contact Us
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions, concerns, or requests regarding your
              privacy or personal data, please contact us using the information
              below.
            </p>
            <div className="space-y-1.5 text-[15px]">
              <p>
                <a
                  href="mailto:privacy@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  privacy@yourdomain.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div> */}
              </motion.div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Cookie Policy
                </h1>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Introduction
                </h2>
                <p className="text-[15px] text-foreground/80 leading-[1.7] text-justify">
                  This is the cookie policy for Love & Ring Company PVT. Ltd.
                  (collectively referred to as “The Company”, “Love & Ring
                  Company PVT. Ltd.”, “we”, “us” or “our” in this policy), our
                  site the www.loveandring.com , and our associated apps (“our
                  sites”). Some of our other sites and services may have their
                  own cookie policies, which will be relevant to you when you
                  are using those sites and services.
                </p>
              </div>
              <br />
              <br />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-12"
              >
                {cookieSections.map((section) => (
                  <div key={section.title}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
                      {section.paragraph}
                    </p>
                    <ul className="space-y-2.5 text-foreground/70 text-[15px] leading-[1.7]">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Contact Section */}
                {/* <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              8. Contact Us
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions, concerns, or requests regarding your
              privacy or personal data, please contact us using the information
              below.
            </p>
            <div className="space-y-1.5 text-[15px]">
              <p>
                <a
                  href="mailto:privacy@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  privacy@yourdomain.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div> */}
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyDetails;
