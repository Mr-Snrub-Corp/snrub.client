<template>
  <div class="p-6 md:p-12 lg:p-20 bg-surface-50 dark:bg-surface-950 min-h-full overflow-hidden">
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
        <div
          v-for="item in enrichedReports"
          :key="item.uid"
          class="flex items-center rounded-xl border overflow-hidden border-zinc-200 dark:border-zinc-700"
        >
          <div
            class="sm:block hidden w-3.5 self-stretch"
            :class="getSeverityClass(item.severity)"
          />
          <div class="flex items-center justify-between w-full p-4 gap-4 min-w-0">
            <div class="shrink-0">
              <div class="flex flex-col gap-1">
                <div class="text-lg font-medium text-surface-900 dark:text-surface-0 leading-tight">
                  {{ item.incidentType.name }}
                </div>
                <div class="text-sm text-zinc-500 dark:text-zinc-400 leading-tight">
                  {{ formatDate(item.occurred_at) }}
                </div>
              </div>
            </div>
            <div class="basis-1/2 min-w-0 text-surface-600 line-clamp-2">
              {{ item.description }}
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <span class="font-semibold">Severity</span>
              <SeverityBadge :severity="item.severity" />
              <Tag :severity="getTagSeverity(item.status)" :value="formatLabel(item.status)" />
              <Tag
                :severity="getEscalationSeverity(item.escalation_level)"
                :value="formatLabel(item.escalation_level)"
              />
              <Button
                icon="pi pi-eye"
                severity="secondary"
                variant="text"
                rounded
                @click="router.push({ name: 'incidentReportDetail', params: { uid: item.uid } })"
              />
            </div>
          </div>
        </div>
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
import SeverityBadge from "@/components/SeverityBadge.vue";
import type { EnrichedReport } from "@/types/incidentReport";
import { INCIDENT_STATUS } from "@/constants/enums";
import { formatDate, formatLabel } from "@/utils";
import { getTagSeverity, getEscalationSeverity, getSeverityClass } from "@/utils/incident";

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

onMounted(async () => {
  isLoading.value = true;
  await incidentReportsStore.fetchIncidentReports({ status: [INCIDENT_STATUS.REPORTED], limit: 5 });
  isLoading.value = false;
});
</script>

<style scoped></style>
