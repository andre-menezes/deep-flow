import type { Meta, StoryObj } from "@storybook/vue3";
import { computed, ref, watch } from "vue";
import AppButton from "./AppButton.vue";
import AppConfirmDialog from "./AppConfirmDialog.vue";

const meta = {
  title: "Design System/AppConfirmDialog",
  component: AppConfirmDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    modelValue: true,
    title: "Descartar Estudo?",
    description: "Descartar este Estudo e voltar? Os dados preenchidos serão perdidos.",
    confirmLabel: "Descartar",
    cancelLabel: "Continuar editando",
    confirmColor: "error",
    confirmLoading: false,
    cancelIcon: "arrow_back",
    confirmIcon: "delete",
  },
} satisfies Meta<typeof AppConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const confirmDialogTemplate = `
  <div class="min-h-[40vh] bg-background p-8">
    <AppButton v-if="showTrigger" @click="open = true">Abrir</AppButton>
    <AppConfirmDialog
      v-model="open"
      :title="args.title"
      :description="args.description"
      :confirm-label="args.confirmLabel"
      :cancel-label="args.cancelLabel"
      :confirm-color="args.confirmColor"
      :confirm-loading="confirmLoading"
      :cancel-icon="args.cancelIcon"
      :confirm-icon="args.confirmIcon"
      @confirm="onConfirm"
    />
  </div>
`;

export const Open: Story = {
  render: (args) => ({
    components: { AppConfirmDialog, AppButton },
    setup() {
      const open = ref(args.modelValue);
      const showTrigger = ref(true);
      // Bind to Storybook args so Controls update the prop live.
      const confirmLoading = computed(() => args.confirmLoading);

      function onConfirm() {
        open.value = false;
      }

      return { args, open, confirmLoading, showTrigger, onConfirm };
    },
    template: confirmDialogTemplate,
  }),
};

export const LoadingConfirm: Story = {
  args: {
    modelValue: true,
    confirmLoading: true,
  },
  render: (args) => ({
    components: { AppConfirmDialog, AppButton },
    setup() {
      // Keep dialog open so the confirm button's loading state stays visible.
      const open = ref(true);
      const showTrigger = ref(false);
      const confirmLoading = computed(() => args.confirmLoading);

      watch(
        confirmLoading,
        (loading) => {
          if (loading) open.value = true;
        },
        { immediate: true },
      );

      function onConfirm() {
        // Static loading demo: do not close while confirmLoading is true.
      }

      return { args, open, confirmLoading, showTrigger, onConfirm };
    },
    template: confirmDialogTemplate,
  }),
};

export const ConfirmWithLoadingDelay: Story = {
  args: {
    modelValue: false,
    confirmLoading: false,
  },
  render: (args) => ({
    components: { AppConfirmDialog, AppButton },
    setup() {
      const open = ref(false);
      const showTrigger = ref(true);
      const confirmLoading = ref(false);

      function onConfirm() {
        confirmLoading.value = true;
        window.setTimeout(() => {
          confirmLoading.value = false;
          open.value = false;
        }, 1500);
      }

      return { args, open, confirmLoading, showTrigger, onConfirm };
    },
    template: confirmDialogTemplate,
  }),
};
