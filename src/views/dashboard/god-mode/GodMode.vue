<template>
  <PageShell content-class="h-screen overflow-y-auto">
    <div v-if="authStore.isSuperAdmin" data-testid="god-mode.dashboard.root">
      <div class="mb-2 flex items-center gap-3">
        <i class="pi pi-bolt text-3xl text-primary" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">God Mode</h1>
      </div>
      <p class="mb-6 text-surface-600 dark:text-surface-300">
        Steer reactor telemetry directly. Each lever drives a malfunction incident; its position
        sets the impact intensity. Set a lever to <b>Off</b> to clear it.
      </p>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card v-for="lever in LEVERS" :key="lever.key" class="lever-card">
          <template #title>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <i :class="[lever.icon, 'text-xl text-primary']" aria-hidden="true" />
                <span class="text-lg font-semibold">{{ lever.label }}</span>
              </div>
              <Tag
                :value="statusFor(lever.key).active ? 'Active' : 'Off'"
                :severity="statusFor(lever.key).active ? 'danger' : 'secondary'"
                :data-testid="`god-mode.${lever.key}.state-tag`"
              />
            </div>
          </template>
          <template #subtitle>
            <span class="text-surface-500 dark:text-surface-400 text-sm">
              {{ lever.incidentTypeCode }}
            </span>
          </template>
          <template #content>
            <div class="flex flex-col gap-3">
              <Select
                :model-value="positions[lever.key]"
                :options="STATUS_OPTIONS"
                option-label="label"
                option-value="value"
                class="w-full"
                :aria-label="`${lever.label} intensity`"
                :data-testid="`god-mode.${lever.key}.position-select`"
                @update:model-value="(value: IncidentStatus) => onChange(lever.key, value)"
              />
              <div class="flex items-center justify-between text-sm">
                <span class="text-surface-500 dark:text-surface-400">Intensity</span>
                <span
                  class="font-mono font-semibold text-surface-900 dark:text-surface-0"
                  :data-testid="`god-mode.${lever.key}.intensity`"
                >
                  {{ statusFor(lever.key).intensity.toFixed(2) }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import Card from "primevue/card";
import Select from "primevue/select";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";
import PageShell from "@/components/layout/PageShell.vue";
import { useAuthStore } from "@/stores/auth";
import { useGodModeStore } from "@/stores/godMode";
import { GOD_MODE_LEVER, type GodModeLever, type LeverState } from "@/types/godMode";
import type { IncidentStatus } from "@/types/incidentReport";
import { INCIDENT_STATUS } from "@/constants/enums";
import { TOAST_LIFE } from "@/constants/toast";

const authStore = useAuthStore();
const godModeStore = useGodModeStore();
const toast = useToast();

// Off maps to "resolved" (STATUS_WEIGHT 0.0). Positions ordered by ascending intensity.
const OFF_STATUS: IncidentStatus = INCIDENT_STATUS.RESOLVED;

const STATUS_OPTIONS: { label: string; value: IncidentStatus }[] = [
  { label: "Off", value: INCIDENT_STATUS.RESOLVED },
  { label: "Contained (0.2)", value: INCIDENT_STATUS.CONTAINED },
  { label: "Reported (0.3)", value: INCIDENT_STATUS.REPORTED },
  { label: "Mitigation (0.5)", value: INCIDENT_STATUS.MITIGATION_IN_PROGRESS },
  { label: "Under Review (0.6)", value: INCIDENT_STATUS.UNDER_REVIEW },
  { label: "Confirmed (1.0)", value: INCIDENT_STATUS.CONFIRMED },
];

const LEVERS: {
  key: GodModeLever;
  label: string;
  icon: string;
  incidentTypeCode: string;
}[] = [
  {
    key: GOD_MODE_LEVER.COOLANT_FLOW,
    label: "Coolant Flow",
    icon: "pi pi-filter",
    incidentTypeCode: "coolant_flow_reduction",
  },
  {
    key: GOD_MODE_LEVER.CONTROL_ROD,
    label: "Control Rod Anomaly",
    icon: "pi pi-sliders-v",
    incidentTypeCode: "control_rod_anomaly",
  },
  {
    key: GOD_MODE_LEVER.PRIMARY_COOLANT_LOSS,
    label: "Primary Coolant Loss",
    icon: "pi pi-tint",
    incidentTypeCode: "primary_coolant_loss",
  },
  {
    key: GOD_MODE_LEVER.STEAM_PRESSURE,
    label: "Steam Pressure",
    icon: "pi pi-gauge",
    incidentTypeCode: "steam_pressure_anomaly",
  },
  {
    key: GOD_MODE_LEVER.XENON,
    label: "Xenon Buildup",
    icon: "pi pi-cloud",
    incidentTypeCode: "xenon_poisoning_instability",
  },
];

// Local model of each Select's position (defaults to Off).
const positions = reactive<Record<string, IncidentStatus>>(
  Object.fromEntries(LEVERS.map((l) => [l.key, OFF_STATUS])),
);

function statusFor(lever: GodModeLever): LeverState {
  return (
    godModeStore.getLeverState(lever) ?? {
      lever,
      incident_type_code: "",
      active: false,
      status: null,
      intensity: 0,
      report_uid: null,
    }
  );
}

async function onChange(lever: GodModeLever, status: IncidentStatus) {
  positions[lever] = status;
  try {
    const result = await godModeStore.setLever(lever, status);
    // Reflect server truth: an inactive lever snaps back to Off.
    positions[lever] = result.active && result.status ? result.status : OFF_STATUS;
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to set lever",
      life: TOAST_LIFE,
    });
    // Restore from store state on failure.
    positions[lever] = statusFor(lever).status ?? OFF_STATUS;
  }
}

onBeforeMount(async () => {
  try {
    await godModeStore.fetchLevers();
    for (const lever of LEVERS) {
      const state = statusFor(lever.key);
      positions[lever.key] = state.active && state.status ? state.status : OFF_STATUS;
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load levers",
      life: TOAST_LIFE,
    });
  }
});
</script>

<style scoped></style>
