<script setup lang="ts">
withDefaults(
  defineProps<{
    sticky?: boolean;
    bordered?: boolean;
    maxWidthClass?: string;
  }>(),
  {
    sticky: true,
    bordered: true,
    maxWidthClass: "max-w-2xl",
  },
);
</script>

<template>
  <header
    class="bg-surface/80 px-4 py-3 backdrop-blur-sm"
    :class="[
      sticky ? 'sticky top-0 z-40' : '',
      bordered ? 'border-b border-border' : '',
    ]"
  >
    <div
      class="mx-auto flex items-center justify-between gap-4"
      :class="maxWidthClass"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div class="min-w-0">
          <div class="truncate">
            <slot name="brand" />
          </div>
          <div v-if="$slots.meta" class="truncate text-xs text-muted">
            <slot name="meta" />
          </div>
        </div>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
