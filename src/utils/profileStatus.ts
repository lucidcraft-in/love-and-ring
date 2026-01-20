// Profile completion status utilities
// A user is COMPLETED only if ALL required fields are filled

export interface UserProfile {
  email: string;
  name: string;
  // Profile fields
  accountFor?: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
  heightCm?: string;
  weightKg?: string;
  maritalStatus?: string;
  physicallyChallenged?: string;
  course?: string;
  income?: string;
  interests?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  // Registration mapping fields (from RegistrationData)
  dob?: string;
  language?: string;
  height?: string;
  weight?: string;
  education?: string;
  profession?: string;
  traits?: string[];
  diets?: string[];
}

export type ProfileStatus = "BASIC" | "COMPLETED";

// Required fields for profile completion
const REQUIRED_FIELDS: (keyof UserProfile)[] = [
  "accountFor",
  "fullName",
  "gender",
];

// Fields that map from registration to profile
const PROFILE_FIELD_MAPPINGS: Record<string, keyof UserProfile> = {
  dob: "dateOfBirth",
  language: "preferredLanguage",
  height: "heightCm",
  weight: "weightKg",
  education: "course",
  traits: "personalityTraits",
  diets: "dietPreference",
};

// Check if a field value is considered "filled"
const isFieldFilled = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Get the effective value of a field (considering mappings)
const getFieldValue = (profile: UserProfile, field: keyof UserProfile): unknown => {
  // Direct field
  if (profile[field] !== undefined) return profile[field];
  
  // Check mapped fields
  for (const [regField, profileField] of Object.entries(PROFILE_FIELD_MAPPINGS)) {
    if (profileField === field && profile[regField as keyof UserProfile] !== undefined) {
      return profile[regField as keyof UserProfile];
    }
  }
  
  return undefined;
};

// Determine profile status based on filled fields
export const getProfileStatus = (profile: UserProfile | null): ProfileStatus => {
  if (!profile) return "BASIC";
  
  // Check all required fields
  const allFieldsFilled = REQUIRED_FIELDS.every((field) => {
    const value = getFieldValue(profile, field);
    return isFieldFilled(value);
  });
  
  // Additional check for array fields
  const interestsField = profile.interests;
  const traitsField = profile.personalityTraits || profile.traits;
  const dietField = profile.dietPreference || profile.diets;
  
  const arrayFieldsFilled = 
    isFieldFilled(interestsField) &&
    isFieldFilled(traitsField) &&
    isFieldFilled(dietField);
  
  // Check date of birth
  const dobFilled = isFieldFilled(profile.dateOfBirth || profile.dob);
  
  // Check height/weight
  const heightFilled = isFieldFilled(profile.heightCm || profile.height);
  const weightFilled = isFieldFilled(profile.weightKg || profile.weight);
  
  // Check marital status
  const maritalFilled = isFieldFilled(profile.maritalStatus);
  
  // Check education/profession
  const educationFilled = isFieldFilled(profile.course || profile.education);
  
  if (allFieldsFilled && arrayFieldsFilled && dobFilled && heightFilled && weightFilled && maritalFilled && educationFilled) {
    return "COMPLETED";
  }
  
  return "BASIC";
};

// Step requirements mapping for registration flow
interface StepRequirement {
  step: number;
  fields: (keyof UserProfile)[];
}

const STEP_REQUIREMENTS: StepRequirement[] = [
  { step: 1, fields: ["accountFor", "fullName", "gender"] },
  { step: 2, fields: [] }, // Religion, caste, motherTongue - treating as optional for now
  { step: 3, fields: ["maritalStatus"] },
  { step: 4, fields: [] }, // Education - treating as optional for base completion
  { step: 5, fields: ["interests", "traits", "diets"] },
];

// Get the first incomplete step for a user
export const getNextIncompleteStep = (profile: UserProfile | null): number => {
  if (!profile) return 2; // Start from step 2 (after email/password verification)
  
  // Step 1 is always done if user exists (email verified + password created)
  
  // Check step by step
  for (const { step, fields } of STEP_REQUIREMENTS) {
    if (step === 1) continue; // Skip step 1, already done
    
    const stepComplete = fields.every((field) => {
      const value = getFieldValue(profile, field);
      return isFieldFilled(value);
    });
    
    if (!stepComplete && fields.length > 0) {
      return step;
    }
  }
  
  // Check array fields specifically for step 5
  const interestsFilled = isFieldFilled(profile.interests);
  const traitsFilled = isFieldFilled(profile.personalityTraits || profile.traits);
  const dietFilled = isFieldFilled(profile.dietPreference || profile.diets);
  
  if (!interestsFilled || !traitsFilled || !dietFilled) {
    return 5;
  }
  
  // All steps complete
  return 0; // 0 means all complete
};
