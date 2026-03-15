<template>
  <div class="px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8 bg-surface-50 dark:bg-surface-950">
    <!-- Header with Add User Button -->
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Users</h1>
      <Button
        v-if="authStore.isAdmin"
        label="Add User"
        data-testid="add-user-btn"
        icon="pi pi-plus"
        @click="router.push({ name: 'userNew' })"
        severity="primary"
      />
    </div>

    <DataTable
      data-testid="users-table"
      :value="allUsers"
      class="shadow-sm rounded-2xl overflow-hidden"
    >
      <Column field="photo" header="Photo">
        <template #body="slotProps">
          <Avatar
            v-if="slotProps.data.photo"
            :image="`data:image/png;base64,${slotProps.data.photo}`"
            class="mr-2 border border-surface-300"
            shape="circle"
          />
        </template>
      </Column>
      <Column field="name" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="role" header="Role"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <!-- Inline action buttons: visible on xl and above -->
          <div class="hidden xl:flex">
            <Button
              v-if="authStore.isSuperAdmin"
              icon="pi pi-trash"
              data-testid="delete-user-btn"
              @click="handleShowDeleteDialog(slotProps.data.uid)"
              severity="secondary"
              variant="text"
              rounded
            />
            <Button
              :icon="actionIcon"
              @click="router.push({ name: 'userUpdate', params: { uid: slotProps.data.uid } })"
              severity="secondary"
              variant="text"
              rounded
            />
          </div>
          <!-- Popup menu trigger: visible on lg and below -->
          <Button
            class="xl:hidden"
            icon="pi pi-ellipsis-v"
            @click="toggleActionMenu($event, slotProps.data)"
            severity="secondary"
            variant="text"
            rounded
            aria-haspopup="true"
            aria-controls="row_action_menu"
          />
        </template>
      </Column>
    </DataTable>

    <Menu ref="actionMenuRef" id="row_action_menu" :model="actionMenuItems" :popup="true" />

    <DeleteConfirmDialog
      :is-visible="showDeleteConfirmDialog"
      header="Delete User"
      confirm-button-label="Delete"
      @handle-close="showDeleteConfirmDialog = false"
      @handle-delete="handleDelete"
    >
      <p>Are you sure you want to delete this user? This action cannot be undone.</p>
    </DeleteConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Menu from "primevue/menu";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog.vue";
import { useUsersStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import type { MenuItem } from "primevue/menuitem";

const router = useRouter();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const allUsers = usersStore.getAllUsers;

const showDeleteConfirmDialog = ref(false);
const selectedUserUid = ref<string | null>(null);

// Determine which icon to show based on logged-in user's role
const actionIcon = computed(() => {
  if (authStore.isAdmin) {
    return "pi pi-pencil";
  }
  return "pi pi-eye";
});

// Popup action menu
const actionMenuRef = ref<InstanceType<typeof Menu>>();
const actionMenuItems = ref<MenuItem[]>([]);

function toggleActionMenu(event: Event, rowData: { uid: string }) {
  actionMenuItems.value = [
    ...(authStore.isAdmin
      ? [
          {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => handleShowDeleteDialog(rowData.uid),
          },
        ]
      : []),
    {
      label: authStore.isAdmin ? "Edit" : "View",
      icon: actionIcon.value,
      command: () => router.push({ name: "userUpdate", params: { uid: rowData.uid } }),
    },
  ];
  actionMenuRef.value?.toggle(event);
}

function handleShowDeleteDialog(userUid: string) {
  showDeleteConfirmDialog.value = true;
  selectedUserUid.value = userUid;
}

// Methods
function handleDelete() {
  showDeleteConfirmDialog.value = false;
  if (selectedUserUid.value) {
    usersStore.deleteUser(selectedUserUid.value);
  }
}
</script>

<style lang="scss" scoped></style>
