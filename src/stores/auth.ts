import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/httpService";

// Define types for the API response
export interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    // Getters
    const isLoggedIn = computed(() => !!user.value && !!token.value);

    function setUser(newUser: User | null) {
      user.value = newUser;
    }

    function setToken(newToken: string | null) {
      token.value = newToken;
    }

    async function login({ email, password }: { email: string; password: string }) {
      try {
        const response = await api.auth.login({ email, password });
        const data = response as AuthResponse;

        setUser(data.user);
        setToken(data.access_token);

        return data;
      } catch (error) {
        throw error;
      }
    }

    async function loginGoogle() {
      try {
        const response = await api.auth.loginGoogle();
        const data = response as AuthResponse;

        setUser(data.user);
        setToken(data.access_token);

        return data;
      } catch (error) {
        throw error;
      }
    }

    async function reset({ email }: { email: string }) {
      try {
        const response = await api.auth.requestPasswordReset({ email });
        const data = response as AuthResponse;

        return data;
      } catch (error) {
        console.error("Reset failed:", error);
        throw error;
      }
    }

    async function resetPassword({ token, new_password }: { token: string; new_password: string }) {
      try {
        const response = await api.auth.resetPassword({ token, new_password });
        return response;
      } catch (error) {
        throw error;
      }
    }

    function logout() {
      setUser(null);
      setToken(null);
    }

    return {
      user,
      token,
      isLoggedIn,
      setUser,
      setToken,
      login,
      loginGoogle,
      logout,
      reset,
      resetPassword,
    };
  },
  {
    persist: {
      enabled: true,
    },
  },
);
