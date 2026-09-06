<template>
  <div
    class="px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8 bg-surface-50 dark:bg-surface-950"
    :class="contentClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contentClass?: string;
}>();
</script>
