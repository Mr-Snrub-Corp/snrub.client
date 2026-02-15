<template>
  <div class="p-6 md:p-12 lg:p-20 bg-surface-50 dark:bg-surface-950 h-screen">
    <!-- Header with Add User Button -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Incidents</h1>
      <div class="flex gap-2">
        <Button
          variant="outlined"
          label="Incident Types"
          icon="pi pi-book"
          @click="router.push({ name: 'incidentTypes' })"
          severity="primary"
        />
        <Button
          v-if="authStore.isAdmin"
          variant="outlined"
          label="Incident Reports"
          icon="pi pi-exclamation-triangle"
          @click="router.push({ name: 'incidentReports' })"
          severity="primary"
        />
      </div>
    </div>

    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow-sm rounded-2xl flex flex-col gap-8">
      <div class="flex items-center">
        <div class="text-xl font-medium text-surface-900 dark:text-surface-0 leading-tight">
          Recent Incidents
        </div>
      </div>

      <div v-if="isLoading">
        <ProgressSpinner />
      </div>
      <div v-else class="flex flex-col gap-4">
        <RouterLink
          :to="{ name: 'incidentReportDetail', params: { uid: item.uid } }"
          v-for="(item, index) in enrichedReports"
          :key="index"
          class="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
        >
          <div class="sm:block hidden w-3.5 h-[75px]" :class="getStatusColorClass(item.status)" />
          <div class="flex flex-1 sm:items-center justify-between p-4 gap-4">
            <div class="flex flex-col gap-2">
              <div class="text-xl font-medium text-surface-900 dark:text-surface-0 leading-tight">
                {{ item.incidentType.name }}
              </div>
              <div class="text-base text-zinc-500 dark:text-zinc-400 leading-tight">
                Due {{ item.occurred_at }}
              </div>
            </div>
            <div class="flex sm:flex-row flex-col sm:items-center gap-4">
              <Tag :severity="getTagSeverity(item.status)" :value="item.status" />
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import { useIncidentReportsStore } from "@/stores/incidentReports";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import type { EnrichedReport } from "@/types/incidentReport";
import { INCIDENT_STATUS } from "@/constants/enums";

const router = useRouter();

const incidentTypesStore = useIncidentTypesStore();
const incidentReportsStore = useIncidentReportsStore();
const authStore = useAuthStore();

const isLoading = ref(true);

const enrichedReports = computed<EnrichedReport[]>(() =>
  incidentReportsStore.getAllIncidentReports.map((report) => ({
    ...report,
    incidentType: incidentTypesStore.getIncidentTypeById(report.incident_type_id),
  })),
);

const getStatusColorClass = (status: string) => {
  switch (status) {
    case INCIDENT_STATUS.REPORTED:
      return "bg-blue-500";
    case INCIDENT_STATUS.UNDER_REVIEW:
      return "bg-surface-500";
    case INCIDENT_STATUS.FALSE_ALARM:
      return "bg-red-500";
    case INCIDENT_STATUS.CONTAINED:
      return "bg-success-500";
    case INCIDENT_STATUS.MITIGATION_IN_PROGRESS:
      return "bg-warn-500";
    case INCIDENT_STATUS.RESOLVED:
      return "bg-success-500";
    case INCIDENT_STATUS.CLOSED:
      return "bg-success-500";
    default:
      return "bg-gray-500";
  }
};

const getTagSeverity = (status: string) => {
  switch (status) {
    case "REPORTED":
      return "warn";
    case "UNDER_REVIEW":
      return "warn";
    case "FALSE_ALARM":
      return "info";
    case "CONTAINED":
      return "success";
    case "MITIGATION_IN_PROGRESS":
      return "warn";
    case "RESOLVED":
      return "success";
    default:
      return "info";
  }
};

onMounted(async () => {
  isLoading.value = true;
  await incidentReportsStore.fetchIncidentReports({ status: [INCIDENT_STATUS.REPORTED], limit: 5 });
  isLoading.value = false;
});
</script>

<style scoped></style>
