import type { Meta, StoryObj } from "@storybook/vue3";
import AppButton from "./AppButton.vue";
import AppEmptyState from "./AppEmptyState.vue";

const meta = {
  title: "Design System/AppEmptyState",
  component: AppEmptyState,
  tags: ["autodocs"],
  args: {
    title: "Nenhum Estudo ainda",
    description:
      "Você ainda não criou nenhum Estudo. Comece organizando o primeiro.",
    icon: "menu_book",
  },
} satisfies Meta<typeof AppEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  render: (args) => ({
    components: { AppEmptyState, AppButton },
    setup: () => ({ args }),
    template: `
      <AppEmptyState v-bind="args">
        <template #actions>
          <AppButton>Criar Estudo</AppButton>
        </template>
      </AppEmptyState>
    `,
  }),
};

export const NoBorder: Story = {
  args: { bordered: false },
};
