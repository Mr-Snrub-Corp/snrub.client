import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/httpService";

// Define types for the API response
interface User {
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
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

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
        console.error("Login failed:", error);
        throw error;
      }
    }

    async function reset({ email }: { email: string }) {
      try {
        const response = await api.auth.reset({ email });
        const data = response as AuthResponse;

        return data;
      } catch (error) {
        console.error("Reset failed:", error);
        throw error;
      }
    }

    function logout() {
      setUser(null);
      setToken(null);
    }

    return { user, token, setUser, setToken, login, logout, reset };
  },
  {
    persist: {
      enabled: true,
    },
  },
);
