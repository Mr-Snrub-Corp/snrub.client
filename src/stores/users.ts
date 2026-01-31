import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/httpService";
import { type User, UserStatus } from "@/types/user";

// Re-export for convenience
export type { User };
export { UserStatus };

export const useUsersStore = defineStore("users", () => {
  // State
  const users = ref<User[]>([]);

  // Getters
  const getAllUsers = computed(() => users.value);

  // Actions
  async function fetchUsers() {
    try {
      const response = await api.users.get();
      users.value = response;
      return response;
    } catch (err: any) {
      console.error("Error fetching users:", err);
      throw err;
    }
  }

  async function fetchUserById(uid: string) {
    try {
      const response = await api.users.getOne(uid);
      return response;
    } catch (err: any) {
      console.error(`Error fetching user ${uid}:`, err);
      throw err;
    } finally {
    }
  }

  async function updateUser(uid: string, userData: Partial<User>) {
    try {
      const response = await api.users.updateOne(uid, userData);
      const index = users.value.findIndex((user) => user.uid === uid);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...response };
      }
      return response;
    } catch (err: any) {
      console.error(`Error updating user ${uid}:`, err);
      throw err;
    }
  }

  async function deleteUser(uid: string) {
    try {
      await api.users.deleteOne(uid);
      users.value = users.value.filter((user) => user.uid !== uid);
    } catch (err: any) {
      console.error(`Error deleting user ${uid}:`, err);
      throw err;
    }
  }

  return {
    users,
    getAllUsers,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };
});
