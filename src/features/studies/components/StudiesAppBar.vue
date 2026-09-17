<script setup lang="ts">
import { AppButton, AppTopBar } from "@/shared/ui";

defineProps<{
  appName: string;
  displayName: string | null;
  logoutLabel: string;
  loggingOut: boolean;
}>();

const emit = defineEmits<{
  logout: [];
}>();
</script>

<template>
  <AppTopBar>
    <template #brand>
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white"
          aria-hidden="true"
        >
          S
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-primary">
            {{ appName }}
          </p>
          <p v-if="displayName" class="truncate text-xs text-muted">
            {{ displayName }}
          </p>
        </div>
      </div>
    </template>
    <template #actions>
      <AppButton
        variant="text"
        color="muted"
        size="sm"
        :loading="loggingOut"
        @click="emit('logout')"
      >
        {{ logoutLabel }}
      </AppButton>
    </template>
  </AppTopBar>
</template>
