import { useUsersStore } from "@/stores/users";

/**
 * Resolves a user's display name from the users store, falling back to the raw
 * id when the user isn't loaded. Replaces the `getUserName`/`getSubjectName`
 * helpers duplicated across views.
 */
export function useUserLookup() {
  const usersStore = useUsersStore();

  function getUserName(userId: string): string {
    return usersStore.getUserById(userId)?.name ?? userId;
  }

  return { getUserName };
}
