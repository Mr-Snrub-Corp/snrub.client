import { USER_STATUS } from "@/constants/enums";

/**
 * Maps a user status to a PrimeVue Tag severity, mirroring `getTagSeverity`
 * in `utils/incident.ts`.
 */
export const getUserStatusSeverity = (status: string): string => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "success";
    case USER_STATUS.INACTIVE:
      return "warn";
    case USER_STATUS.SUSPENDED:
    case USER_STATUS.DECEASED:
      return "danger";
    default:
      return "info";
  }
};

/** Builds a base64 data URL from a raw user photo string. */
export const photoToDataUrl = (photo: string): string => `data:image/png;base64,${photo}`;

/** Returns the avatar data URL for a user photo, or the placeholder when absent. */
export const getUserAvatar = (photo?: string | null): string =>
  photo ? photoToDataUrl(photo) : "/img/avatar-placeholder.png";
