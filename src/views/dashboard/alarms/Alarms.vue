<template>
  <PageShell content-class="flex-1">
    <div class="mb-2 flex items-center gap-3">
      <i class="pi pi-bell text-3xl text-primary" aria-hidden="true" />
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Alarms</h1>
    </div>
    <p class="mb-6 text-surface-600 dark:text-surface-300">
      Annunciator wall. Tiles light on level change. Ack silences a tile until that metric trips
      again.
    </p>

    <Message
      v-if="connectionError"
      class="mb-6"
      severity="warn"
      data-testid="alarms.dashboard.error-message"
    >
      {{ connectionError }}
    </Message>

    <div
      v-if="!hasData && !connectionError"
      data-testid="alarms.dashboard.loading-message"
      class="bg-surface-0 dark:bg-surface-900 p-6 shadow-sm rounded-2xl flex items-center gap-3"
    >
      <ProgressSpinner style="width: 1.5rem; height: 1.5rem" />
      <span class="text-surface-500 dark:text-surface-400">Awaiting alarms…</span>
    </div>

    <div
      v-else-if="hasData"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      role="list"
      aria-label="Alarm tiles"
    >
      <article
        v-for="tile in TILES"
        :key="tile.metric"
        role="listitem"
        class="relative overflow-hidden rounded-lg border-2 p-4 flex flex-col gap-3 min-h-44 transition-opacity duration-200"
        :class="tileFaceClass(tile.metric)"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-surface-600 dark:text-surface-400"
          >
            {{ tile.label }}
          </span>
          <Tag
            v-if="alarms[tile.metric]"
            :severity="getReactorStatusSeverity(alarms[tile.metric]!.level)"
            :value="statusLabel(tile.metric)"
            :data-testid="tile.statusTestId"
          />
        </div>

        <div class="flex-1 flex items-end">
          <div
            :data-testid="tile.valueTestId"
            class="text-4xl font-mono font-bold tabular-nums leading-none"
            aria-live="polite"
            aria-atomic="true"
          >
            <template v-if="alarms[tile.metric]">
              {{ formatValue(alarms[tile.metric]!.value, tile.digits)
              }}<span
                v-if="tile.unit"
                class="ml-1 text-base font-sans font-normal text-surface-600 dark:text-surface-400"
                >{{ tile.unit }}</span
              >
            </template>
            <template v-else>—</template>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 min-h-8">
          <span
            :data-testid="tile.tsTestId"
            class="text-xs font-mono text-surface-500 dark:text-surface-400"
          >
            {{ alarms[tile.metric] ? formatRelativeTime(alarms[tile.metric]!.ts, now) : "" }}
          </span>
          <Button
            v-if="canAck(tile.metric)"
            :label="isAcked(tile.metric) ? 'Acked' : 'Ack'"
            size="small"
            :severity="getReactorStatusSeverity(alarms[tile.metric]!.level)"
            :outlined="isAcked(tile.metric)"
            :disabled="isAcked(tile.metric)"
            :data-testid="tile.ackTestId"
            @click="ack(tile.metric)"
          />
        </div>
      </article>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import Tag from "primevue/tag";
import PageShell from "@/components/layout/PageShell.vue";
import { useAlarmsMqtt } from "@/composables/useAlarmsMqtt";
import { formatLabel, formatRelativeTime } from "@/utils";
import { getReactorStatusSeverity } from "@/utils/reactor";
import type { AlarmMetric } from "@/types/alarm";

const { alarms, ackedLevel, hasData, connectionError, ack } = useAlarmsMqtt();
const now = useNow({ interval: 1000 });

