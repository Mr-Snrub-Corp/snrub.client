<template>
  <div class="min-h-screen flex relative lg:static bg-surface-50 dark:bg-surface-950">
    <!-- Desktop Sidebar -->
    <div
      id="app-sidebar"
      class="bg-surface-900 h-screen hidden lg:block shrink-0 absolute lg:static left-0 top-0 z-10 lg:w-28 w-72 select-none"
    >
      <div class="flex flex-col h-full">
        <div
          class="flex items-center justify-center shrink-0 bg-primary p-4 border-r border-primary min-h-[4.71rem]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.34219 2.87829C6.19766 3.67858 5.1627 4.62478 4.26426 5.68992C7.9357 5.34906 12.6001 5.90564 18.0155 8.61335C23.7984 11.5047 28.455 11.6025 31.6958 10.9773C31.4017 10.087 31.0315 9.23135 30.593 8.41791C26.8832 8.80919 22.1272 8.29127 16.5845 5.51998C13.0648 3.76014 9.96221 3.03521 7.34219 2.87829ZM28.4259 5.33332C25.4962 2.06 21.2387 0 16.5 0C15.1084 0 13.7581 0.177686 12.4709 0.511584C14.2143 0.987269 16.0663 1.68319 18.0155 2.65781C22.0736 4.68682 25.5771 5.34013 28.4259 5.33332ZM32.3887 14.1025C28.4735 14.8756 23.067 14.7168 16.5845 11.4755C10.524 8.44527 5.70035 8.48343 2.44712 9.20639C2.2792 9.24367 2.11523 9.28287 1.95522 9.32367C1.5293 10.25 1.18931 11.2241 0.945362 12.2356C1.20591 12.166 1.47514 12.0998 1.75293 12.0381C5.69966 11.161 11.2761 11.1991 18.0155 14.5689C24.0761 17.5991 28.8997 17.561 32.1529 16.838C32.2644 16.8133 32.3742 16.7877 32.4822 16.7613C32.4941 16.509 32.5 16.2552 32.5 16C32.5 15.358 32.4622 14.7248 32.3887 14.1025ZM31.9598 20.1378C28.0826 20.8157 22.8336 20.5555 16.5845 17.431C10.524 14.4008 5.70035 14.439 2.44712 15.1619C1.725 15.3223 1.07539 15.5178 0.502344 15.7241C0.500782 15.8158 0.5 15.9078 0.5 16C0.5 24.8366 7.66344 32 16.5 32C23.9057 32 30.1362 26.9687 31.9598 20.1378Z"
              class="fill-primary-contrast"
            />
          </svg>
        </div>
        <div class="flex-1 p-4 flex flex-col items-center gap-2 border-r border-surface-800">
          <RouterLink
            :to="{ name: 'dashboardIndex' }"
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-home text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Home</span
            >
          </RouterLink>
          <RouterLink
            :to="{ name: 'users' }"
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-users text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Team</span
            >
          </RouterLink>
          <RouterLink
            :to="{ name: 'designForm' }"
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-palette text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Design</span
            >
          </RouterLink>
          <a
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-chart-line text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Reports</span
            >
          </a>
          <a
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-calendar text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Events</span
            >
          </a>
          <a
            class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
          >
            <i
              class="pi pi-cog text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
            />
            <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block"
              >Options</span
            >
          </a>
        </div>
        <div class="mt-auto flex flex-col items-center pt-4 pb-6 px-4 gap-4">
          <hr class="w-full border-t border-surface-800" />
          <a
            @click="handleLogout"
            class="cursor-pointer inline-flex items-center justify-center text-surface-400 hover:text-surface-0 transition-colors duration-150"
            title="Logout"
          >
            <i class="pi pi-sign-out text-xl" />
          </a>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      position="left"
      class="lg:hidden"
      pt:root:class="border-r! border-surface-800!"
      @hide="onDrawerHide"
    >
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full bg-surface-900">
          <div class="flex items-center justify-center shrink-0 bg-primary p-4 min-h-[4.71rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.34219 2.87829C6.19766 3.67858 5.1627 4.62478 4.26426 5.68992C7.9357 5.34906 12.6001 5.90564 18.0155 8.61335C23.7984 11.5047 28.455 11.6025 31.6958 10.9773C31.4017 10.087 31.0315 9.23135 30.593 8.41791C26.8832 8.80919 22.1272 8.29127 16.5845 5.51998C13.0648 3.76014 9.96221 3.03521 7.34219 2.87829ZM28.4259 5.33332C25.4962 2.06 21.2387 0 16.5 0C15.1084 0 13.7581 0.177686 12.4709 0.511584C14.2143 0.987269 16.0663 1.68319 18.0155 2.65781C22.0736 4.68682 25.5771 5.34013 28.4259 5.33332ZM32.3887 14.1025C28.4735 14.8756 23.067 14.7168 16.5845 11.4755C10.524 8.44527 5.70035 8.48343 2.44712 9.20639C2.2792 9.24367 2.11523 9.28287 1.95522 9.32367C1.5293 10.25 1.18931 11.2241 0.945362 12.2356C1.20591 12.166 1.47514 12.0998 1.75293 12.0381C5.69966 11.161 11.2761 11.1991 18.0155 14.5689C24.0761 17.5991 28.8997 17.561 32.1529 16.838C32.2644 16.8133 32.3742 16.7877 32.4822 16.7613C32.4941 16.509 32.5 16.2552 32.5 16C32.5 15.358 32.4622 14.7248 32.3887 14.1025ZM31.9598 20.1378C28.0826 20.8157 22.8336 20.5555 16.5845 17.431C10.524 14.4008 5.70035 14.439 2.44712 15.1619C1.725 15.3223 1.07539 15.5178 0.502344 15.7241C0.500782 15.8158 0.5 15.9078 0.5 16C0.5 24.8366 7.66344 32 16.5 32C23.9057 32 30.1362 26.9687 31.9598 20.1378Z"
                class="fill-primary-contrast"
              />
            </svg>
          </div>
          <div class="flex-1 p-4 flex flex-col gap-2">
            <RouterLink
              :to="{ name: 'dashboardIndex' }"
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-home text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Home</span>
            </RouterLink>
            <RouterLink
              :to="{ name: 'users' }"
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-users text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Team</span>
            </RouterLink>
            <RouterLink
              :to="{ name: 'designForm' }"
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-palette text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Design</span>
            </RouterLink>
            <a
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-chart-line text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Reports</span>
            </a>
            <a
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-calendar text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Events</span>
            </a>
            <a
              @click="closeCallback"
              class="w-full flex flex-row items-center cursor-pointer p-2 rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group"
            >
              <i
                class="pi pi-cog text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
              />
              <span class="ml-2 font-medium text-base leading-tight">Options</span>
            </a>
          </div>
          <div class="mt-auto flex flex-col pt-4 pb-6 px-4 gap-4">
            <hr class="w-full border-t border-surface-800" />
            <a
              @click="handleLogout"
              class="cursor-pointer inline-flex items-center gap-2 text-surface-400 hover:text-surface-0 transition-colors duration-150"
            >
              <i class="pi pi-sign-out text-xl" />
              <span class="font-medium text-base">Logout</span>
            </a>
          </div>
        </div>
      </template>
    </Drawer>
    <div class="min-h-screen flex flex-col relative flex-auto">
      <div
        class="flex justify-between items-center py-4 px-8 bg-surface-0 dark:bg-surface-900 relative lg:static border-b border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center w-full gap-4">
          <a
            @click="drawerVisible = true"
            class="cursor-pointer flex items-center justify-center lg:hidden text-surface-700 dark:text-surface-100"
          >
            <i class="pi pi-bars text-xl!" />
          </a>
          <IconField icon-position="left" class="w-full sm:w-80">
            <InputIcon
              class="pi pi-search text-base! leading-tight! text-surface-400 dark:text-surface-500"
            />
            <InputText
              type="text"
              placeholder="Search"
              class="w-full border-transparent! bg-transparent! shadow-none!"
            />
          </IconField>
        </div>
        <div class="flex items-center gap-8">
          <i
            class="pi pi-bell text-xl! leading-tight! text-surface-500 dark:text-surface-400 cursor-pointer"
          />
          <img
            src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-amyels.png"
            class="w-8 h-8 rounded-full cursor-pointer"
          />
        </div>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <ProgressSpinner />
      </div>
      <div v-else class="p-8 flex flex-col flex-auto bg-surface-0 dark:bg-surface-950">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Drawer from "primevue/drawer";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import { RouterLink } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const isLoading = ref(false);
const drawerVisible = ref(false);

async function handleLogout() {
  console.log("logout");
  await authStore.logout();
  router.push({ name: "Login" });
}

function onDrawerHide() {
  drawerVisible.value = false;
}

onBeforeMount(() => {
  isLoading.value = true;
  usersStore.fetchUsers().then(() => {
    isLoading.value = false;
    router.push({ name: "users" });
  });
});
</script>
