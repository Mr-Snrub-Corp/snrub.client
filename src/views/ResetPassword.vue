<template>
  <div class="h-screen w-full bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div
      class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-8"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-14 w-14"
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
              class="fill-surface-700 dark:fill-surface-200"
            />
          </svg>
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
          <div
            class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full"
          >
            Lets Reset
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2 w-full">
          <div class="flex flex-col gap-2 w-full">
            <div class="flex justify-between w-full">
              <label
                for="password"
                class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
                >New password</label
              >
              <!-- <span role="button" class="p-button-text cursor-pointer"
                ></i
              ></span> -->
              <Button
                class="p-0"
                severity="secondary"
                variant="text"
                rounded
                aria-label="Toggle password visibility"
                @click="togglePasswordVisibility('passwordType')"
                ><i
                  :class="[
                    'pi',
                    {
                      'pi-eye': confirmPasswordType === 'password',
                      'pi-eye-slash': confirmPasswordType === 'text',
                    },
                  ]"
                ></i
              ></Button>
            </div>
            <InputText
              id="password"
              :type="passwordType"
              v-model="password"
              placeholder="Enter new password"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
            <Message v-if="v$.password.$invalid" severity="error" size="small" variant="simple">{{
              v$.password.$errors[0]?.$message
            }}</Message>
          </div>
          <div class="flex flex-col gap-2 w-full">
            <div class="flex justify-between w-full">
              <label
                for="confirmPassword"
                class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
                >Confirm Password</label
              >
              <Button
                class="p-0"
                severity="secondary"
                variant="text"
                rounded
                aria-label="Toggle password visibility"
                @click="togglePasswordVisibility('confirmPasswordType')"
                ><i
                  :class="[
                    'pi',
                    {
                      'pi-eye': confirmPasswordType === 'password',
                      'pi-eye-slash': confirmPasswordType === 'text',
                    },
                  ]"
                ></i
              ></Button>
            </div>
            <InputText
              id="confirmPassword"
              :type="confirmPasswordType"
              v-model="confirmPassword"
              placeholder="Confirm password"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
            <Message
              v-if="v$.confirmPassword.$invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ v$.confirmPassword.$errors[0]?.$message }}</Message
            >
          </div>
        </div>
        <Button
          label="Reset Password"
          icon="pi pi-user"
          class="w-full py-2 rounded-lg flex justify-center items-center gap-2"
          @click="handleReset"
        >
          <template #icon>
            <i class="pi pi-user !text-base !leading-normal" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs, helpers } from "@vuelidate/validators";

const password = ref("");
const confirmPassword = ref("");
const passwordType = ref("password");
const confirmPasswordType = ref("password");

const route = useRoute();
const router = useRouter();

const token = computed(() => route.query.token as string);

const authStore = useAuthStore();

// Custom validator for password complexity
const containsUppercase = helpers.regex(/[A-Z]/);
const containsLowercase = helpers.regex(/[a-z]/);
const containsNumber = helpers.regex(/[0-9]/);
const containsSymbol = helpers.regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);

const passwordComplexity = helpers.withMessage(
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
  (value: string) =>
    containsUppercase(value) &&
    containsLowercase(value) &&
    containsNumber(value) &&
    containsSymbol(value),
);

// Rules for validation
const rules = {
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage("Password must be at least 8 characters", minLength(8)),
    complexity: passwordComplexity,
  },
  confirmPassword: {
    required: helpers.withMessage("Please confirm your password", required),
    sameAsPassword: helpers.withMessage("Passwords must match", sameAs(password)),
  },
};

const v$ = useVuelidate(rules, { password, confirmPassword });

function togglePasswordVisibility(field: string) {
  if (field === "passwordType") {
    passwordType.value = passwordType.value === "password" ? "text" : "password";
  } else if (field === "confirmPasswordType") {
    confirmPasswordType.value = confirmPasswordType.value === "password" ? "text" : "password";
  }
}

async function handleReset() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  try {
    await authStore.resetPassword({
      token: token.value,
      new_password: password.value,
    });
    // TODO add toast before redirect
    // Redirect to login page after successful reset
    router.push("/auth/login");
  } catch (error) {
    console.error("Password reset failed:", error);
  }
}
</script>
