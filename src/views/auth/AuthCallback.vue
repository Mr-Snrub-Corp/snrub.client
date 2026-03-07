<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { type User } from "@/types/user";
import { nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useToast } from "primevue/usetoast";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
  const hashParams = new URLSearchParams(route.hash.substring(1));
  const token = hashParams.get("token");

  if (token) {
    const userData = jwtDecode<User>(token);
    authStore.setToken(token);
    authStore.setUser(userData);
    await nextTick();
    router
      .push({ name: "dashboardHome" })
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Welcome",
          detail: "Welcome to Snrub Corp dashboard. You are logged in as a guest.",
          life: 5000,
        });
      })
      .catch((err) => {
        console.error("Navigation failed:", err);
      });
  }
});
</script>
