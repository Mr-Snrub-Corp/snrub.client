<template>
  <div class="p-6 md:p-12 lg:p-20 bg-surface-50 dark:bg-surface-950 h-screen">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Add new user</h1>
    </div>

    <div
      class="col-span-12 lg:col-span-10 xl:col-span-8 bg-surface-0 dark:bg-surface-900 p-7 shadow rounded-2xl flex-auto"
    >
      <div class="flex flex-col gap-7">
        <div class="text-surface-900 dark:text-surface-0 font-semibold text-base">
          User Information
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-surface-900 dark:text-surface-0">Email *</label>
            <InputText
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full"
              :invalid="v$.email.$error"
              @blur="v$.email.$touch()"
            />
            <small v-if="v$.email.$error" class="text-red-500">
              {{ v$.email.$errors[0]?.$message }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="name" class="text-surface-900 dark:text-surface-0">Name *</label>
            <InputText
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full"
              :invalid="v$.name.$error"
              @blur="v$.name.$touch()"
            />
            <small v-if="v$.name.$error" class="text-red-500">
              {{ v$.name.$errors[0]?.$message }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="role" class="text-surface-900 dark:text-surface-0">Role *</label>
            <Select
              id="role"
              v-model="formData.role"
              :options="roleOptions"
              option-label="label"
              option-value="value"
              placeholder="Select a role"
              class="w-full"
              :invalid="v$.role.$error"
              @blur="v$.role.$touch()"
            />
            <small v-if="v$.role.$error" class="text-red-500">
              {{ v$.role.$errors[0]?.$message }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="userStatus" class="text-surface-900 dark:text-surface-0"
              >User Status *</label
            >
            <Select
              id="userStatus"
              v-model="formData.status"
              :options="userStatusOptions"
              option-label="label"
              option-value="value"
              placeholder="Select user status"
              class="w-full"
              :invalid="v$.status.$error"
              @blur="v$.status.$touch()"
            />
            <small v-if="v$.status.$error" class="text-red-500">
              {{ v$.status.$errors[0]?.$message }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="text-surface-900 dark:text-surface-0">Password *</label>
            <Password
              id="password"
              v-model="formData.password"
              class="w-full"
              input-class="w-full"
              toggle-mask
              :invalid="v$.password.$error"
              @blur="v$.password.$touch()"
            />
            <small v-if="v$.password.$error" class="text-red-500">
              {{ v$.password.$errors[0]?.$message }}
            </small>
          </div>
        </div>

        <div class="flex gap-3">
          <Button
            label="Create User"
            severity="primary"
            :disabled="v$.$invalid"
            @click="handleSubmit"
          />
          <Button label="Cancel" severity="secondary" variant="outlined" @click="handleCancel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import { useVuelidate } from "@vuelidate/core";
import { required, email, maxLength, minLength, helpers } from "@vuelidate/validators";
import { USER_ROLES, USER_STATUS } from "@/constants/enums";
import { MAX_LENGTH } from "@/constants/validation";
import { formatLabel } from "@/utils";
import { useUsersStore } from "@/stores/users";

const router = useRouter();
const usersStore = useUsersStore();

// Form data
const formData = ref({
  email: "",
  name: "",
  role: USER_ROLES.VIEWER,
  status: USER_STATUS.ACTIVE,
  password: "",
});

// Role options
const roleOptions = ref(
  Object.values(USER_ROLES).map((role) => ({
    label: formatLabel(role),
    value: role,
  })),
);

// User status options
const userStatusOptions = ref(
  Object.values(USER_STATUS).map((status) => ({
    label: formatLabel(status),
    value: status,
  })),
);

// Validation rules
const rules = {
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Please enter a valid email address", email),
    maxLength: helpers.withMessage(
      `Email must not exceed ${MAX_LENGTH.EMAIL} characters`,
      maxLength(MAX_LENGTH.EMAIL),
    ),
  },
  name: {
    required: helpers.withMessage("Name is required", required),
    maxLength: helpers.withMessage(
      `Name must not exceed ${MAX_LENGTH.NAME} characters`,
      maxLength(MAX_LENGTH.NAME),
    ),
  },
  role: {
    required: helpers.withMessage("Role is required", required),
  },
  status: {
    required: helpers.withMessage("User status is required", required),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage("Password must be at least 8 characters", minLength(8)),
    hasDigit: helpers.withMessage("Password must contain at least one digit", (value: string) =>
      /[0-9]/.test(value),
    ),
    hasUppercase: helpers.withMessage(
      "Password must contain at least one uppercase letter",
      (value: string) => /[A-Z]/.test(value),
    ),
    hasLowercase: helpers.withMessage(
      "Password must contain at least one lowercase letter",
      (value: string) => /[a-z]/.test(value),
    ),
    hasSpecialChar: helpers.withMessage(
      "Password must contain at least one special character",
      (value: string) => /[!@#$%^&*()\-_=+[\]{}|;:,.<>?/`~]/.test(value),
    ),
  },
};

const v$ = useVuelidate(rules, formData);

// Form handlers
async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  try {
    await usersStore.createUser(formData.value);
    router.push({ name: "users" });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

function handleCancel() {
  router.push({ name: "users" });
}
</script>
