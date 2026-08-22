// Profile completion status utilities
// A user is COMPLETED only if ALL required fields are filled

export interface UserProfile {
  _id: string;
  email: string;

  // Step 1
  accountFor?: string;
  fullName?: string;
  gender?: string;
  mobile?: string;
  countryCode?: string;

  // Step 2
  religion?: any;
  caste?: any;
  motherTongue?: any;

  // Step 2 / 3
  dateOfBirth?: string;
  preferredLanguage?: string;
  maritalStatus?: string;
  physicallyChallenged?: boolean;
  bodyType?: string;
  city?: any;

  // Step 3
  heightCm?: number;
  weightKg?: number;

  // Step 4
  course?: string;
  primaryEducation?: any;
  highestEducation?: any;
  profession?: any;
  income?: any;

  // Step 5
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];

  /* ---- Registration alias fields (UI only) ---- */
  dob?: string;
  language?: string;
  height?: number;
  weight?: number;
  education?: string;
  traits?: string[];
  diets?: string[];
  profileStatus?: string;
}

export type ProfileStatus = "BASIC" | "COMPLETED";

/* ---------------- REQUIRED FIELDS ---------------- */

const REQUIRED_FIELDS: (keyof UserProfile)[] = [
  "accountFor",
  "fullName",
  "gender",
];

/* ---------------- FIELD MAPPINGS ---------------- */

const PROFILE_FIELD_MAPPINGS: Record<string, keyof UserProfile> = {
  dob: "dateOfBirth",
  language: "preferredLanguage",
  height: "heightCm",
  weight: "weightKg",
  education: "course",
  traits: "personalityTraits",
  diets: "dietPreference",
};

/* ---------------- HELPERS ---------------- */

const isFieldFilled = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const getFieldValue = (
  profile: UserProfile,
  field: keyof UserProfile
): unknown => {
  if (
    profile[field] !== undefined &&
    profile[field] !== null &&
    profile[field] !== ""
  ) {
    return profile[field];
  }

  // Check alias / mapped fields in both directions
  if (field === "traits" || field === "personalityTraits") {
    return profile.traits || profile.personalityTraits;
  }
  if (field === "diets" || field === "dietPreference") {
    return profile.diets || profile.dietPreference;
  }
  if (
    field === "education" ||
    field === "course" ||
    field === "primaryEducation" ||
    field === "highestEducation"
  ) {
    return (
      profile.primaryEducation ||
      profile.highestEducation ||
      profile.course ||
      profile.education
    );
  }
  if (field === "height" || field === "heightCm") {
    return profile.height || profile.heightCm;
  }
  if (field === "weight" || field === "weightKg") {
    return profile.weight || profile.weightKg;
  }
  if (field === "dob" || field === "dateOfBirth") {
    return profile.dob || profile.dateOfBirth;
  }
  if (field === "language" || field === "preferredLanguage") {
    return profile.language || profile.preferredLanguage;
  }

  return undefined;
};

/* ---------------- PROFILE STATUS ---------------- */

export const getProfileStatus = (
  profile: UserProfile | null
): ProfileStatus => {
  if (!profile) return "BASIC";
  if (profile.profileStatus === "COMPLETED") return "COMPLETED";

  const basicFilled = REQUIRED_FIELDS.every((field) =>
    isFieldFilled(getFieldValue(profile, field))
  );

  const arraysFilled =
    isFieldFilled(getFieldValue(profile, "interests")) &&
    isFieldFilled(getFieldValue(profile, "personalityTraits")) &&
    isFieldFilled(getFieldValue(profile, "dietPreference"));

  const dobFilled = isFieldFilled(getFieldValue(profile, "dateOfBirth"));
  const heightFilled = isFieldFilled(getFieldValue(profile, "heightCm"));
  const weightFilled = isFieldFilled(getFieldValue(profile, "weightKg"));
  const maritalFilled = isFieldFilled(getFieldValue(profile, "maritalStatus"));
  const educationFilled = isFieldFilled(
    getFieldValue(profile, "primaryEducation")
  );

  if (
    basicFilled &&
    arraysFilled &&
    dobFilled &&
    heightFilled &&
    weightFilled &&
    maritalFilled &&
    educationFilled
  ) {
    return "COMPLETED";
  }

  return "BASIC";
};

/* ---------------- NEXT INCOMPLETE STEP ---------------- */

interface StepRequirement {
  step: number;
  fields: (keyof UserProfile)[];
}

const STEP_REQUIREMENTS: StepRequirement[] = [
  { step: 1, fields: ["accountFor", "fullName", "gender"] },
  { step: 2, fields: ["religion", "caste", "motherTongue"] },
  { step: 3, fields: ["maritalStatus"] },
  { step: 4, fields: ["primaryEducation", "profession"] },
  { step: 5, fields: ["interests", "traits", "diets"] },
];

export const getNextIncompleteStep = (
  profile: UserProfile | null
): number => {
  if (!profile) return 1;
  if (profile.profileStatus === "COMPLETED") return 0;

  for (const { step, fields } of STEP_REQUIREMENTS) {
    const complete = fields.every((field) =>
      isFieldFilled(getFieldValue(profile, field))
    );

    if (!complete && fields.length > 0) return step;
  }

  return 0;
};
