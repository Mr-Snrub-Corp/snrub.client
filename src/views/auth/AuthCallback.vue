<template>
  <main id="main-content">
    <h1 class="sr-only">Signing In</h1>
    <p role="status" class="sr-only">Completing sign in, please wait…</p>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { TOAST_LIFE } from "@/constants/toast";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
  if (route.query.error) {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Google authentication failed. Please try again.",
      life: TOAST_LIFE,
    });
    router.push({ name: "Login" });
    return;
  }

  try {
    await authStore.loginGoogle();
    await router.push({ name: "dashboardHome" });
    toast.add({
      severity: "success",
      summary: "Welcome",
      detail: "Welcome to Snrub Corp dashboard. You are logged in as a guest.",
      life: TOAST_LIFE,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Could not retrieve authentication token. Please try again.",
      life: TOAST_LIFE,
    });
    router.push({ name: "Login" });
  }
});
</script>
