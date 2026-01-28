// Profile completion status utilities
// A user is COMPLETED only if ALL required fields are filled

export interface UserProfile {
  _id: string;
  email: string;

  // Step 1
  accountFor?: string;
  fullName?: string;
  gender?: string;

  // Step 2 / 3
  dateOfBirth?: string;
  preferredLanguage?: string;
  maritalStatus?: string;
  physicallyChallenged?: boolean;

  // Step 3
  heightCm?: number;
  weightKg?: number;

  // Step 4
  course?: string;
  profession?: string;
  income?: number;

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
  if (profile[field] !== undefined) return profile[field];

  for (const [regField, profileField] of Object.entries(
    PROFILE_FIELD_MAPPINGS
  )) {
    if (
      profileField === field &&
      profile[regField as keyof UserProfile] !== undefined
    ) {
      return profile[regField as keyof UserProfile];
    }
  }
  return undefined;
};

/* ---------------- PROFILE STATUS ---------------- */

export const getProfileStatus = (
  profile: UserProfile | null
): ProfileStatus => {
  if (!profile) return "BASIC";

  const basicFilled = REQUIRED_FIELDS.every((field) =>
    isFieldFilled(getFieldValue(profile, field))
  );

  const arraysFilled =
    isFieldFilled(profile.interests) &&
    isFieldFilled(profile.personalityTraits || profile.traits) &&
    isFieldFilled(profile.dietPreference || profile.diets);

  const dobFilled = isFieldFilled(profile.dateOfBirth || profile.dob);
  const heightFilled = isFieldFilled(profile.heightCm || profile.height);
  const weightFilled = isFieldFilled(profile.weightKg || profile.weight);
  const maritalFilled = isFieldFilled(profile.maritalStatus);
  const educationFilled = isFieldFilled(profile.course || profile.education);

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
  { step: 2, fields: [] },
  { step: 3, fields: ["maritalStatus"] },
  { step: 4, fields: [] },
  { step: 5, fields: ["interests", "traits", "diets"] },
];

export const getNextIncompleteStep = (
  profile: UserProfile | null
): number => {
  if (!profile) return 2;

  for (const { step, fields } of STEP_REQUIREMENTS) {
    if (step === 1) continue;

    const complete = fields.every((field) =>
      isFieldFilled(getFieldValue(profile, field))
    );

    if (!complete && fields.length > 0) return step;
  }

  if (
    !isFieldFilled(profile.interests) ||
    !isFieldFilled(profile.personalityTraits || profile.traits) ||
    !isFieldFilled(profile.dietPreference || profile.diets)
  ) {
    return 5;
  }

  return 0;
};
