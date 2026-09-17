import type { Meta, StoryObj } from "@storybook/vue3";
import AppSpinner from "./AppSpinner.vue";

const meta = {
  title: "Design System/AppSpinner",
  component: AppSpinner,
  tags: ["autodocs"],
  args: {
    label: "Loading",
    size: "md",
  },
} satisfies Meta<typeof AppSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => ({
    components: { AppSpinner },
    template: `
      <div class="flex items-end gap-6">
        <AppSpinner size="sm" label="Small" />
        <AppSpinner size="md" label="Medium" />
        <AppSpinner size="lg" label="Large" label-visible />
      </div>
    `,
  }),
};

export const LabelVisible: Story = {
  args: { label: "Carregando…", labelVisible: true },
};
