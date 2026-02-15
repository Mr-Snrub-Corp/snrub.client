import { USER_ROLES, USER_STATUS } from "@/constants/enums";

/**
 * User role type derived from USER_ROLES constant
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * User status type derived from USER_STATUS constant
 */
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

/**
 * User interface
 */
export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  photo?: string; // Optional - URL to user's photo
}
