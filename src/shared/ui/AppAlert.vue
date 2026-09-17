<script setup lang="ts">
import { computed } from "vue";
import AppButton from "./AppButton.vue";
import {
  toneOutlinedClasses,
  toneTonalClasses,
  type AppTone,
} from "./tones";

export type AppAlertTone = Extract<
  AppTone,
  "error" | "success" | "warning" | "info" | "accent"
>;
export type AppAlertVariant = "tonal" | "outlined";

const props = withDefaults(
  defineProps<{
    tone?: AppAlertTone;
    variant?: AppAlertVariant;
    icon?: string;
    dismissible?: boolean;
    dismissLabel?: string;
    title?: string;
  }>(),
  {
    tone: "info",
    variant: "tonal",
    dismissible: false,
  },
);

const emit = defineEmits<{
  dismiss: [];
}>();

const defaultIcon = computed(() => {
  if (props.icon) return props.icon;
  switch (props.tone) {
    case "error":
      return "error";
    case "success":
      return "check_circle";
    case "warning":
      return "warning";
    case "accent":
      return "lightbulb";
    default:
      return "info";
  }
});

const chromeClass = computed(() =>
  props.variant === "outlined"
    ? toneOutlinedClasses(props.tone)
    : toneTonalClasses(props.tone),
);

const role = computed(() => (props.tone === "error" ? "alert" : "status"));
</script>

<template>
  <div
    class="flex gap-3 rounded-xl px-3 py-2.5 text-sm"
    :class="chromeClass"
    :role="role"
  >
    <span
      class="material-symbols-outlined mt-0.5 shrink-0 text-[20px] leading-none"
      aria-hidden="true"
    >
      {{ defaultIcon }}
    </span>
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-medium">{{ title }}</p>
      <div :class="title ? 'mt-0.5 opacity-90' : ''">
        <slot />
      </div>
      <div v-if="$slots.actions" class="mt-2 flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
    <AppButton
      v-if="dismissible"
      variant="text"
      :color="tone"
      size="sm"
      icon="close"
      icon-only
      :aria-label="dismissLabel ?? 'Dismiss'"
      @click="emit('dismiss')"
    />
  </div>
</template>
