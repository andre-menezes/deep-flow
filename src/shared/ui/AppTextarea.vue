<script setup lang="ts">
import { computed, useId } from "vue";
import {
  fieldControlBaseClass,
  fieldControlErrorClass,
  fieldControlOkClass,
} from "./fieldChrome";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    hint?: string;
    error?: string | null;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    maxlength?: number;
    id?: string;
  }>(),
  {
    rows: 4,
    disabled: false,
    readonly: false,
    required: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const autoId = useId();
const fieldId = computed(() => props.id ?? autoId);
const hintId = computed(() => `${fieldId.value}-hint`);
const errorId = computed(() => `${fieldId.value}-error`);
const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.error) ids.push(errorId.value);
  else if (props.hint) ids.push(hintId.value);
  return ids.length ? ids.join(" ") : undefined;
});

const charCount = computed(() => props.modelValue.length);
</script>

<template>
  <div class="flex flex-col gap-1.5 text-sm">
    <label v-if="label" :for="fieldId" class="font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-error" aria-hidden="true">*</span>
    </label>

    <textarea
      :id="fieldId"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxlength"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :class="[
        fieldControlBaseClass,
        'resize-y',
        error ? fieldControlErrorClass : fieldControlOkClass,
      ]"
      @input="
        emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <div class="flex items-start justify-between gap-2">
      <p v-if="error" :id="errorId" class="text-sm text-error">
        {{ error }}
      </p>
      <p v-else-if="hint" :id="hintId" class="text-sm text-muted">
        {{ hint }}
      </p>
      <span v-else />
      <span
        v-if="maxlength != null"
        class="shrink-0 text-xs text-muted tabular-nums"
      >
        {{ charCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
