// =====================================================
// DEVELOPER PHOTO PROTECTION
// Set to false ONLY during development/testing.
// MUST remain true in production.
// DO NOT expose this setting to normal users.
// =====================================================
export const PROFILE_PHOTO_PROTECTION_ENABLED = true;

// Warning for developers when protection is disabled
if (typeof window !== "undefined" && !PROFILE_PHOTO_PROTECTION_ENABLED) {
  const isDev = (import.meta.env && import.meta.env.DEV) || process.env.NODE_ENV !== "production";
  if (isDev) {
    console.warn(
      "⚠️ Love & Ring profile photo protection is DISABLED. Enable it before production."
    );
  }
}
