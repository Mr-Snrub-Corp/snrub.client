<template>
  <div class="h-screen flex w-full bg-surface-0 dark:bg-surface-950">
    <div class="bg-surface-0 dark:bg-surface-950 w-full md:w-6/12 p-12 md:p-20">
      <div class="mb-8">
        <RouterLink to="/">
          <svg
            class="mb-4 fill-surface-600 dark:fill-surface-200 h-14"
            viewBox="0 0 30 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
            />
          </svg>
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
      router.push({ name: "dashboardIndex" });
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

const checked2 = ref(true);
</script>
