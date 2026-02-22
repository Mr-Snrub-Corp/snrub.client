<template>
  <div
    id="app-sidebar"
    class="bg-surface-900 h-screen hidden lg:block shrink-0 absolute lg:static left-0 top-0 z-10 lg:w-28 w-72 select-none"
  >
    <div class="flex flex-col h-full">
      <div
        class="flex items-center justify-center shrink-0 bg-primary p-4 border-r border-primary min-h-[4.71rem]"
      >
        <RouterLink to="/dashboard">
          <DashboardLogo />
        </RouterLink>
      </div>
      <div class="flex-1 p-4 flex flex-col items-center gap-2 border-r border-surface-800">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
        >
          <i
            :class="item.icon"
            class="text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
          />
          <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block">{{
            item.label
          }}</span>
        </RouterLink>
        <a
          v-for="item in placeholderItems"
          :key="item.label"
          class="w-full flex flex-row lg:flex-col items-center cursor-pointer p-2 lg:justify-center rounded-lg text-surface-400 border border-transparent hover:bg-surface-800 hover:border-surface-700 hover:text-surface-0 transition-colors duration-150 group lg:gap-2"
        >
          <i
            :class="item.icon"
            class="text-xl! leading-tight! text-surface-400 group-hover:text-surface-0"
          />
          <span class="ml-2 lg:ml-0 font-medium text-base lg:text-sm leading-tight lg:block">{{
            item.label
          }}</span>
        </a>
      </div>
      <div class="mt-auto flex flex-col items-center pt-4 pb-6 px-4 gap-4">
        <hr class="w-full border-t border-surface-800" />
        <a
          @click="$emit('logout')"
          class="cursor-pointer inline-flex items-center justify-center text-surface-400 hover:text-surface-0 transition-colors duration-150"
          title="Logout"
        >
          <i class="pi pi-sign-out text-xl" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import DashboardLogo from "./DashboardLogo.vue";
import { navItems, placeholderItems } from "./navItems";

defineEmits<{
  logout: [];
}>();
</script>
