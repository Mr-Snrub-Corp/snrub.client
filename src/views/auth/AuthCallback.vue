<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { type User } from "@/types/user";
import { computed, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const provider = computed(() => route.query.provider as string);

// 1. Reads the query parameters
// 2. Stores the authentication state
// 3. Redirects to the appropriate page (dashboard, profile, etc.)

// 1. Reads the query parameters

onMounted(async () => {
  console.log("Callback mounted", route.query, provider.value);
  // const token = route.query.token as string;
  console.log(route.hash);
  const hashParams = new URLSearchParams(route.hash.substring(1));
  const token = hashParams.get("token");

  if (token) {
    // Decode the JWT to get user data
    const userData = jwtDecode<User>(token);
    authStore.setToken(token);
    authStore.setUser(userData);
    // Wait for Vue to process the reactive updates
    await nextTick();
    console.log("Attempting navigation to dashboard");
    router
      .push({ name: "dashboardIndex" })
      .then(() => {
        console.log("Navigation successful");
      })
      .catch((err) => {
        console.error("Navigation failed:", err);
      });
  } else {
    console.warn("No token found in query parameters");
  }
});
</script>
