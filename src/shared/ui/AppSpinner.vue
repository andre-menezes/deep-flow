<script setup lang="ts">
import { computed } from "vue";

export type AppSpinnerSize = "sm" | "md" | "lg";
export type AppSpinnerTone = "accent" | "muted";

const props = withDefaults(
  defineProps<{
    size?: AppSpinnerSize;
    label?: string;
    labelVisible?: boolean;
    tone?: AppSpinnerTone;
  }>(),
  {
    size: "md",
    labelVisible: false,
    tone: "accent",
  },
);

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "size-4 border-2";
    case "lg":
      return "size-8 border-[3px]";
    default:
      return "size-6 border-2";
  }
});

const toneClass = computed(() =>
  props.tone === "muted"
    ? "border-muted/30 border-t-muted"
    : "border-accent/30 border-t-accent",
);
</script>

<template>
  <div
    class="inline-flex flex-col items-center gap-2"
    role="status"
    aria-live="polite"
    :aria-label="label"
  >
    <span
      class="inline-block animate-spin rounded-full"
      :class="[sizeClass, toneClass]"
      aria-hidden="true"
    />
    <span
      v-if="label"
      :class="labelVisible ? 'text-sm text-muted' : 'sr-only'"
    >
      {{ label }}
    </span>
  </div>
</template>
