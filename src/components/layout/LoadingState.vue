<template>
  <div v-if="loading" class="flex justify-center py-20">
    <ProgressSpinner />
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";

defineProps<{
  loading: boolean;
}>();
</script>
