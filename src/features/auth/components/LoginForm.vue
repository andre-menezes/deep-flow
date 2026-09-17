<script setup lang="ts">
import { AppAlert, AppButton, AppTextField } from "@/shared/ui";

defineProps<{
  appName: string;
  subtitle: string;
  email: string;
  password: string;
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  pending: boolean;
  errorMessage: string | null;
}>();

const emit = defineEmits<{
  "update:email": [value: string];
  "update:password": [value: string];
  submit: [];
}>();
</script>

<template>
  <div
    class="w-full max-w-sm overflow-hidden rounded-[20px] border border-border bg-surface shadow-card"
  >
    <div class="flex flex-col items-center gap-3 px-6 pt-8 text-center">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white"
        aria-hidden="true"
      >
        S
      </div>
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight text-primary">
          {{ appName }}
        </h1>
        <p class="text-sm text-muted">{{ subtitle }}</p>
      </div>
    </div>

    <form
      class="flex flex-col gap-4 px-6 py-6"
      @submit.prevent="emit('submit')"
    >
      <AppTextField
        :model-value="email"
        type="email"
        required
        autocomplete="email"
        :label="emailLabel"
        :placeholder="emailPlaceholder"
        @update:model-value="emit('update:email', $event)"
      />
      <AppTextField
        :model-value="password"
        type="password"
        required
        :minlength="8"
        autocomplete="current-password"
        :label="passwordLabel"
        @update:model-value="emit('update:password', $event)"
      />

      <AppAlert v-if="errorMessage" tone="error">
        {{ errorMessage }}
      </AppAlert>

      <AppButton type="submit" block :loading="pending" class="mt-1">
        {{ pending ? loadingLabel : submitLabel }}
      </AppButton>
    </form>
  </div>
</template>
