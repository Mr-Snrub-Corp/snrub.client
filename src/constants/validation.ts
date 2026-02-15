/**
 * Validation constants for form fields
 */

// Field max lengths
export const MAX_LENGTH = {
  EMAIL: 254, // RFC 5321 standard
  NAME: 100,
  ROLE: 50,
  REPORT_DESCRIPTION: 1000,
} as const;
