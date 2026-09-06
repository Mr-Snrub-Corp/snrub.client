<template>
  <main
    id="main-content"
    class="h-screen w-full bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20"
  >
    <div
      class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-8"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4">
          <DashboardLogo :size="56" />
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
          <h1
            class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full"
          >
            Reset Your Password
          </h1>
        </div>
      </div>
      <form @submit.prevent="handleReset" class="flex flex-col gap-6 w-full">
        <FormField
          label="New password"
          input-id="password"
          error-id="password-error"
          :field="v$.password"
          label-class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
        >
          <template #label-append>
            <Button
              type="button"
              class="p-0"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Toggle new password visibility"
              @click="togglePasswordVisibility('passwordType')"
              ><i
                :class="[
                  'pi',
                  {
                    'pi-eye': passwordType === 'password',
                    'pi-eye-slash': passwordType === 'text',
                  },
                ]"
                aria-hidden="true"
              ></i
            ></Button>
          </template>
          <InputText
            id="password"
            data-testid="auth.reset-password-form.password-input"
            :type="passwordType"
            v-model="password"
            placeholder="Enter new password"
            class="w-full px-3 py-2 shadow-sm rounded-lg"
            :invalid="v$.password.$error"
            :aria-invalid="v$.password.$error"
            :aria-describedby="v$.password.$error ? 'password-error' : undefined"
            @blur="v$.password.$touch()"
          />
        </FormField>
        <FormField
          label="Confirm Password"
          input-id="confirmPassword"
          error-id="confirmPassword-error"
          :field="v$.confirmPassword"
          label-class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
        >
          <template #label-append>
            <Button
              type="button"
              class="p-0"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Toggle confirm password visibility"
              @click="togglePasswordVisibility('confirmPasswordType')"
              ><i
                :class="[
                  'pi',
                  {
                    'pi-eye': confirmPasswordType === 'password',
                    'pi-eye-slash': confirmPasswordType === 'text',
                  },
                ]"
                aria-hidden="true"
              ></i
            ></Button>
          </template>
          <InputText
            id="confirmPassword"
            data-testid="auth.reset-password-form.confirm-password-input"
            :type="confirmPasswordType"
            v-model="confirmPassword"
            placeholder="Confirm password"
            class="w-full px-3 py-2 shadow-sm rounded-lg"
            :invalid="v$.confirmPassword.$error"
            :aria-invalid="v$.confirmPassword.$error"
            :aria-describedby="v$.confirmPassword.$error ? 'confirmPassword-error' : undefined"
            @blur="v$.confirmPassword.$touch()"
          />
        </FormField>
        <Button
          data-testid="auth.reset-password-form.submit-btn"
          type="submit"
          label="Reset Password"
          severity="primary"
          icon="pi pi-user"
          class="w-full py-2 rounded-lg flex justify-center items-center gap-2"
          :disabled="v$.$invalid"
        >
          <template #icon>
            <i class="pi pi-user !text-base !leading-normal" aria-hidden="true" />
          </template>
        </Button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import DashboardLogo from "@/components/dashboard/DashboardLogo.vue";
import FormField from "@/components/form/FormField.vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { TOAST_LIFE } from "@/constants/toast";

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, helpers } from "@vuelidate/validators";
import { passwordRules } from "@/constants/validation";

const password = ref("");
const confirmPassword = ref("");
const passwordType = ref("password");
const confirmPasswordType = ref("password");

const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = computed(() => route.query.token as string);

const authStore = useAuthStore();

// Rules for validation
const rules = {
  password: passwordRules,
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
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Password has been reset",
      life: TOAST_LIFE,
    });
    // Redirect to login page after successful reset
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong. Please try again later.",
      life: TOAST_LIFE,
    });
  }
}
</script>
