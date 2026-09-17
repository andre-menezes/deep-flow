<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    /** Accessible name for the dialog. */
    ariaLabel?: string;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
  }>(),
  {
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function onBackdropClick() {
  if (props.closeOnBackdrop) close();
}

function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !props.closeOnEscape) return;
  if (event.key === "Escape") {
    event.preventDefault();
    close();
  }
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
);

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        class="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="onBackdropClick"
      />
      <div
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        class="relative z-10 w-full max-w-md outline-none"
        tabindex="-1"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
