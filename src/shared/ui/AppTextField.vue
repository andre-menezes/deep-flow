<script setup lang="ts">
import { computed, useId, useSlots } from "vue";
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
    type?: "text" | "email" | "password" | "number" | "search" | "url";
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    autocomplete?: string;
    name?: string;
    id?: string;
    prependIcon?: string;
    appendIcon?: string;
    maxlength?: number;
    minlength?: number;
  }>(),
  {
    type: "text",
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

const slots = useSlots();
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

const hasAppend = computed(
  () => Boolean(props.appendIcon) || Boolean(slots.append),
);
</script>

<template>
  <div class="flex flex-col gap-1.5 text-sm">
    <label v-if="label" :for="fieldId" class="font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-error" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <span
        v-if="prependIcon"
        class="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-muted"
        aria-hidden="true"
      >
        {{ prependIcon }}
      </span>

      <input
        :id="fieldId"
        :value="modelValue"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :class="[
          fieldControlBaseClass,
          error ? fieldControlErrorClass : fieldControlOkClass,
          prependIcon ? 'pl-10' : '',
          hasAppend ? 'pr-10' : '',
        ]"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <span
        v-if="appendIcon && !slots.append"
        class="material-symbols-outlined pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[20px] text-muted"
        aria-hidden="true"
      >
        {{ appendIcon }}
      </span>
      <div
        v-if="slots.append"
        class="absolute top-1/2 right-2 -translate-y-1/2"
      >
        <slot name="append" />
      </div>
    </div>

    <p v-if="error" :id="errorId" class="text-sm text-error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="text-sm text-muted">
      {{ hint }}
    </p>
  </div>
</template>
