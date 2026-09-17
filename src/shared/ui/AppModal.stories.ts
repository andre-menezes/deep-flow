import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import AppButton from "./AppButton.vue";
import AppCard from "./AppCard.vue";
import AppModal from "./AppModal.vue";

const meta = {
  title: "Design System/AppModal",
  component: AppModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    modelValue: true,
  },
} satisfies Meta<typeof AppModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCard: Story = {
  args: {
    modelValue: true,
    ariaLabel: "Confirmação",
  },
  render: (args) => ({
    components: { AppModal, AppCard, AppButton },
    setup() {
      const open = ref(args.modelValue);
      return { open, args };
    },
    template: `
      <div class="min-h-[50vh] bg-background p-8">
        <AppButton @click="open = true">Abrir modal</AppButton>
        <AppModal v-model="open" :aria-label="args.ariaLabel">
          <AppCard>
            <template #card-title>Descartar Estudo?</template>
            <template #card-subtitle>Ação irreversível nesta sessão</template>
            <template #card-text>
              Descartar este Estudo e voltar? Os dados preenchidos serão perdidos.
            </template>
            <template #card-actions>
              <AppButton variant="outlined" color="muted" @click="open = false">
                Continuar editando
              </AppButton>
              <AppButton color="error" @click="open = false">Descartar</AppButton>
            </template>
          </AppCard>
        </AppModal>
      </div>
    `,
  }),
};
