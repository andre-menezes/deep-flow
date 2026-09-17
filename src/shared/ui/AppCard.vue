<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Stretch to full width of parent. */
    block?: boolean;
  }>(),
  {
    block: false,
  },
);
</script>

<template>
  <article
    class="overflow-hidden rounded-[20px] border border-border bg-surface text-foreground shadow-card"
    :class="block ? 'w-full' : 'w-full max-w-md'"
  >
    <header
      v-if="$slots['card-title'] || $slots['card-subtitle']"
      class="flex flex-col gap-1 px-6 pt-6"
    >
      <div
        v-if="$slots['card-title']"
        class="text-lg font-semibold tracking-tight text-foreground"
      >
        <slot name="card-title" />
      </div>
      <div v-if="$slots['card-subtitle']" class="text-sm text-muted">
        <slot name="card-subtitle" />
      </div>
    </header>

    <div
      v-if="$slots['card-text'] || $slots.default"
      class="px-6 py-4 text-sm leading-relaxed text-foreground"
      :class="{
        'pt-6': !$slots['card-title'] && !$slots['card-subtitle'],
      }"
    >
      <slot name="card-text" />
      <slot />
    </div>

    <footer
      v-if="$slots['card-actions']"
      class="flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4"
    >
      <slot name="card-actions" />
    </footer>
  </article>
</template>
