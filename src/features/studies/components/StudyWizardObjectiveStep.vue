<script setup lang="ts">
import { AppTextarea } from "@/shared/ui";

defineProps<{
  objective: string;
  label: string;
  heading: string;
  hint: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  "update:objective": [value: string];
}>();
</script>

<template>
  <section class="flex flex-col gap-4">
    <div>
      <h2 class="text-base font-semibold text-foreground">{{ heading }}</h2>
      <p class="text-sm text-muted">{{ hint }}</p>
    </div>
    <AppTextarea
      :model-value="objective"
      required
      :rows="4"
      :label="label"
      :placeholder="placeholder"
      @update:model-value="emit('update:objective', $event)"
    />
  </section>
</template>
