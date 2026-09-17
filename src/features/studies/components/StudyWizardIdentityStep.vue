<script setup lang="ts">
import { AppTextField } from "@/shared/ui";

defineProps<{
  title: string;
  label: string;
  heading: string;
  hint: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  "update:title": [value: string];
}>();
</script>

<template>
  <section class="flex flex-col gap-4">
    <div>
      <h2 class="text-base font-semibold text-foreground">{{ heading }}</h2>
      <p class="text-sm text-muted">{{ hint }}</p>
    </div>
    <AppTextField
      :model-value="title"
      required
      :label="label"
      :placeholder="placeholder"
      @update:model-value="emit('update:title', $event)"
    />
  </section>
</template>
