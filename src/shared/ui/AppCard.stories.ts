import type { Meta, StoryObj } from "@storybook/vue3";
import AppButton from "./AppButton.vue";
import AppCard from "./AppCard.vue";

const meta = {
  title: "Design System/AppCard",
  component: AppCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AppCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => ({
    components: { AppCard, AppButton },
    template: `
      <AppCard>
        <template #card-title>Título do card</template>
        <template #card-subtitle>Subtítulo opcional</template>
        <template #card-text>
          Texto de apoio. Use este bloco para a mensagem principal.
        </template>
        <template #card-actions>
          <AppButton variant="outlined" color="muted">Cancelar</AppButton>
          <AppButton>Confirmar</AppButton>
        </template>
      </AppCard>
    `,
  }),
};

export const TitleAndTextOnly: Story = {
  render: () => ({
    components: { AppCard },
    template: `
      <AppCard>
        <template #card-title>Somente título e texto</template>
        <template #card-text>
          Sem subtítulo nem ações — útil para conteúdo informativo.
        </template>
      </AppCard>
    `,
  }),
};
