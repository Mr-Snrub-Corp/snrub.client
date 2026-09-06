<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="text-xl font-medium text-surface-900 dark:text-surface-0">Subjects</div>
      <Button
        v-if="!showAddSubject"
        label="Add Subject"
        icon="pi pi-plus"
        variant="text"
        severity="secondary"
        data-testid="incidents.subjects.add-btn"
        @click="$emit('update:showAddSubject', true)"
      />
    </div>

    <div
      v-for="(subject, index) in subjects"
      :key="subject.user_id"
      class="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 p-4"
    >
      <div class="text-surface-900 dark:text-surface-0">
        {{ getSubjectName(subject.user_id) }}
      </div>
      <div class="flex items-center gap-2">
        <Tag :value="formatLabel(subject.role)" severity="info" />
        <Button
          icon="pi pi-times"
          :aria-label="`Remove ${getSubjectName(subject.user_id)}`"
          severity="danger"
          variant="text"
          rounded
          data-testid="incidents.subjects.remove-btn"
          @click="$emit('remove', index)"
        />
      </div>
    </div>

    <div v-if="!subjects.length" class="text-sm text-zinc-500 dark:text-zinc-400">
      No subjects added
    </div>

    <div v-if="showAddSubject" class="flex items-end gap-3">
      <div class="flex flex-col gap-2 flex-1">
        <label :for="`${idPrefix}-user`" class="text-sm text-surface-900 dark:text-surface-0"
          >User</label
        >
        <Select
          :id="`${idPrefix}-user`"
          :model-value="newSubject.user_id"
          :options="availableUsers"
          option-label="name"
          option-value="uid"
          placeholder="Select user"
          filter
          class="w-full"
          data-testid="incidents.subjects.user-select"
          @update:model-value="updateNewSubject('user_id', $event)"
        />
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <label :for="`${idPrefix}-role`" class="text-sm text-surface-900 dark:text-surface-0"
          >Role</label
        >
        <Select
          :id="`${idPrefix}-role`"
          :model-value="newSubject.role"
          :options="subjectRoleOptions"
          option-label="label"
          option-value="value"
          placeholder="Select role"
          class="w-full"
          data-testid="incidents.subjects.role-select"
          @update:model-value="updateNewSubject('role', $event)"
        />
      </div>
      <Button
        label="Add"
        icon="pi pi-plus"
        severity="secondary"
        data-testid="incidents.subjects.confirm-add-btn"
        :disabled="!newSubject.user_id || !newSubject.role"
        @click="$emit('add')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import Select from "primevue/select";
import Tag from "primevue/tag";
import type { User } from "@/types/user";
import type { IncidentReportSubjectCreate, SubjectRole } from "@/types/incidentReport";
import { formatLabel } from "@/utils";

export type NewSubjectDraft = { user_id: string; role: SubjectRole | "" };

const props = withDefaults(
  defineProps<{
    subjects: IncidentReportSubjectCreate[];
    showAddSubject: boolean;
    newSubject: NewSubjectDraft;
    subjectRoleOptions: { label: string; value: SubjectRole }[];
    availableUsers: User[];
    getSubjectName: (userId: string) => string;
    idPrefix?: string;
  }>(),
  { idPrefix: "subject" },
);

const emit = defineEmits<{
  "update:showAddSubject": [value: boolean];
  "update:newSubject": [value: NewSubjectDraft];
  add: [];
  remove: [index: number];
}>();

function updateNewSubject(key: keyof NewSubjectDraft, value: string) {
  emit("update:newSubject", { ...props.newSubject, [key]: value });
}
</script>
