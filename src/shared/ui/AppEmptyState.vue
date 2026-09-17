<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    icon?: string;
    bordered?: boolean;
    headingLevel?: "h2" | "h3";
  }>(),
  {
    icon: "menu_book",
    bordered: true,
    headingLevel: "h2",
  },
);
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 px-6 py-12 text-center"
    :class="
      bordered
        ? 'rounded-[20px] border border-dashed border-border bg-surface shadow-card'
        : ''
    "
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-variant text-accent"
      aria-hidden="true"
    >
      <span class="material-symbols-outlined text-[28px] leading-none">
        {{ icon }}
      </span>
    </div>

    <component
      :is="headingLevel"
      v-if="title"
      class="text-base font-semibold text-foreground"
    >
      {{ title }}
    </component>

    <div v-if="$slots.default || description" class="max-w-xs text-sm text-muted">
      <slot>
        <p>{{ description }}</p>
      </slot>
    </div>

    <div v-if="$slots.actions" class="mt-1 flex flex-wrap justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
