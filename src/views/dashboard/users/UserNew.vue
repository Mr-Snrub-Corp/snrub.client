<template>
  <div>
    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Add new user</h1>

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
              v-model="formData.userStatus"
              :options="userStatusOptions"
              option-label="label"
              option-value="value"
              placeholder="Select user status"
              class="w-full"
              :invalid="v$.userStatus.$error"
              @blur="v$.userStatus.$touch()"
            />
            <small v-if="v$.userStatus.$error" class="text-red-500">
              {{ v$.userStatus.$errors[0]?.$message }}
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
import Select from "primevue/select";
import { useVuelidate } from "@vuelidate/core";
import { required, email, maxLength, helpers } from "@vuelidate/validators";
import { UserStatus } from "@/types/user";
import { MAX_LENGTH, USER_ROLES } from "@/constants/validation";

const router = useRouter();

// Form data
const formData = ref({
  email: "",
  name: "",
  role: "",
  userStatus: UserStatus.ACTIVE,
});

// Role options
const roleOptions = ref([...USER_ROLES]);

// User status options
const userStatusOptions = ref([
  { label: "Active", value: UserStatus.ACTIVE },
  { label: "Inactive", value: UserStatus.INACTIVE },
  { label: "Deceased", value: UserStatus.DECEASED },
  { label: "Suspended", value: UserStatus.SUSPENDED },
]);

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
  userStatus: {
    required: helpers.withMessage("User status is required", required),
  },
};

const v$ = useVuelidate(rules, formData);

// Form handlers
async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  // TODO: Implement API call to create user
  console.log("Creating user:", formData.value);
  // Example:
  // try {
  //   await usersStore.createUser(formData.value);
  //   router.push({ name: "users" });
  // } catch (error) {
  //   console.error("Error creating user:", error);
  // }
}

function handleCancel() {
  router.push({ name: "users" });
}
</script>
