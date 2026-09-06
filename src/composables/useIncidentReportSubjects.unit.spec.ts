import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { ref } from "vue";
import { USER_ROLES, USER_STATUS, SUBJECT_ROLE } from "@/constants/enums";
import type { User } from "@/types/user";
import type { IncidentReportSubjectCreate } from "@/types/incidentReport";
import { useIncidentReportSubjects } from "./useIncidentReportSubjects";
import { useUsersStore } from "@/stores/users";
import { MAX_LENGTH } from "@/constants/validation";

// httpService is imported transitively via useUsersStore — mock it to prevent
// fetch calls during tests.
vi.mock("@/services/httpService", () => ({
  default: {
    users: {
      create: vi.fn(),
      get: vi.fn(),
      getOne: vi.fn(),
      updateOne: vi.fn(),
      deleteOne: vi.fn(),
      uploadPhoto: vi.fn(),
    },
  },
}));

// --- Fixtures ---

const mockUserAlice: User = {
  uid: "u1",
  email: "alice@example.com",
  name: "Alice",
  role: USER_ROLES.ADMIN,
  status: USER_STATUS.ACTIVE,
};

const mockUserBob: User = {
  uid: "u2",
  email: "bob@example.com",
  name: "Bob",
  role: USER_ROLES.VIEWER,
  status: USER_STATUS.ACTIVE,
};

// Factory — creates a reactive formData ref with an optional subjects seed.
function makeFormData(subjects: IncidentReportSubjectCreate[] = []) {
  return ref({ subjects });
}

// Convenience: mount the composable with a pre-seeded users store.
function setup(subjects: IncidentReportSubjectCreate[] = []) {
  const usersStore = useUsersStore();
  usersStore.users = [mockUserAlice, mockUserBob];
  const formData = makeFormData(subjects);
  const composable = useIncidentReportSubjects(formData);
  return { composable, formData, usersStore };
}

describe("useIncidentReportSubjects", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // --- availableUsers ---

  describe("availableUsers", () => {
    it("returns all users when no subjects have been added", () => {
      const { composable } = setup();

      expect(composable.availableUsers.value).toEqual([mockUserAlice, mockUserBob]);
    });

    it("excludes users already added as subjects", () => {
      const { composable } = setup([{ user_id: "u1", role: SUBJECT_ROLE.RESPONSIBLE }]);

      expect(composable.availableUsers.value).toEqual([mockUserBob]);
    });

    it("updates when a subject is added after setup", () => {
      const { composable, formData } = setup();

      expect(composable.availableUsers.value).toEqual([mockUserAlice, mockUserBob]);
      formData.value.subjects.push({ user_id: "u1", role: SUBJECT_ROLE.RESPONSIBLE });
      expect(composable.availableUsers.value).toEqual([mockUserBob]);
    });

    it("returns an empty array when the users store is empty", () => {
      const { composable, usersStore } = setup();
      usersStore.users = [];

      expect(composable.availableUsers.value).toEqual([]);
    });
  });

  // --- getSubjectName ---

  describe("getSubjectName", () => {
    it("returns the user's name when the uid exists in the store", () => {
      const { composable } = setup();

      expect(composable.getSubjectName(mockUserAlice.uid)).toBe(mockUserAlice.name);
    });

    it("falls back to the raw userId string when the user is not found", () => {
      const { composable } = setup();

      expect(composable.getSubjectName("missing-uid")).toBe("missing-uid");
    });
  });

  // --- addSubject ---

  describe("addSubject", () => {
    it("appends subject to formData and resets newSubject", () => {
      const { composable, formData } = setup();

      composable.showAddSubject.value = true;
      composable.newSubject.value = { user_id: "u1", role: SUBJECT_ROLE.WITNESS };
      composable.addSubject();

      expect(formData.value.subjects).toEqual([{ user_id: "u1", role: SUBJECT_ROLE.WITNESS }]);
      expect(composable.newSubject.value).toEqual({ user_id: "", role: "" });
      expect(composable.showAddSubject.value).toBe(false);
    });

    it("does nothing when user_id is empty", () => {
      const { composable, formData } = setup();

      composable.showAddSubject.value = true;
      composable.newSubject.value = { user_id: "", role: SUBJECT_ROLE.WITNESS };
      composable.addSubject();

      expect(formData.value.subjects).toEqual([]);
      expect(composable.newSubject.value).toEqual({ user_id: "", role: SUBJECT_ROLE.WITNESS });
      expect(composable.showAddSubject.value).toBe(true);
    });

    it("does nothing when role is empty", () => {
      const { composable, formData } = setup();

      composable.showAddSubject.value = true;
      composable.newSubject.value = { user_id: "u1", role: "" };
      composable.addSubject();

      expect(formData.value.subjects).toEqual([]);
      expect(composable.newSubject.value).toEqual({ user_id: "u1", role: "" });
      expect(composable.showAddSubject.value).toBe(true);
    });
  });

  // --- removeSubject ---

  describe("removeSubject", () => {
    it("removes the subject at the given index", () => {
      const { composable, formData } = setup([
        { user_id: "u1", role: SUBJECT_ROLE.RESPONSIBLE },
        { user_id: "u2", role: SUBJECT_ROLE.WITNESS },
      ]);
      composable.removeSubject(1);
      expect(formData.value.subjects).toEqual([{ user_id: "u1", role: SUBJECT_ROLE.RESPONSIBLE }]);
    });
  });

  // --- subjectRoleOptions ---

  describe("subjectRoleOptions", () => {
    it("maps each SUBJECT_ROLE to a formatted label and raw value", () => {
      const { composable } = setup();
      const options = composable.subjectRoleOptions;
      expect(options).toEqual([
        { label: "Responsible", value: SUBJECT_ROLE.RESPONSIBLE },
        { label: "Involved", value: SUBJECT_ROLE.INVOLVED },
        { label: "Witness", value: SUBJECT_ROLE.WITNESS },
      ]);
    });
  });

  // --- sharedRules ---

  describe("sharedRules", () => {
    it("description maxLength rule rejects strings over MAX_LENGTH.REPORT_DESCRIPTION", () => {
      const { composable } = setup();
      const rule = composable.sharedRules.description.maxLength;
      const description = "x".repeat(MAX_LENGTH.REPORT_DESCRIPTION + 1);
      expect(rule.$validator(description, {}, {})).toBe(false);
    });
    it("severity required rule rejects missing values", () => {
      const { composable } = setup();
      const rule = composable.sharedRules.severity.required;

      expect(rule.$validator(undefined, {}, {})).toBe(false);
      expect(rule.$validator(1, {}, {})).toBe(true);
    });
    it("severity between rule is bound to 1–7", () => {
      const { composable } = setup();
      const rule = composable.sharedRules.severity.between;
      expect(rule.$params).toEqual({ min: 1, max: 7, type: "between" });
    });
  });
});
