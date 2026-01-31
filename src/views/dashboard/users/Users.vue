<template>
  <div class="p-6 md:p-12 lg:p-20 bg-surface-50 dark:bg-surface-950">
    <!-- Header with Add User Button -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Users</h1>
      <Button
        v-if="isAdmin"
        label="Add User"
        icon="pi pi-plus"
        @click="router.push({ name: 'userNew' })"
        severity="primary"
      />
    </div>

    <DataTable :value="allUsers" class="shadow-sm rounded-2xl overflow-hidden">
      <Column field="name" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="role" header="Role"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            :icon="actionIcon"
            @click="router.push({ name: 'userUpdate', params: { uid: slotProps.data.uid } })"
            severity="secondary"
            variant="text"
            rounded
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useUsersStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const allUsers = usersStore.getAllUsers;

// Check if current user can add users (admin or super admin)
const isAdmin = computed(() => {
  const currentUserRole = authStore.user?.role?.toLowerCase();
  return currentUserRole === "admin" || currentUserRole === "super-admin";
});

// Determine which icon to show based on logged-in user's role
const actionIcon = computed(() => {
  if (isAdmin.value) {
    return "pi pi-pencil";
  }
  return "pi pi-eye";
});
</script>

<style lang="scss" scoped></style>
