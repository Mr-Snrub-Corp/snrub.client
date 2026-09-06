<template>
  <div class="flex flex-col gap-2">
    <label :for="inputId" :class="labelClass">{{ label }}</label>
    <slot />
    <small v-if="field.$error" :id="errorId" class="text-red-500">
      {{ field.$errors[0]?.$message }}
    </small>
  </div>
</template>

<script setup lang="ts">
/**
 * Label + slotted control + Vuelidate error. The parent keeps input bindings
 * (`v-model`, `:invalid`, `data-testid`) so existing tests stay stable.
 */
withDefaults(
  defineProps<{
    label: string;
    inputId: string;
    errorId: string;
    field: { $error: boolean; $errors: { $message: unknown }[] };
    labelClass?: string;
  }>(),
  { labelClass: "text-surface-900 dark:text-surface-0" },
);
</script>
