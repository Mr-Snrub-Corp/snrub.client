<template>
  <PageShell content-class="h-screen overflow-y-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
        Create Incident Report
      </h1>
    </div>

    <div class="bg-surface-0 dark:bg-surface-900 p-7 shadow rounded-2xl flex-auto xl:w-3/4">
      <div class="flex flex-col gap-7">
        <div class="text-xl font-medium text-surface-900 dark:text-surface-0">Details</div>

        <div class="flex flex-col gap-6">
          <FormField
            class="md:w-3/4"
            label="Incident Type *"
            input-id="incidentType"
            error-id="incidentType-error"
            :field="v$.incident_type_id"
          >
            <Select
              id="incidentType"
              v-model="formData.incident_type_id"
              :options="incidentTypesStore.getAllIncidentTypes"
              option-label="name"
              option-value="uid"
              placeholder="Select incident type"
              class="w-full"
              data-testid="incidents.create-form.incident-type-select"
              :invalid="v$.incident_type_id.$error"
              :aria-invalid="v$.incident_type_id.$error"
              :aria-describedby="v$.incident_type_id.$error ? 'incidentType-error' : undefined"
              @blur="v$.incident_type_id.$touch()"
            />
          </FormField>

          <FormField
            class="md:w-3/4"
            label="Occurred At *"
            input-id="occurredAt"
            error-id="occurredAt-error"
            :field="v$.occurred_at"
          >
            <DatePicker
              id="occurredAt"
              v-model="formData.occurred_at"
              showTime
              class="w-full"
              :invalid="v$.occurred_at.$error"
              :aria-invalid="v$.occurred_at.$error"
              :aria-describedby="v$.occurred_at.$error ? 'occurredAt-error' : undefined"
              @blur="v$.occurred_at.$touch()"
            />
          </FormField>

          <FormField
            label="Description"
            input-id="description"
            error-id="description-error"
            :field="v$.description"
          >
            <Textarea
              id="description"
              v-model="formData.description"
              rows="5"
              auto-resize
              class="w-full"
              :invalid="v$.description.$error"
              :aria-invalid="v$.description.$error"
              :aria-describedby="v$.description.$error ? 'description-error' : undefined"
              @blur="v$.description.$touch()"
            />
          </FormField>

          <FormField
            class="md:w-3/4"
            label="Severity *"
            input-id="severity"
            error-id="severity-error"
            :field="v$.severity"
          >
            <InputNumber
              id="severity"
              v-model="formData.severity"
              :min="1"
              :max="7"
              show-buttons
              class="w-full"
              :invalid="v$.severity.$error"
              :aria-invalid="v$.severity.$error"
              :aria-describedby="v$.severity.$error ? 'severity-error' : undefined"
              @blur="v$.severity.$touch()"
            />
          </FormField>
        </div>

        <IncidentReportSubjects
          :subjects="formData.subjects"
          v-model:show-add-subject="showAddSubject"
          v-model:new-subject="newSubject"
          :subject-role-options="subjectRoleOptions"
          :available-users="availableUsers"
          :get-subject-name="getSubjectName"
          @add="addSubject"
          @remove="removeSubject"
        />

        <!-- Actions -->
        <div class="flex gap-3">
          <Button
            label="Create Report"
            severity="primary"
            data-testid="incidents.create-form.submit-btn"
            :disabled="v$.$invalid"
            @click="handleSubmit"
          />
          <Button
            label="Cancel"
            severity="secondary"
            variant="outlined"
            data-testid="incidents.create-form.cancel-btn"
            @click="handleCancel"
          />
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import DatePicker from "primevue/datepicker";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useIncidentReportsStore } from "@/stores/incidentReports";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import { useIncidentReportSubjects } from "@/composables/useIncidentReportSubjects";
import IncidentReportSubjects from "@/components/incidents/IncidentReportSubjects.vue";
import FormField from "@/components/form/FormField.vue";
import PageShell from "@/components/layout/PageShell.vue";
import type { IncidentReportSubjectCreate } from "@/types/incidentReport";
import { useToast } from "primevue/usetoast";
import { TOAST_LIFE } from "@/constants/toast";

const router = useRouter();
const toast = useToast();

const incidentReportsStore = useIncidentReportsStore();
const incidentTypesStore = useIncidentTypesStore();

const formData = ref<{
  incident_type_id: string;
  occurred_at: Date | null;
  description: string;
  severity: number;
  subjects: IncidentReportSubjectCreate[];
}>({
  incident_type_id: "",
  occurred_at: null,
  description: "",
  severity: 1,
  subjects: [],
});

const {
  showAddSubject,
  newSubject,
  subjectRoleOptions,
  availableUsers,
  getSubjectName,
  addSubject,
  removeSubject,
  sharedRules,
} = useIncidentReportSubjects(formData);

const rules = {
  ...sharedRules,
  incident_type_id: {
    required: helpers.withMessage("Incident type is required", required),
  },
  occurred_at: {
    required: helpers.withMessage("Occurred at is required", required),
  },
};

const v$ = useVuelidate(rules, formData);

async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  try {
    const response = await incidentReportsStore.createIncidentReport({
      incident_type_id: formData.value.incident_type_id,
      occurred_at: formData.value.occurred_at!.toISOString(),
      description: formData.value.description || null,
      severity: formData.value.severity,
      subjects: formData.value.subjects,
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Incident report created",
      life: TOAST_LIFE,
    });
    router.push({ name: "incidentReportDetail", params: { uid: response.uid } });
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong creating incident report",
      life: TOAST_LIFE,
    });
  }
}

function handleCancel() {
  router.push({ name: "incidentReports" });
}
</script>

<style scoped></style>
