<template>
  <div>
    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Update user</h1>

    <div
      class="col-span-12 lg:col-span-10 xl:col-span-8 bg-surface-0 dark:bg-surface-900 p-7 shadow rounded-2xl flex-auto"
    >
      <div class="flex flex-col gap-7">
        <div class="text-surface-900 dark:text-surface-0 font-semibold text-base">Profile</div>

        <div class="flex gap-10 flex-col-reverse md:flex-row">
          <div class="flex-auto flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <label for="email" class="text-surface-900 dark:text-surface-0">Email *</label>
              <InputText
                id="email"
                v-model="formData.email"
                :disabled="isViewOnlyMode || isUserEditMode"
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
                :disabled="isViewOnlyMode"
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
                :disabled="isViewOnlyMode || isUserEditMode"
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
                v-model="formData.userStatus"
                :disabled="isViewOnlyMode || isUserEditMode"
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

          <div class="flex flex-col gap-2">
            <label class="text-surface-900 dark:text-surface-0">Avatar</label>
            <div class="flex flex-col items-center gap-3">
              <img
                :src="getUserAvatar"
                alt="User avatar"
                class="h-24 w-24 rounded-lg object-cover"
              />
              <FileUpload
                mode="basic"
                name="avatar"
                accept="image/*"
                custom-upload
                auto
                :max-file-size="1000000"
                choose-label="Upload"
                :choose-icon="isUploadingImage ? 'pi pi-spin pi-spinner' : 'pi pi-upload'"
                severity="secondary"
                class="p-button-outlined"
                @select="onPhotoSelect"
              />
            </div>
          </div>
        </div>

        <div>
          <Button
            label="Update Profile"
            severity="primary"
            :disabled="v$.$invalid || isViewOnlyMode"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import type { FileUploadSelectEvent } from "primevue/fileupload";
import { useVuelidate } from "@vuelidate/core";
import { required, email, maxLength, helpers } from "@vuelidate/validators";
import { USER_ROLES, USER_STATUS } from "@/constants/enums";
import { MAX_LENGTH } from "@/constants/validation";
import { useUsersStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { formatLabel } from "@/utils";
import type { UserRole, UserStatus } from "@/types/user";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const toast = useToast();

// Get uid from route params
const uid = route.params.uid as string;

// Get user from store
const user = usersStore.getUserById(uid);
const isUploadingImage = ref(false);
// Form data - initialize from store user data
const formData = ref<{
  email: string;
  name: string;
  role: UserRole | "";
  userStatus: UserStatus;
  photo: string;
}>({
  email: user?.email || "",
  name: user?.name || "",
  role: user?.role || "",
  userStatus: user?.userStatus || USER_STATUS.ACTIVE,
  photo: user?.photo || "",
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

// Computeds
const isViewOnlyMode = computed(() => {
  return !authStore.isAdmin;
});
const isUserEditMode = computed(() => {
  if (user) {
    return user.role === USER_ROLES.CREATOR && user.uid === authStore.user?.uid;
  } else {
    return false;
  }
});

// Validation rules (same as UserNew)
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

// Handle photo upload
async function onPhotoSelect(event: FileUploadSelectEvent) {
  const file = event.files[0];
  if (file) {
    // Create a preview URL for the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Strip "data:image/png;base64," prefix
      formData.value.photo = result.split(",")[1];
    };
    reader.readAsDataURL(file);
    try {
      isUploadingImage.value = true;
      await usersStore.uploadPhoto(uid, file);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Photo has been successfully uploaded",
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      formData.value.photo = "";
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong with photo upload",
        life: 3000,
      });
    } finally {
      isUploadingImage.value = false;
    }
  }
}

// Form handlers
async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  try {
    // Ensure role is a valid UserRole before submitting
    const updateData = {
      email: formData.value.email,
      name: formData.value.name,
      role: formData.value.role as UserRole,
      status: formData.value.userStatus,
    };
    await usersStore.updateUser(uid, updateData);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "User has been successfully updated",
      life: 3000,
    });
    router.push({ name: "users" });
  } catch (error) {
    console.error("Error updating user:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong with user update",
      life: 3000,
    });
  }
}

const getUserAvatar = computed(() => {
  if (!formData.value.photo) {
    return "/img/avatar-placeholder.png"; // not working when formData.value.photo is reset in error catch
  } else {
    return `data:image/png;base64, ${formData.value.photo}`;
  }
});
</script>
