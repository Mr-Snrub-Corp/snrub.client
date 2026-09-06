import { describe, expect, it } from "vitest";
import { renderWithPlugins } from "@/test/renderWithPlugins";
import FormField from "./FormField.vue";

const validField = { $error: false, $errors: [] };
const invalidField = { $error: true, $errors: [{ $message: "Email is required" }] };

function renderField(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = { default: '<input id="email" />' },
) {
  return renderWithPlugins(FormField, {
    props: {
      label: "Email *",
      inputId: "email",
      errorId: "email-error",
      field: validField,
      ...props,
    },
    slots,
  });
}

describe("FormField", () => {
  it("associates the label with the slotted input via for/id", async () => {
    const { wrapper } = await renderField();

    expect(wrapper.get("label").text()).toBe("Email *");
    expect(wrapper.get("label").attributes("for")).toBe("email");
    expect(wrapper.find("input#email").exists()).toBe(true);
  });

  it("hides the error when the field is valid", async () => {
    const { wrapper } = await renderField();

    expect(wrapper.find("#email-error").exists()).toBe(false);
  });

  it("shows the first Vuelidate message when the field is invalid", async () => {
    const { wrapper } = await renderField({ field: invalidField });

    const error = wrapper.get("#email-error");
    expect(error.classes()).toContain("text-red-500");
    expect(error.text()).toBe("Email is required");
  });

  it("applies the default label class when none is provided", async () => {
    const { wrapper } = await renderField();

    expect(wrapper.get("label").classes()).toEqual(
      expect.arrayContaining(["text-surface-900", "dark:text-surface-0"]),
    );
  });

  it("uses a custom label class when provided", async () => {
    const { wrapper } = await renderField({
      labelClass: "block text-surface-900 font-medium",
    });

    expect(wrapper.get("label").classes()).toEqual(
      expect.arrayContaining(["block", "font-medium"]),
    );
    expect(wrapper.get("label").classes()).not.toContain("dark:text-surface-0");
  });
});
