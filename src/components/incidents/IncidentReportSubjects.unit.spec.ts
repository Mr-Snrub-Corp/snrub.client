import { describe, expect, it } from "vitest";
import { SUBJECT_ROLE } from "@/constants/enums";
import { enumToSelectOptions } from "@/utils";
import { makeUser } from "@/test/factories/user.factory";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import IncidentReportSubjects from "./IncidentReportSubjects.vue";

const ALICE = makeUser({ uid: "u1", name: "Alice" });
const BOB = makeUser({ uid: "u2", name: "Bob" });

function renderSubjects(props: Record<string, unknown> = {}) {
  return renderWithPlugins(IncidentReportSubjects, {
    props: {
      subjects: [],
      showAddSubject: false,
      newSubject: { user_id: "", role: "" },
      subjectRoleOptions: enumToSelectOptions(SUBJECT_ROLE),
      availableUsers: [ALICE, BOB],
      getSubjectName: (id: string) => (id === "u1" ? "Alice" : id),
      ...props,
    },
  });
}

describe("IncidentReportSubjects", () => {
  it("shows empty state when no subjects are added", async () => {
    const { wrapper } = await renderSubjects();

    expect(wrapper.text()).toContain("No subjects added");
  });

  it("lists existing subjects by name", async () => {
    const { wrapper } = await renderSubjects({
      subjects: [{ user_id: "u1", role: SUBJECT_ROLE.WITNESS }],
    });

    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).not.toContain("No subjects added");
  });

  it("emits update:showAddSubject when Add Subject is clicked", async () => {
    const { wrapper } = await renderSubjects();

    await wrapper.find('[data-testid="incidents.subjects.add-btn"]').trigger("click");

    expect(wrapper.emitted("update:showAddSubject")?.[0]).toEqual([true]);
  });

  it("emits remove with the subject index", async () => {
    const { wrapper } = await renderSubjects({
      subjects: [{ user_id: "u1", role: SUBJECT_ROLE.WITNESS }],
    });

    await wrapper.find('[data-testid="incidents.subjects.remove-btn"]').trigger("click");

    expect(wrapper.emitted("remove")?.[0]).toEqual([0]);
  });

  it("disables confirm-add until user and role are set", async () => {
    const { wrapper } = await renderSubjects({ showAddSubject: true });

    expect(
      wrapper.find('[data-testid="incidents.subjects.confirm-add-btn"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("emits add when confirm-add is clicked with a complete draft", async () => {
    const { wrapper } = await renderSubjects({
      showAddSubject: true,
      newSubject: { user_id: "u1", role: SUBJECT_ROLE.WITNESS },
    });

    await wrapper.find('[data-testid="incidents.subjects.confirm-add-btn"]').trigger("click");

    expect(wrapper.emitted("add")).toHaveLength(1);
  });
});
