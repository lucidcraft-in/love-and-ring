import DynamicStaticPage from "./DynamicStaticPage";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { id: "about", label: "About Love & Ring Matrimony" },
  { id: "registration", label: "Registration & Account" },
  { id: "verification", label: "Profile Verification" },
  { id: "finding-match", label: "Finding Your Match" },
  { id: "interests", label: "Interests & Connections" },
  { id: "communication", label: "Communication" },
  { id: "privacy-safety", label: "Privacy & Safety" },
  { id: "photographs", label: "Photographs" },
  { id: "membership", label: "Membership & Premium" },
  { id: "payments", label: "Payments & Subscriptions" },
  { id: "marriage-relationship", label: "Marriage & Relationship" },
  { id: "family-profiles", label: "Family & Matrimonial Profiles" },
  { id: "profile-quality", label: "Profile Quality" },
  { id: "reporting", label: "Reporting & Complaints" },
  { id: "account-security", label: "Account Security" },
  { id: "success", label: "Success on Love & Ring" },
  { id: "after-finding-partner", label: "After Finding Your Partner" },
  { id: "technical-support", label: "Technical Support" },
  { id: "safety-reminder", label: "Important Safety Reminders" },
];

const faqData: Record<string, { question: string; answer: string }[]> = {
  about: [
    {
      question: "1. What is Love & Ring?",
      answer:
        "Love & Ring is a Matrimonial Digital Platform where our matchmaking database is designed to help individuals and families in finding compatible marriage partners based on their individual preferences, values, interests, relationship goals and social alignment.",
    },
    {
      question: "2. How does Love & Ring work?",
      answer:
        "By registering and creating a profile of you at Love & Ring Matrimonial Digital Platform, you will open access to a diverse collection of individuals searching for a suitable partner. The platform will then generate matching profiles that may suit you and will allow you to express interest and connect with people who are also in search of finding a life partner. Once mutual interests and consent are in place the platform allows secure and seamless communication between interested parties.",
    },
    {
      question: "3. Who can create a profile on Love & Ring?",
      answer:
        "Eligible individuals looking for marriage can create a profile. Profiles may also be created or managed by parents, legal guardians, siblings, or other family members where a consent is in place.",
    },
    {
      question: "4. Is Love & Ring a dating website?",
      answer:
        "No. Love & Ring is primarily focused on matchmaking with an objective intention towards Marriage (Hence it is called a ‘Matrimony’ Digital Platform).",
    },
    {
      question: "5. Is Love & Ring free?",
      answer:
        "Initial registration is free. Specific digital features and premium provisions will require paid membership. The membership features and pricing schemes applicable are displayed on the Love & Ring website.",
    },
  ],
  registration: [
    {
      question: "6. How do I create a matrimonial profile?",
      answer:
        "Click the registration or sign-up option and complete requested information about you, your partner preferences, social norms that you want to engage with and any additional information that you may prefer to disclose or discuss.",
    },
    {
      question: "7. Can my parents create a profile for me?",
      answer:
        "Yes, where the platform permits family-managed profiles. Parents or family members can assist in creating or managing a matrimonial profile. However, it is important that a consent is in place.",
    },
    {
      question: "8. Can I create a profile for someone else?",
      answer:
        "Profiles should only be created with the person's knowledge and consent. Do not create misleading or unauthorized or unsolicited profiles.",
    },
    {
      question: "9. Can I create more than one profile?",
      answer:
        "You should maintain only one genuine matrimonial profile unless Love & Ring specifically permits otherwise.",
    },
    {
      question: "10. What information should I provide in my profile?",
      answer:
        "You may be asked to provide information such as: Name, Age, Gender, Location, Education, Profession, Family information, Lifestyle preferences, Interests, About yourself, Partner preferences, Photographs, Contact preferences, and Other (Special needs, circumstances).",
    },
    {
      question: "11. Can I edit my profile after registration?",
      answer: "Yes. You can update eligible profile information through your account.",
    },
    {
      question: "12. Can I change my partner preferences?",
      answer:
        "Yes. You can update your preferred age range, location, education, profession, lifestyle, family preferences, and other available criteria.",
    },
    {
      question: "13. Can I hide my profile?",
      answer:
        "If profile privacy controls are available, you can use them to limit who can discover or view your profile.",
    },
    {
      question: "14. Can I temporarily deactivate my profile?",
      answer:
        "If temporary deactivation is supported, you can deactivate your profile without necessarily deleting your account.",
    },
    {
      question: "15. How do I delete my account?",
      answer:
        "Use the account deletion option available in your profile settings or contact Love & Ring support for assistance.",
    },
  ],
  verification: [
    {
      question: "16. Why should I verify my profile?",
      answer:
        "Verification and profile validation can build trust and provide other members with greater confidence in engaging with a profile.",
    },
    {
      question: "17. Is profile verification mandatory?",
      answer:
        "Verification requirements may vary depending on the account type, feature, or current Love & Ring policies.",
    },
    {
      question: "18. What information may be required for verification?",
      answer:
        "Depending on the verification process, you may be asked to provide information or documents necessary to establish your identity.",
    },
    {
      question: "19. Will my verification documents be visible to other members?",
      answer:
        "Sensitive verification information should not be publicly displayed. Any information collected for verification is handled according to the platform's privacy practices.",
    },
    {
      question: "20. Can I report a fake profile?",
      answer:
        "Yes. If you believe a profile is fake, misleading, impersonating someone, or violating the platform's rules, report it to Love & Ring.",
    },
    {
      question: "21. What happens after I report a profile?",
      answer:
        "The profile may be reviewed by the Love & Ring team. Appropriate action may be taken if the profile violates the platform's policies.",
    },
    {
      question: "22. How can I identify a suspicious matrimonial profile?",
      answer:
        "Be cautious if someone: Refuses reasonable verification, Provides inconsistent information, Quickly asks for money, Requests financial assistance, Pressures you to move the conversation elsewhere, Makes unrealistic promises, Avoids video calls or reasonable identity confirmation, or Uses suspicious photographs or information.",
    },
  ],
  "finding-match": [
    {
      question: "23. How can I find suitable matches?",
      answer:
        "Use the available search and preference filters to discover profiles that match your requirements.",
    },
    {
      question: "24. What can I use to filter profiles?",
      answer:
        "Depending on the available features, you may be able to filter by: Age, Gender, Location, Education, Profession, Marital status, Lifestyle, Community or cultural preferences, Family background, and Other partner preferences.",
    },
    {
      question: "25. How are matches recommended to me?",
      answer:
        "Match recommendations may be based on the information in your profile and the partner preferences you provide.",
    },
    {
      question: "26. Why am I seeing profiles that don't match all my preferences?",
      answer:
        "Matchmaking systems may display profiles that are close to your selected criteria. Preferences are not always absolute, and broader recommendations can help you discover potentially compatible people.",
    },
    {
      question: "27. Can I search for someone by name?",
      answer:
        "Search functionality depends on the features currently available on Love & Ring.",
    },
    {
      question: "28. Can I search by location?",
      answer:
        "If location-based search is available, you can use it to discover profiles in your preferred city, district, state, or other supported location.",
    },
    {
      question: "29. Can I search for matches outside my city?",
      answer:
        "Yes, if the search and location features allow it. You can broaden your preferred location to discover potential matches elsewhere.",
    },
    {
      question: "30. Can I change my search preferences later?",
      answer: "Yes. Your preferences can generally be updated as your requirements change.",
    },
  ],
  interests: [
    {
      question: "31. How do I show interest in someone?",
      answer: "Use the available interest, like, connect, or similar feature on the person's profile.",
    },
    {
      question: "32. What happens when I send interest?",
      answer:
        "The recipient may receive a notification that you are interested, depending on their account and notification settings.",
    },
    {
      question: "33. Can I withdraw an interest?",
      answer:
        "If the platform supports withdrawing interests, you can do so through the relevant account feature.",
    },
    {
      question: "34. What happens if someone accepts my interest?",
      answer:
        "Depending on the available features and membership plan, you may be able to communicate with the person or access additional contact features.",
    },
    {
      question: "35. Can I reject a profile?",
      answer:
        "Yes, where the relevant feature is available. You can simply choose not to express interest in a profile.",
    },
    {
      question: "36. Can I save profiles for later?",
      answer:
        "If a favourites, shortlist, or saved-profile feature is available, you can use it to keep track of profiles you are interested in.",
    },
    {
      question: "37. Can someone see that I viewed their profile?",
      answer:
        "This depends on the profile-view features and privacy settings available on Love & Ring.",
    },
  ],
  communication: [
    {
      question: "38. Can I chat with my matches?",
      answer:
        "Communication features depend on your account and the membership plan available to you.",
    },
    {
      question: "39. Can I send a message before someone accepts my interest?",
      answer:
        "This depends on the communication rules and membership features currently available.",
    },
    {
      question: "40. Can I share my phone number?",
      answer:
        "You should share personal contact information only when you feel comfortable and after establishing reasonable trust.",
    },
    {
      question: "41. Can I share my WhatsApp number?",
      answer:
        "You may choose to share contact information once you are comfortable, but avoid sharing sensitive personal information too early.",
    },
    {
      question: "42. Can I communicate with a match outside Love & Ring?",
      answer:
        "You can decide how and when to communicate outside the platform. For your safety, it is recommended to establish trust before moving conversations to another platform.",
    },
    {
      question: "43. What should I do if someone sends inappropriate messages?",
      answer: "Stop communicating with the person and use the available block and report functions.",
    },
    {
      question: "44. Can I block another member?",
      answer:
        "If blocking is available, you can block a member to prevent further unwanted interaction.",
    },
    {
      question: "45. Can a blocked member contact me again?",
      answer:
        "A blocked member should not be able to interact with you through the relevant blocked communication features.",
    },
  ],
  "privacy-safety": [
    {
      question: "46. Is my information private?",
      answer:
        "Love & Ring takes user privacy seriously. Information is handled according to the platform's privacy policy and applicable terms.",
    },
    {
      question: "47. Will my phone number be visible to everyone?",
      answer:
        "Personal contact information should only be visible according to the privacy settings and communication features of the platform.",
    },
    {
      question: "48. Can I hide my contact information?",
      answer:
        "Where privacy controls are available, you can control what information is visible to other members.",
    },
    {
      question: "49. Should I share my financial information with a match?",
      answer:
        "Never share your banking passwords, OTPs, PINs, card details, or other sensitive financial credentials with a matrimonial match.",
    },
    {
      question: "50. What if someone asks me for money?",
      answer:
        "Be extremely cautious. Never send money to someone you have met through a matrimonial platform simply because they claim to need financial help.",
    },
    {
      question: "51. What if someone asks for an OTP?",
      answer:
        "Never share an OTP with another person. Love & Ring or legitimate payment services should not require you to disclose your OTP to another member.",
    },
    {
      question: "52. What should I do if I suspect a matrimonial scam?",
      answer:
        "Stop communication, do not send money or sensitive information, preserve relevant messages or evidence, and report the profile to Love & Ring.",
    },
    {
      question: "53. Can I report harassment?",
      answer:
        "Yes. Report any member who engages in harassment, threats, abusive behaviour, inappropriate communication, impersonation, or other violations.",
    },
    {
      question: "54. What should I do if someone is impersonating me?",
      answer:
        "Report the profile immediately and provide any information requested by the Love & Ring support team to help establish that the profile is impersonating you.",
    },
  ],
  photographs: [
    {
      question: "55. How many photographs can I upload?",
      answer: "The number of photographs you can upload depends on the current profile features.",
    },
    {
      question: "56. What type of photograph should I use?",
      answer:
        "Use a recent, clear photograph that accurately represents you. Avoid misleading, heavily edited, or third-party photographs.",
    },
    {
      question: "57. Can I hide my photographs?",
      answer:
        "If photo privacy controls are available, you can restrict who can view your photographs.",
    },
    {
      question: "58. Can I control who sees my profile photo?",
      answer: "This depends on the privacy features available with your account.",
    },
    {
      question: "59. Why was my photograph rejected?",
      answer:
        "A photograph may be rejected if it does not meet the platform's guidelines, is misleading, inappropriate, unclear, or violates another person's rights.",
    },
  ],
  membership: [
    {
      question: "60. What is a premium membership?",
      answer:
        "A premium membership may provide access to additional matchmaking, communication, visibility, or contact features beyond the free account.",
    },
    {
      question: "61. What features are included in premium membership?",
      answer:
        "The exact features depend on the membership plan. Please refer to the current membership/pricing page for the latest details.",
    },
    {
      question: "62. How long is a membership valid?",
      answer: "Membership validity depends on the plan selected at purchase.",
    },
    {
      question: "63. Can I upgrade my membership?",
      answer:
        "If multiple membership plans are available, you may be able to upgrade through your account.",
    },
    {
      question: "64. Can I downgrade my membership?",
      answer: "Membership changes depend on the available plans and subscription terms.",
    },
    {
      question: "65. Does premium membership guarantee a marriage?",
      answer:
        "No. Membership provides access to matchmaking features and opportunities to connect with potential partners. Love & Ring cannot guarantee that you will find a partner or get married through the platform.",
    },
    {
      question: "66. Does Love & Ring guarantee a particular number of matches?",
      answer:
        "No. The number and quality of matches depend on your preferences, profile information, location, activity, and the available member base.",
    },
    {
      question: "67. Does paying for membership guarantee contact with another member?",
      answer: "No. Other members decide whether they wish to interact or communicate with you.",
    },
  ],
  payments: [
    {
      question: "68. What payment methods are accepted?",
      answer: "Available payment methods are displayed during the membership purchase process.",
    },
    {
      question: "69. Is online payment secure?",
      answer:
        "Payments are processed using the payment methods available on the website. Never share your OTP, PIN, CVV, or banking credentials with another member.",
    },
    {
      question: "70. Will I receive confirmation after payment?",
      answer:
        "A payment or membership confirmation should be provided according to the website's payment system.",
    },
    {
      question: "71. What should I do if payment was deducted but my membership wasn't activated?",
      answer:
        "Do not make another payment immediately. Check your account and payment confirmation first, then contact Love & Ring support with the transaction details.",
    },
    {
      question: "72. Can I get a refund for my membership?",
      answer:
        "Refund eligibility depends on the applicable refund and membership terms. Please review the refund policy before purchasing.",
    },
    {
      question: "73. Can I cancel my membership?",
      answer: "Cancellation options depend on the membership plan and applicable terms.",
    },
    {
      question: "74. Does my membership automatically renew?",
      answer:
        "Automatic renewal depends on the specific membership/subscription plan and the terms shown at the time of purchase.",
    },
  ],
  "marriage-relationship": [
    {
      question: "75. Is Love & Ring only for people who have never been married?",
      answer:
        "Eligibility depends on the profile categories supported by the platform. If divorced, widowed, or previously married members are supported, their marital status should be accurately disclosed.",
    },
    {
      question: "76. Can divorced people create profiles?",
      answer:
        "Yes, if the platform supports divorced matrimonial profiles. Members should provide accurate marital-status information.",
    },
    {
      question: "77. Can widows or widowers create profiles?",
      answer: "Yes, where supported. Accurate marital-status information should be provided.",
    },
    {
      question: "78. Can single parents create matrimonial profiles?",
      answer:
        "Yes, where supported. Family and children information should be represented honestly.",
    },
    {
      question: "79. Can I specify that I am looking for a serious marriage?",
      answer:
        "Yes. Your profile and partner preferences should clearly communicate your intention to find a suitable life partner.",
    },
    {
      question: "80. Can I specify my preferred age range?",
      answer: "Yes, where age preference filters are available.",
    },
    {
      question: "81. Can I specify my preferred location?",
      answer:
        "Yes. Location preferences can help you discover matches from areas that are suitable for you.",
    },
    {
      question: "82. Can I specify education or profession preferences?",
      answer: "Yes, where these filters are available.",
    },
    {
      question: "83. Can I specify lifestyle preferences?",
      answer:
        "Where supported, you can provide relevant lifestyle preferences to improve compatibility.",
    },
    {
      question: "84. Can I specify family preferences?",
      answer:
        "If family-related preferences are supported, you can include them in your profile or partner preferences.",
    },
  ],
  "family-profiles": [
    {
      question: "85. Can parents manage their child's matrimonial profile?",
      answer:
        "Where family-managed profiles are supported, parents can assist with profile management while ensuring that the profile accurately represents the person seeking marriage.",
    },
    {
      question: "86. Can parents contact another family?",
      answer: "This depends on the communication features available to the account.",
    },
    {
      question: "87. Can family members communicate with another family?",
      answer:
        "Where permitted, families may participate in the matchmaking process, but all parties should respect the privacy and consent of the individuals involved.",
    },
    {
      question: "88. Should the person featured in the profile know about the account?",
      answer:
        "Yes. Matrimonial profiles should be genuine and created or managed with the knowledge and consent of the person represented.",
    },
  ],
  "profile-quality": [
    {
      question: "89. How can I make my profile more attractive?",
      answer:
        "Create a complete, honest, and positive profile. Use clear recent photographs, describe yourself naturally, and provide meaningful information about your interests, values, lifestyle, and expectations.",
    },
    {
      question: "90. Why am I not receiving interests?",
      answer:
        "This can happen for many reasons, including incomplete profile information, limited preferences, location, age criteria, profile visibility, or the number of compatible members currently available.",
    },
    {
      question: "91. How can I get more relevant matches?",
      answer:
        "Keep your profile complete and accurate, use clear photographs, and avoid making your partner preferences unnecessarily restrictive.",
    },
    {
      question: "92. Should I provide accurate information?",
      answer:
        "Absolutely. Providing accurate information is essential for building trust and finding genuinely compatible matches.",
    },
    {
      question: "93. Can I hide information from my profile?",
      answer:
        "Use the available privacy controls. However, information that is required for an accurate matrimonial profile should not be falsified.",
    },
    {
      question: "94. Can I change my marital status later?",
      answer:
        "Yes, if your circumstances change. Your profile should always reflect your current and accurate status.",
    },
  ],
  reporting: [
    {
      question: "95. How do I report a fake profile?",
      answer:
        "Open the relevant profile and use the available report option, or contact Love & Ring support.",
    },
    {
      question: "96. How do I report inappropriate content?",
      answer:
        "Use the report function associated with the profile/content or contact customer support.",
    },
    {
      question: "97. What should I do if someone is harassing me?",
      answer: "Block the member where possible and report the behaviour to Love & Ring.",
    },
    {
      question: "98. What if someone is asking for money?",
      answer: "Do not send money. End the conversation, preserve evidence, and report the profile.",
    },
    {
      question: "99. Can I report someone after communicating with them outside Love & Ring?",
      answer: "Yes. Provide as much relevant information as possible when submitting your report.",
    },
    {
      question: "100. Will the person know who reported them?",
      answer:
        "Reporting procedures and confidentiality depend on Love & Ring's internal policies. Reports may be handled confidentially where appropriate.",
    },
  ],
  "account-security": [
    {
      question: "101. How do I protect my Love & Ring account?",
      answer:
        "Use a strong, unique password and never share your login credentials with anyone.",
    },
    {
      question: "102. What should I do if I think someone accessed my account?",
      answer:
        "Change your password immediately and contact Love & Ring support if you suspect unauthorised access.",
    },
    {
      question: "103. Should I share my Love & Ring password with my family?",
      answer:
        "For security reasons, avoid sharing your password. If family members need to manage a matrimonial profile, use the platform's permitted family-management features where available.",
    },
    {
      question: "104. Will Love & Ring ask for my password or OTP?",
      answer:
        "You should never disclose your password, OTP, PIN, CVV, or other authentication credentials to another member.",
    },
  ],
  success: [
    {
      question: "105. How can I increase my chances of finding a suitable match?",
      answer:
        "Keep your profile complete, use recent photographs, clearly communicate your expectations, remain open to compatible profiles, and respond respectfully to genuine interests.",
    },
    {
      question: "106. Should I be honest about my expectations?",
      answer:
        "Yes. Clear expectations help reduce misunderstandings and improve the quality of potential matches.",
    },
    {
      question: "107. How quickly should I respond to an interest?",
      answer:
        "There is no required timeframe, but responding respectfully and promptly can help maintain meaningful conversations.",
    },
    {
      question: "108. Should I meet someone I met on Love & Ring?",
      answer:
        "If you decide to meet, take appropriate safety precautions. Consider having an initial video call, meet in a public place, tell someone you trust where you are going, and avoid sharing sensitive financial information.",
    },
    {
      question: "109. How long should I communicate before meeting someone?",
      answer:
        "There is no universal timeframe. Take enough time to establish reasonable trust and comfort before meeting.",
    },
    {
      question: "110. Can Love & Ring choose a partner for me?",
      answer:
        "Love & Ring provides matchmaking tools and potential matches, but the final decision about whom you communicate with and marry belongs to you.",
    },
    {
      question: "111. Does Love & Ring verify every member?",
      answer:
        "Verification processes may vary. Even when a profile is verified, members should independently exercise reasonable caution and judgement.",
    },
    {
      question: "112. Does Love & Ring guarantee that profiles are genuine?",
      answer:
        "The platform may use measures designed to improve profile authenticity, but users should still exercise caution and report suspicious behaviour.",
    },
    {
      question: "113. Does Love & Ring guarantee successful matchmaking?",
      answer:
        "No. Love & Ring facilitates matrimonial connections but cannot guarantee a relationship, engagement, or marriage.",
    },
  ],
  "after-finding-partner": [
    {
      question: "114. What should I do after finding a suitable partner?",
      answer:
        "Take time to get to know each other, communicate openly, involve families where appropriate, and make important relationship decisions at your own pace.",
    },
    {
      question: "115. Can I hide or deactivate my profile after finding someone?",
      answer:
        "Yes, if the relevant account controls are available. It is a good idea to deactivate or update your profile once you no longer wish to receive matrimonial interests.",
    },
    {
      question: "116. How do I let Love & Ring know that I found my partner?",
      answer:
        "If a success-story or profile-status feature is available, you may be able to update your status or contact support.",
    },
    {
      question: "117. Can I share my success story?",
      answer:
        "Yes, if Love & Ring offers a success-story submission feature. Any publication should be made with the consent of everyone featured.",
    },
  ],
  "technical-support": [
    {
      question: "118. The website is not working. What should I do?",
      answer:
        "Refresh the page, check your internet connection, try another browser, and ensure that your browser is updated. If the problem continues, contact support.",
    },
    {
      question: "119. I can't log in. What should I do?",
      answer:
        "Check your login credentials and use the password-reset option if necessary. Contact support if you still cannot access your account.",
    },
    {
      question: "120. I am not receiving notifications. What should I do?",
      answer:
        "Check your email's spam/junk folder, notification settings, and account preferences. If the issue continues, contact support.",
    },
    {
      question: "121. I cannot upload my photograph. What should I do?",
      answer:
        "Check the supported file format and size requirements, ensure that your internet connection is stable, and try again.",
    },
    {
      question: "122. How can I contact Love & Ring support?",
      answer:
        "Use the contact/support options available on the Love & Ring website. For account-related queries, include your registered email/phone number and relevant details so the support team can assist you efficiently.",
    },
  ],
  "safety-reminder": [
    {
      question: "123. Is it safe to send money to someone I meet through Love & Ring?",
      answer:
        "No. Never send money to a matrimonial match simply because they request financial assistance.",
    },
    {
      question: "124. Should I share my bank details with a match?",
      answer:
        "No. Never share your bank account password, OTP, ATM PIN, CVV, card details, UPI PIN, or other financial credentials.",
    },
    {
      question: "125. What if someone claims they need money for an emergency?",
      answer:
        "Treat such requests as a potential scam. Do not send money. Stop communication and report the profile.",
    },
    {
      question: "126. What if someone promises marriage in exchange for money?",
      answer: "Do not send money or valuables. Report the person immediately.",
    },
    {
      question: "127. What if someone asks me to invest in a business or cryptocurrency?",
      answer:
        "Do not transfer money or make investments based solely on a relationship established through the platform. Report suspicious behaviour.",
    },
    {
      question: "128. What if someone asks for intimate photographs?",
      answer:
        "Do not send photographs that you are uncomfortable sharing. If someone pressures, threatens, or blackmails you, stop communicating and report the account.",
    },
    {
      question: "129. What should I do before meeting a match in person?",
      answer:
        "Consider: Having a video call first, Meeting in a public location, Informing a trusted person, Sharing your location with someone you trust, Arranging your own transportation, Avoiding alcohol or situations that compromise your judgement, and Not sharing sensitive financial information.",
    },
    {
      question: "130. What is the most important rule when using Love & Ring?",
      answer:
        "Take your time. Be honest. Protect your personal information. Never send money to someone you have only met online, and report suspicious behaviour.",
    },
  ],
};

const FallbackFAQContent = () => {
  const [activeCategory, setActiveCategory] = useState("about");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Dropdown Category Select */}
        <div className="lg:hidden">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-background max-h-72">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Sidebar Category List */}
        <motion.aside className="hidden lg:block lg:w-72 shrink-0">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto pr-2 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 px-2">Categories</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-white font-medium shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.aside>

        {/* Accordion List for Selected Category */}
        <div className="flex-1 bg-card rounded-2xl shadow-sm border p-6">
          <h3 className="text-2xl font-bold mb-6">
            {categories.find((c) => c.id === activeCategory)?.label}
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {(faqData[activeCategory] || faqData["about"]).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <DynamicStaticPage
      forcedSlug="faq"
      fallbackTitle="Frequently Asked Questions"
      fallbackContent={<FallbackFAQContent />}
    />
  );
}