import type { Meta, StoryObj } from "@storybook/vue3";
import AppAlert from "./AppAlert.vue";
import AppButton from "./AppButton.vue";

const meta = {
  title: "Design System/AppAlert",
  component: AppAlert,
  tags: ["autodocs"],
  args: {
    tone: "info",
  },
} satisfies Meta<typeof AppAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => ({
    components: { AppAlert },
    template: `
      <div class="flex max-w-md flex-col gap-3">
        <AppAlert tone="error">Algo deu errado ao salvar.</AppAlert>
        <AppAlert tone="warning">Limite de criação atingido neste período.</AppAlert>
        <AppAlert tone="success">Estudo criado com sucesso.</AppAlert>
        <AppAlert tone="info">Dica: um nome curto ajuda no painel.</AppAlert>
        <AppAlert tone="accent">Organize sem fiscalizar.</AppAlert>
      </div>
    `,
  }),
};

export const WithTitleAndActions: Story = {
  render: () => ({
    components: { AppAlert, AppButton },
    template: `
      <AppAlert tone="warning" title="Limite atingido">
        Você já usou todas as criações deste período.
        <template #actions>
          <AppButton size="sm" variant="tonal" color="warning">Ver planos</AppButton>
        </template>
      </AppAlert>
    `,
  }),
};

export const Dismissible: Story = {
  args: {
    tone: "info",
    dismissible: true,
    dismissLabel: "Fechar",
  },
  render: (args) => ({
    components: { AppAlert },
    setup: () => ({ args }),
    template: `<AppAlert v-bind="args">Mensagem descartável.</AppAlert>`,
  }),
};
