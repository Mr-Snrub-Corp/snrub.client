/**
 * Validation constants for form fields
 */
import { required, email, maxLength, minLength, helpers } from "@vuelidate/validators";

// Regex patterns
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Field max lengths
export const MAX_LENGTH = {
  EMAIL: 254, // RFC 5321 standard
  NAME: 100,
  ROLE: 50,
  REPORT_DESCRIPTION: 1000,
} as const;

/**
 * Shared Vuelidate rule sets, so identical field validation isn't re-declared per form.
 */
export const emailRules = {
  required: helpers.withMessage("Email is required", required),
  email: helpers.withMessage("Please enter a valid email address", email),
  maxLength: helpers.withMessage(
    `Email must not exceed ${MAX_LENGTH.EMAIL} characters`,
    maxLength(MAX_LENGTH.EMAIL),
  ),
};

export const nameRules = {
  required: helpers.withMessage("Name is required", required),
  maxLength: helpers.withMessage(
    `Name must not exceed ${MAX_LENGTH.NAME} characters`,
    maxLength(MAX_LENGTH.NAME),
  ),
};

export const passwordRules = {
  required: helpers.withMessage("Password is required", required),
  minLength: helpers.withMessage("Password must be at least 8 characters", minLength(8)),
  hasDigit: helpers.withMessage("Password must contain at least one digit", (value: string) =>
    /[0-9]/.test(value),
  ),
  hasUppercase: helpers.withMessage(
    "Password must contain at least one uppercase letter",
    (value: string) => /[A-Z]/.test(value),
  ),
  hasLowercase: helpers.withMessage(
    "Password must contain at least one lowercase letter",
    (value: string) => /[a-z]/.test(value),
  ),
  hasSpecialChar: helpers.withMessage(
    "Password must contain at least one special character",
    (value: string) => /[!@#$%^&*()\-_=+[\]{}|;:,.<>?/`~]/.test(value),
  ),
};
