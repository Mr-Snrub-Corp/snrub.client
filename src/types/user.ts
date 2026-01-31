/**
 * User status enum matching the Python backend model
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DECEASED = "deceased",
  SUSPENDED = "suspended",
}

/**
 * User interface
 */
export interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
  userStatus: UserStatus;
  photo?: string; // Optional - URL to user's photo
}

