import { computed, ref, type Ref } from "vue";
import { maxLength, between, required, helpers } from "@vuelidate/validators";
import { SUBJECT_ROLE } from "@/constants/enums";
import { MAX_LENGTH } from "@/constants/validation";
import { useUsersStore } from "@/stores/users";
import type { SubjectRole, IncidentReportSubjectCreate } from "@/types/incidentReport";
import { formatLabel } from "@/utils";

export function useIncidentReportSubjects(
  formData: Ref<{ subjects: IncidentReportSubjectCreate[] }>,
) {
  const usersStore = useUsersStore();

  const showAddSubject = ref(false);
  const newSubject = ref<{ user_id: string; role: SubjectRole | "" }>({
    user_id: "",
    role: "",
  });

  const subjectRoleOptions = Object.values(SUBJECT_ROLE).map((r) => ({
    label: formatLabel(r),
    value: r,
  }));

  const availableUsers = computed(() => {
    const existingUserIds = formData.value.subjects.map((s) => s.user_id);
    return usersStore.getAllUsers.filter((u) => !existingUserIds.includes(u.uid));
  });

  function getSubjectName(userId: string): string {
    const user = usersStore.getUserById(userId);
    return user?.name ?? userId;
  }

  function addSubject() {
    if (!newSubject.value.user_id || !newSubject.value.role) return;
    formData.value.subjects.push({
      user_id: newSubject.value.user_id,
      role: newSubject.value.role as SubjectRole,
    });
    newSubject.value = { user_id: "", role: "" };
    showAddSubject.value = false;
  }

  function removeSubject(index: number) {
    formData.value.subjects.splice(index, 1);
  }

  const sharedRules = {
    description: {
      maxLength: helpers.withMessage(
        `Description must not exceed ${MAX_LENGTH.REPORT_DESCRIPTION} characters`,
        maxLength(MAX_LENGTH.REPORT_DESCRIPTION),
      ),
    },
    severity: {
      required: helpers.withMessage("Severity is required", required),
      between: helpers.withMessage("Severity must be between 1 and 7", between(1, 7)),
    },
  };

  return {
    showAddSubject,
    newSubject,
    subjectRoleOptions,
    availableUsers,
    getSubjectName,
    addSubject,
    removeSubject,
    sharedRules,
  };
}
