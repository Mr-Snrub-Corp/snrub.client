<template>
  <div class="h-screen flex w-full bg-surface-0 dark:bg-surface-950">
    <div class="bg-surface-0 dark:bg-surface-950 w-full md:w-6/12 p-12 md:p-20">
      <div class="mb-8">
        <RouterLink to="/" class="inline-block mb-4">
          <DashboardLogo :size="56" />
        </RouterLink>
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
          Welcome Back
        </div>
        <div class="flex items-center">
          <span class="text-surface-600 dark:text-surface-200 font-medium mr-1"
            >Don't have an account?</span
          >
          <Button
            as="router-link"
            to="/signup"
            variant="text"
            severity="secondary"
            class="font-medium inline-flex items-center -ml-2"
            >Create today!</Button
          >
        </div>
      </div>
      <div>
        <form>
          <label for="email2" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
            >Email</label
          >
          <InputText
            id="email2"
            v-model="email"
            type="text"
            placeholder="Email address"
            class="w-full mb-4 p-4"
          />

          <label for="password2" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
            >Password</label
          >
          <InputText
            id="password2"
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full mb-4 p-4"
            autocomplete="off"
          />

          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center">
              <!-- <Checkbox id="rememberme2" v-model="checked2" :binary="true" class="mr-2" />
              <label for="rememberme2">Remember me</label> -->
            </div>
            <Button
              class="font-medium no-underline ml-2 text-primary text-right"
              label="Forgot password?"
              severity="secondary"
              variant="text"
              as="router-link"
              :to="{ name: 'Forgot' }"
            >
            </Button>
          </div>
        </form>

        <Button
          @click="handleLogin"
          label="Sign in"
          severity="primary"
          icon="pi pi-user"
          class="w-full p-4"
        />
        <div class="flex justify-between gap-2 mt-4">
          <Button
            @click="handleGoogleLogin"
            label="Sign in with Google"
            severity="danger"
            icon="pi pi-google"
            class="w-100 grow p-4 mt-2"
          />
          <Button
            @click="handleSpotifyLogin"
            label="Sign in with Spotify"
            severity="success"
            icon="pi pi-google"
            class="w-100 grow p-4 mt-2"
          />
        </div>
      </div>
      <Message v-if="errorMessage" class="mt-4" severity="error" size="small">{{
        errorMessage
      }}</Message>
    </div>
    <div
      class="hidden md:block w-6/12 bg-no-repeat bg-cover bg-[url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/signin/signin.jpg')]"
    />
  </div>
</template>
<script setup lang="ts">
import DashboardLogo from "@/components/dashboard/DashboardLogo.vue";
import { HttpError } from "@/types/errors";
import Button from "primevue/button";

import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

import { ref } from "vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

function handleLogin() {
  errorMessage.value = ""; // Clear previous errors

  authStore
    .login({
      email: email.value,
      password: password.value,
    })
    .then((res: any) => {
      // should use a more specific type for the API response instead of any
      console.log(res.data);
      router.push({ name: "dashboardHome" });
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        // Display the error message from the server
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Login failed";
      }
    });
}

function handleGoogleLogin() {
  // Direct browser navigation - this will follow the 302 redirect automatically
  window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URL; //  'http://localhost:8000/api/auth/google/login';
}

function handleSpotifyLogin() {
  console.log("spotify login");
}

</script>
