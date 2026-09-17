import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import AppTextarea from "./AppTextarea.vue";

const meta = {
  title: "Design System/AppTextarea",
  component: AppTextarea,
  tags: ["autodocs"],
  args: {
    modelValue: "",
    label: "Objetivo",
    rows: 4,
    placeholder: "Passar na prova final…",
  },
} satisfies Meta<typeof AppTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { AppTextarea },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AppTextarea v-bind="args" v-model="value" class="max-w-md" />`,
  }),
};

export const WithError: Story = {
  args: { error: "Descreva o objetivo." },
  render: Default.render,
};

export const MaxLength: Story = {
  args: { maxlength: 120, modelValue: "Texto inicial" },
  render: Default.render,
};
