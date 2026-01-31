/**
 * Validation constants for form fields
 */

// Field max lengths
export const MAX_LENGTH = {
  EMAIL: 254, // RFC 5321 standard
  NAME: 100,
  ROLE: 50,
} as const;

// User role options
export const USER_ROLES = ["user", "admin", "super-admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

