import type { Meta, StoryObj } from "@storybook/vue3";
import AppButton from "./AppButton.vue";
import type {
  AppButtonColor,
  AppButtonRounded,
  AppButtonSize,
  AppButtonType,
  AppButtonVariant,
} from "./AppButton.vue";

/** Story args = button props + slot label (not a real prop). */
type AppButtonStoryArgs = {
  variant?: AppButtonVariant;
  color?: AppButtonColor;
  size?: AppButtonSize;
  icon?: string;
  iconOnly?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  block?: boolean;
  rounded?: AppButtonRounded;
  disabled?: boolean;
  loading?: boolean;
  type?: AppButtonType;
  ariaLabel?: string;
  label?: string;
  onClick?: (event: MouseEvent) => void;
};

const meta = {
  title: "Design System/AppButton",
  component: AppButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "tonal", "outlined", "text", "plain"],
    },
    color: {
      control: "select",
      options: [
        "accent",
        "primary",
        "secondary",
        "error",
        "success",
        "warning",
        "info",
        "muted",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    rounded: {
      control: "select",
      options: [true, false, "full"],
    },
    icon: { control: "text" },
    prependIcon: { control: "text" },
    appendIcon: { control: "text" },
    iconOnly: { control: "boolean" },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    ariaLabel: { control: "text" },
    label: { control: "text", description: "Default slot content (label)" },
    onClick: { action: "click" },
  },
  args: {
    variant: "filled",
    color: "accent",
    size: "md",
    label: "Continuar",
    disabled: false,
    loading: false,
    block: false,
    iconOnly: false,
    rounded: true,
  },
} satisfies Meta<AppButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { AppButton },
    setup: () => ({ args }),
    template: `
      <AppButton
        v-bind="args"
        @click="args.onClick"
      >
        {{ args.label }}
      </AppButton>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <AppButton variant="filled">Filled</AppButton>
        <AppButton variant="tonal">Tonal</AppButton>
        <AppButton variant="outlined">Outlined</AppButton>
        <AppButton variant="text">Text</AppButton>
        <AppButton variant="plain">Plain</AppButton>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <AppButton color="accent">Accent</AppButton>
        <AppButton color="primary">Primary</AppButton>
        <AppButton color="secondary">Secondary</AppButton>
        <AppButton color="error">Error</AppButton>
        <AppButton color="success">Success</AppButton>
        <AppButton color="warning">Warning</AppButton>
        <AppButton color="info">Info</AppButton>
        <AppButton color="muted">Muted</AppButton>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="flex flex-wrap items-end gap-3">
        <AppButton size="xs">XS</AppButton>
        <AppButton size="sm">SM</AppButton>
        <AppButton size="md">MD</AppButton>
        <AppButton size="lg">LG</AppButton>
        <AppButton size="xl">XL</AppButton>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <AppButton prepend-icon="add">Criar Estudo</AppButton>
        <AppButton append-icon="arrow_forward">Continuar</AppButton>
        <AppButton variant="tonal" color="primary" icon="edit">Editar</AppButton>
        <AppButton variant="outlined" icon="logout" icon-only aria-label="Sair" />
        <AppButton variant="text" color="error" icon="delete" icon-only aria-label="Excluir" />
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <AppButton>Default</AppButton>
        <AppButton disabled>Disabled</AppButton>
        <AppButton loading>Loading</AppButton>
        <AppButton block>Block</AppButton>
      </div>
    `,
  }),
};
