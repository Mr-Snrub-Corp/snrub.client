<template>
  <div class="p-6 md:p-12 lg:p-20 bg-surface-50 dark:bg-surface-950 h-screen">
    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Incident Reports</h1>
  </div>
</template>

<script setup lang="ts">
import { useIncidentReportsStore } from "@/stores/incidentReports";
import { onBeforeMount, ref } from "vue";

const incidentReportsStore = useIncidentReportsStore();

const isLoading = ref(true);
const incidentReports = ref<Report[]>([]);

onBeforeMount(async () => {
  await incidentReportsStore.fetchIncidentReports({
    offset: incidentReports.value.length,
    limit: 20,
  });
  isLoading.value = false;
});
</script>

<style scoped></style>
