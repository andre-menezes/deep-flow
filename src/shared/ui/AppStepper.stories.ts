import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import AppStepper from "./AppStepper.vue";
import type { AppStepperItem } from "./AppStepper.vue";

const defaultItems: AppStepperItem[] = [
  { value: "identity", title: "Sobre", icon: "badge" },
  { value: "objective", title: "Objetivo", icon: "flag" },
  { value: "routine", title: "Rotina", icon: "event_repeat" },
  { value: "confirm", title: "Confirmação", icon: "fact_check" },
];

const meta = {
  title: "Design System/AppStepper",
  component: AppStepper,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "select",
      options: defaultItems.map((item) => item.value),
    },
    furthestIndex: {
      control: { type: "number", min: 0, max: 3, step: 1 },
    },
    ariaLabel: { control: "text" },
  },
  args: {
    items: defaultItems,
    modelValue: "identity",
    furthestIndex: 0,
    ariaLabel: "Etapas do assistente",
  },
} satisfies Meta<typeof AppStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { AppStepper },
    setup() {
      const current = ref(args.modelValue);
      return { args, current };
    },
    template: `
      <div class="w-[28rem] max-w-full">
        <AppStepper
          v-bind="args"
          v-model="current"
        />
        <p class="mt-4 text-center text-sm text-muted">Passo atual: {{ current }}</p>
      </div>
    `,
  }),
};

export const MidProgress: Story = {
  args: {
    modelValue: "routine",
    furthestIndex: 2,
  },
  render: (args) => ({
    components: { AppStepper },
    setup() {
      const current = ref(args.modelValue);
      return { args, current };
    },
    template: `
      <div class="w-[28rem] max-w-full">
        <AppStepper v-bind="args" v-model="current" />
      </div>
    `,
  }),
};

export const AllReachable: Story = {
  args: {
    modelValue: "confirm",
    furthestIndex: 3,
  },
  render: (args) => ({
    components: { AppStepper },
    setup() {
      const current = ref(args.modelValue);
      return { args, current };
    },
    template: `
      <div class="w-[28rem] max-w-full">
        <AppStepper v-bind="args" v-model="current" />
      </div>
    `,
  }),
};
