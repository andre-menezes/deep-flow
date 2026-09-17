<script setup lang="ts">
defineProps<{
  isFirst: boolean;
  isLast: boolean;
  pending: boolean;
  backLabel: string;
  cancelLabel: string;
  continueLabel: string;
  submitLabel: string;
  loadingLabel: string;
}>();

const emit = defineEmits<{
  back: [];
  cancel: [];
  next: [];
  submit: [];
}>();
</script>

<template>
  <footer class="flex justify-end gap-3 border-t border-border px-6 py-4">
    <button
      v-if="isFirst"
      type="button"
      class="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('cancel')"
    >
      {{ cancelLabel }}
    </button>
    <button
      v-else
      type="button"
      class="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('back')"
    >
      {{ backLabel }}
    </button>
    <button
      v-if="!isLast"
      type="button"
      class="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('next')"
    >
      {{ continueLabel }}
    </button>
    <button
      v-else
      type="button"
      class="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      :disabled="pending"
      @click="emit('submit')"
    >
      {{ pending ? loadingLabel : submitLabel }}
    </button>
  </footer>
</template>
