<template>
  <PageShell content-class="h-screen">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Add New Employee</h1>
    </div>

    <div class="bg-surface-0 dark:bg-surface-900 p-7 shadow rounded-2xl flex-auto xl:w-3/4">
      <div class="flex flex-col gap-7">
        <div class="text-xl font-medium text-surface-900 dark:text-surface-0">
          Employee Information
        </div>

        <div class="flex flex-col gap-6">
          <FormField label="Email *" input-id="email" error-id="new-email-error" :field="v$.email">
            <InputText
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full"
              data-testid="employees.new-form.email-input"
              :invalid="v$.email.$error"
              :aria-invalid="v$.email.$error"
              :aria-describedby="v$.email.$error ? 'new-email-error' : undefined"
              @blur="v$.email.$touch()"
            />
          </FormField>

          <FormField label="Name *" input-id="name" error-id="new-name-error" :field="v$.name">
            <InputText
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full"
              data-testid="employees.new-form.name-input"
              :invalid="v$.name.$error"
              :aria-invalid="v$.name.$error"
              :aria-describedby="v$.name.$error ? 'new-name-error' : undefined"
              @blur="v$.name.$touch()"
            />
          </FormField>

          <FormField label="Role *" input-id="role" error-id="new-role-error" :field="v$.role">
            <Select
              id="role"
              v-model="formData.role"
              :options="roleOptions"
              option-label="label"
              option-value="value"
              placeholder="Select a role"
              class="w-full"
              data-testid="employees.new-form.role-select"
              :invalid="v$.role.$error"
              :aria-invalid="v$.role.$error"
              :aria-describedby="v$.role.$error ? 'new-role-error' : undefined"
              @blur="v$.role.$touch()"
            />
          </FormField>

          <FormField
            label="Employee Status *"
            input-id="userStatus"
            error-id="new-status-error"
            :field="v$.status"
          >
            <Select
              id="userStatus"
              v-model="formData.status"
              :options="userStatusOptions"
              option-label="label"
              option-value="value"
              placeholder="Select employee status"
              class="w-full"
              data-testid="employees.new-form.status-select"
              :invalid="v$.status.$error"
              :aria-invalid="v$.status.$error"
              :aria-describedby="v$.status.$error ? 'new-status-error' : undefined"
              @blur="v$.status.$touch()"
            />
          </FormField>

          <FormField
            label="Password *"
            input-id="password"
            error-id="new-password-error"
            :field="v$.password"
          >
            <Password
              id="password"
              v-model="formData.password"
              class="w-full"
              input-class="w-full"
              data-testid="employees.new-form.password-input"
              toggle-mask
              :invalid="v$.password.$error"
              :aria-invalid="v$.password.$error"
              :aria-describedby="v$.password.$error ? 'new-password-error' : undefined"
              @blur="v$.password.$touch()"
            />
          </FormField>
        </div>

        <div class="flex gap-3">
          <Button
            label="Create Employee"
            severity="primary"
            data-testid="employees.new-form.create-btn"
            :disabled="v$.$invalid"
            @click="handleSubmit"
          />
          <Button
            label="Cancel"
            severity="secondary"
            variant="outlined"
            data-testid="employees.new-form.cancel-btn"
            @click="handleCancel"
          />
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { USER_ROLES, USER_STATUS } from "@/constants/enums";
import { emailRules, nameRules, passwordRules } from "@/constants/validation";
import { enumToSelectOptions } from "@/utils";
import FormField from "@/components/form/FormField.vue";
import PageShell from "@/components/layout/PageShell.vue";
import { useUsersStore } from "@/stores/users";
import { useToast } from "primevue/usetoast";
import { TOAST_LIFE } from "@/constants/toast";

const toast = useToast();
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
const roleOptions = enumToSelectOptions(USER_ROLES);

// User status options
const userStatusOptions = enumToSelectOptions(USER_STATUS);

// Validation rules
const rules = {
  email: emailRules,
  name: nameRules,
  role: {
    required: helpers.withMessage("Role is required", required),
  },
  status: {
    required: helpers.withMessage("Employee status is required", required),
  },
  password: passwordRules,
};

const v$ = useVuelidate(rules, formData);

// Form handlers
async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  try {
    const user = await usersStore.createUser(formData.value);
    router.push({ name: "employeeDetail", params: { uid: user.uid } });
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong. Please try again later.",
      life: TOAST_LIFE,
    });
  }
}

function handleCancel() {
  router.push({ name: "employees" });
}
</script>
