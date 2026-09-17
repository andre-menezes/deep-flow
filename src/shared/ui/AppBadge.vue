<script setup lang="ts">
import { computed } from "vue";
import { toneTonalClasses, type AppTone } from "./tones";

export type AppBadgeSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    tone?: AppTone;
    size?: AppBadgeSize;
    uppercase?: boolean;
    icon?: string;
  }>(),
  {
    tone: "muted",
    size: "sm",
    uppercase: true,
  },
);

const sizeClass = computed(() =>
  props.size === "md"
    ? "px-2.5 py-1 text-xs"
    : "px-2 py-0.5 text-[11px]",
);
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-1 rounded-md font-medium tracking-wide"
    :class="[
      toneTonalClasses(tone),
      sizeClass,
      uppercase ? 'uppercase' : '',
    ]"
  >
    <span
      v-if="icon"
      class="material-symbols-outlined text-[14px] leading-none"
      aria-hidden="true"
    >
      {{ icon }}
    </span>
    <slot />
  </span>
</template>
