import type { Meta, StoryObj } from "@storybook/vue3";
import AppButton from "./AppButton.vue";
import AppTopBar from "./AppTopBar.vue";

const meta = {
  title: "Design System/AppTopBar",
  component: AppTopBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppTopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMetaAndActions: Story = {
  render: () => ({
    components: { AppTopBar, AppButton },
    template: `
      <AppTopBar>
        <template #brand>
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white" aria-hidden="true">S</span>
            <span class="text-sm font-semibold text-primary">Studia</span>
          </div>
        </template>
        <template #meta>André</template>
        <template #actions>
          <AppButton variant="text" color="muted">Sair</AppButton>
        </template>
      </AppTopBar>
    `,
  }),
};

export const NonSticky: Story = {
  args: { sticky: false },
  render: (args) => ({
    components: { AppTopBar },
    setup: () => ({ args }),
    template: `
      <AppTopBar v-bind="args">
        <template #brand>
          <span class="text-sm font-semibold text-primary">Studia</span>
        </template>
      </AppTopBar>
    `,
  }),
};
