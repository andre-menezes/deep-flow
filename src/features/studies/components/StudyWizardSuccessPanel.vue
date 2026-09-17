<script setup lang="ts">
defineProps<{
  successTitle: string;
  successSubtitle: string;
  viewLabel: string;
  createAnotherLabel: string;
}>();

const emit = defineEmits<{
  view: [];
  createAnother: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-4 px-6 py-10 text-center">
    <span
      class="flex h-14 w-14 items-center justify-center rounded-full bg-success-variant text-2xl font-semibold text-success"
      aria-hidden="true"
    >
      ✓
    </span>
    <div>
      <h2 class="text-lg font-semibold text-foreground">{{ successTitle }}</h2>
      <p class="text-sm text-muted">{{ successSubtitle }}</p>
    </div>
    <button
      type="button"
      class="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('view')"
    >
      {{ viewLabel }}
    </button>
    <button
      type="button"
      class="text-sm font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      @click="emit('createAnother')"
    >
      {{ createAnotherLabel }}
    </button>
  </div>
</template>
