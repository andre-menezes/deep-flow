<script setup lang="ts">
import { computed } from "vue";
import { AppBadge, type AppTone } from "@/shared/ui";
import type { StudyStatus } from "../domain/study";

const props = defineProps<{
  title: string;
  objective: string;
  status: StudyStatus;
}>();

const statusTone = computed<AppTone>(() => {
  switch (props.status) {
    case "ACTIVE":
      return "primary";
    case "PAUSED":
      return "secondary";
    case "COMPLETED":
      return "accent";
    case "ARCHIVED":
      return "error";
    default:
      return "muted";
  }
});
</script>

<template>
  <li
    class="rounded-[20px] border border-border bg-surface px-5 py-4 shadow-card"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-medium text-foreground">{{ title }}</p>
        <p class="mt-0.5 text-sm text-muted">{{ objective }}</p>
      </div>
      <AppBadge :tone="statusTone">{{ status }}</AppBadge>
    </div>
  </li>
</template>
