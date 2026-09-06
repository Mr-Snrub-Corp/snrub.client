<template>
  <PageShell content-class="h-screen overflow-y-auto">
    <LoadingState :loading="isLoading">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
          Edit Incident Report
        </h1>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 p-7 shadow rounded-2xl flex-auto xl:w-3/4">
        <div class="flex flex-col gap-7">
          <div class="text-xl font-medium text-surface-900 dark:text-surface-0">Details</div>

          <div class="flex flex-col gap-6">
            <FormField
              label="Description"
              input-id="description"
              error-id="edit-description-error"
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
                :aria-describedby="v$.description.$error ? 'edit-description-error' : undefined"
                @blur="v$.description.$touch()"
              />
            </FormField>

            <FormField
              class="md:w-3/4"
              label="Severity"
              input-id="severity"
              error-id="edit-severity-error"
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
                :aria-describedby="v$.severity.$error ? 'edit-severity-error' : undefined"
                @blur="v$.severity.$touch()"
              />
            </FormField>

            <FormField
              class="md:w-3/4"
              label="Status"
              input-id="status"
              error-id="edit-status-error"
              :field="v$.status"
            >
              <Select
                id="status"
                v-model="formData.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                :invalid="v$.status.$error"
                :aria-invalid="v$.status.$error"
                :aria-describedby="v$.status.$error ? 'edit-status-error' : undefined"
                @blur="v$.status.$touch()"
              />
            </FormField>

            <FormField
              class="md:w-3/4"
              label="Escalation Level"
              input-id="escalationLevel"
              error-id="edit-escalation-error"
              :field="v$.escalation_level"
            >
              <Select
                id="escalationLevel"
                v-model="formData.escalation_level"
                :options="escalationLevelOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                :invalid="v$.escalation_level.$error"
                :aria-invalid="v$.escalation_level.$error"
                :aria-describedby="v$.escalation_level.$error ? 'edit-escalation-error' : undefined"
                @blur="v$.escalation_level.$touch()"
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
            id-prefix="edit-subject"
            @add="addSubject"
            @remove="removeSubject"
          />

          <!-- Actions -->
          <div class="flex gap-3">
            <Button
              data-testid="incidents.edit-form.update-btn"
              label="Update Report"
              severity="primary"
              :disabled="v$.$invalid"
              @click="handleSubmit"
            />
            <Button
              data-testid="incidents.edit-form.cancel-btn"
              label="Cancel"
              severity="secondary"
              variant="outlined"
              @click="handleCancel"
            />
          </div>
        </div>
      </div>
    </LoadingState>
  </PageShell>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { INCIDENT_STATUS, ESCALATION_LEVEL } from "@/constants/enums";
import { useIncidentReportsStore } from "@/stores/incidentReports";
import { useIncidentReportSubjects } from "@/composables/useIncidentReportSubjects";
import IncidentReportSubjects from "@/components/incidents/IncidentReportSubjects.vue";
import FormField from "@/components/form/FormField.vue";
import LoadingState from "@/components/layout/LoadingState.vue";
import PageShell from "@/components/layout/PageShell.vue";
import { enumToSelectOptions } from "@/utils";
import type {
  IncidentStatus,
  EscalationLevel,
  IncidentReportSubjectCreate,
} from "@/types/incidentReport";
import { useToast } from "primevue/usetoast";
import { TOAST_LIFE } from "@/constants/toast";

const route = useRoute();
const router = useRouter();
const uid = route.params.uid as string;
const toast = useToast();

const incidentReportsStore = useIncidentReportsStore();

const isLoading = ref(false);

const formData = ref<{
  description: string;
  severity: number;
  status: IncidentStatus;
  escalation_level: EscalationLevel;
  subjects: IncidentReportSubjectCreate[];
}>({
  description: "",
  severity: 1,
  status: INCIDENT_STATUS.REPORTED,
  escalation_level: ESCALATION_LEVEL.NONE,
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

// Options
const statusOptions = enumToSelectOptions(INCIDENT_STATUS);

const escalationLevelOptions = enumToSelectOptions(ESCALATION_LEVEL);

// Validation
const rules = {
  ...sharedRules,
  status: {
    required: helpers.withMessage("Status is required", required),
  },
  escalation_level: {
    required: helpers.withMessage("Escalation level is required", required),
  },
};

const v$ = useVuelidate(rules, formData);

// Initialize form from store
function initFormData() {
  const report = incidentReportsStore.getIncidentReportById(uid);
  if (report) {
    formData.value = {
      description: report.description ?? "",
      severity: report.severity,
      status: report.status,
      escalation_level: report.escalation_level,
      subjects: report.subjects.map((s) => ({
        user_id: s.user_id,
        role: s.role,
      })),
    };
  }
}

// Submit
async function handleSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await incidentReportsStore.updateIncidentReport(uid, {
      description: formData.value.description || null,
      severity: formData.value.severity,
      status: formData.value.status,
      escalation_level: formData.value.escalation_level,
      subjects: formData.value.subjects,
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Incident report has been successfully updated",
      life: TOAST_LIFE,
    });
    router.push({ name: "incidentReportDetail", params: { uid } });
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong with incident report update",
      life: TOAST_LIFE,
    });
  }
}

function handleCancel() {
  router.push({ name: "incidentReportDetail", params: { uid } });
}

onMounted(async () => {
  isLoading.value = true;
  await incidentReportsStore.fetchIncidentReportById(uid);
  initFormData();
  isLoading.value = false;
});
</script>

<style scoped></style>
