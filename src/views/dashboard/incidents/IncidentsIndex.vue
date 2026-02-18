<template>
  <div v-if="isLoading" class="flex justify-center items-center h-full">
    <ProgressSpinner />
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import ProgressSpinner from "primevue/progressspinner";

const incidentTypesStore = useIncidentTypesStore();
const isLoading = ref(true);

onMounted(async () => {
  await incidentTypesStore.fetchIncidentTypes();
  isLoading.value = false;
});
</script>