const TILES = [
  {
    metric: "reactor_power",
    label: "Reactor Power",
    unit: "%",
    digits: 1,
    valueTestId: "alarms.reactor-power.value",
    statusTestId: "alarms.reactor-power.status-badge",
    ackTestId: "alarms.reactor-power.ack-btn",
    tsTestId: "alarms.reactor-power.timestamp",
  },
  {
    metric: "core_temperature",
    label: "Core Temperature",
    unit: "°C",
    digits: 1,
    valueTestId: "alarms.core-temperature.value",
    statusTestId: "alarms.core-temperature.status-badge",
    ackTestId: "alarms.core-temperature.ack-btn",
    tsTestId: "alarms.core-temperature.timestamp",
  },
  {
    metric: "reactivity",
    label: "Reactivity",
    unit: "",
    digits: 2,
    valueTestId: "alarms.reactivity.value",
    statusTestId: "alarms.reactivity.status-badge",
    ackTestId: "alarms.reactivity.ack-btn",
    tsTestId: "alarms.reactivity.timestamp",
  },
  {
    metric: "coolant_flow_rate",
    label: "Coolant Flow Rate",
    unit: "%",
    digits: 1,
    valueTestId: "alarms.coolant-flow-rate.value",
    statusTestId: "alarms.coolant-flow-rate.status-badge",
    ackTestId: "alarms.coolant-flow-rate.ack-btn",
    tsTestId: "alarms.coolant-flow-rate.timestamp",
  },
  {
    metric: "coolant_pressure",
    label: "Coolant Pressure",
    unit: "bar",
    digits: 1,
    valueTestId: "alarms.coolant-pressure.value",
    statusTestId: "alarms.coolant-pressure.status-badge",
    ackTestId: "alarms.coolant-pressure.ack-btn",
    tsTestId: "alarms.coolant-pressure.timestamp",
  },
  {
    metric: "radiation_level",
    label: "Radiation Level",
    unit: "mSv/h",
    digits: 2,
    valueTestId: "alarms.radiation-level.value",
    statusTestId: "alarms.radiation-level.status-badge",
    ackTestId: "alarms.radiation-level.ack-btn",
    tsTestId: "alarms.radiation-level.timestamp",
  },
  {
    metric: "containment_integrity",
    label: "Containment Integrity",
    unit: "%",
    digits: 1,
    valueTestId: "alarms.containment-integrity.value",
    statusTestId: "alarms.containment-integrity.status-badge",
    ackTestId: "alarms.containment-integrity.ack-btn",
    tsTestId: "alarms.containment-integrity.timestamp",
  },
] as const satisfies ReadonlyArray<{
  metric: AlarmMetric;
  label: string;
  unit: string;
  digits: number;
  valueTestId: string;
  statusTestId: string;
  ackTestId: string;
  tsTestId: string;
}>;

function isAcked(metric: AlarmMetric): boolean {
  const alarm = alarms[metric];
  return !!alarm && ackedLevel[metric] === alarm.level;
}

function canAck(metric: AlarmMetric): boolean {
  const alarm = alarms[metric];
  return !!alarm && alarm.level !== "normal";
}

function statusLabel(metric: AlarmMetric): string {
  const alarm = alarms[metric];
  if (!alarm) {
    return "";
  }
  const base = formatLabel(alarm.level);
  return isAcked(metric) ? `${base} · acked` : base;
}

function formatValue(value: number, digits: number): string {
  return value.toFixed(digits);
}

function tileFaceClass(metric: AlarmMetric): string {
  const alarm = alarms[metric];
  const acked = isAcked(metric);
  const level = alarm?.level ?? "normal";

  const faces: Record<string, string> = {
    normal: "bg-success-100/70 dark:bg-success-950/40 border-success-300 dark:border-success-800",
    warning: "bg-warn-100 dark:bg-warn-950/50 border-warn-400 dark:border-warn-700",
    danger: "bg-danger-100 dark:bg-danger-950/50 border-danger-400 dark:border-danger-700",
  };

  const pulse =
    !acked && (level === "warning" || level === "danger") ? "motion-safe:animate-pulse" : "";
  const dim = acked ? "opacity-55" : "";

  return [faces[level], pulse, dim].filter(Boolean).join(" ");
}
</script>
