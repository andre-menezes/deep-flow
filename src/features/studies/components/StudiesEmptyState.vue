<script setup lang="ts">
import { AppButton, AppEmptyState } from "@/shared/ui";

defineProps<{
  emptyMessage: string;
  createLabel: string;
  canCreate: boolean;
}>();

const emit = defineEmits<{
  create: [];
}>();
</script>

<template>
  <AppEmptyState :description="emptyMessage" icon="menu_book">
    <template v-if="canCreate" #actions>
      <AppButton @click="emit('create')">{{ createLabel }}</AppButton>
    </template>
  </AppEmptyState>
</template>
