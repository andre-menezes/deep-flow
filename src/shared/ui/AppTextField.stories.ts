import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import AppTextField from "./AppTextField.vue";

const meta = {
  title: "Design System/AppTextField",
  component: AppTextField,
  tags: ["autodocs"],
  args: {
    modelValue: "",
    label: "Nome",
    placeholder: "Cálculo I",
  },
} satisfies Meta<typeof AppTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { AppTextField },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AppTextField v-bind="args" v-model="value" class="max-w-sm" />`,
  }),
};

export const WithHint: Story = {
  args: { hint: "Um nome curto ajuda a reconhecer no painel." },
  render: Default.render,
};

export const WithError: Story = {
  args: { error: "Informe um nome.", modelValue: "" },
  render: Default.render,
};

export const Password: Story = {
  args: {
    label: "Senha",
    type: "password",
    autocomplete: "current-password",
    prependIcon: "lock",
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true, modelValue: "Somente leitura" },
  render: Default.render,
};
