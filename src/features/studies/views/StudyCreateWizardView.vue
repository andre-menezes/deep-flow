<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { limits, useUsage } from "@/features/auth";
import { ApiError } from "@/shared/http";
import {
  AppAlert,
  AppConfirmDialog,
  AppStepper,
  type AppStepperItem,
} from "@/shared/ui";
import type { WizardStep } from "../composables/useStudyWizard";
import { useStudyWizard } from "../composables/useStudyWizard";
import type { Study } from "../domain/study";
import { useStudyListStore } from "../stores/studyListStore";
import StudyWizardActions from "../components/StudyWizardActions.vue";
import StudyWizardConfirmStep from "../components/StudyWizardConfirmStep.vue";
import StudyWizardIdentityStep from "../components/StudyWizardIdentityStep.vue";
import StudyWizardObjectiveStep from "../components/StudyWizardObjectiveStep.vue";
import StudyWizardRoutineStep from "../components/StudyWizardRoutineStep.vue";
import StudyWizardSuccessPanel from "../components/StudyWizardSuccessPanel.vue";

const { t } = useI18n();
const router = useRouter();
const studies = useStudyListStore();
const usage = useUsage();
const {
  currentStep,
  draft,
  stepIndex,
  isFirst,
  isLast,
  furthestIndex,
  next,
  back,
  goToStep,
  reset,
  toPayload,
  steps,
} = useStudyWizard();

const errorCode = ref<string | null>(null);
const pending = ref(false);
const created = ref<Study | null>(null);
const cancelDialogOpen = ref(false);

const fieldOwnerStep: Record<"title" | "objective" | "frequency", WizardStep> =
  {
    title: "identity",
    objective: "objective",
    frequency: "routine",
  };

const stepIcons: Record<WizardStep, string> = {
  identity: "badge",
  objective: "flag",
  routine: "event_repeat",
  confirm: "fact_check",
};

const stepperItems = computed<AppStepperItem[]>(() =>
  steps.map((step) => ({
    value: step,
    title: t(`studies.wizard.steps.${step}`),
    icon: stepIcons[step],
  })),
);

const usageLabel = computed(() => {
  const counter = usage.value?.studyCreationsThisPeriod;
  if (!counter) return null;
  return t("studies.wizard.usage", {
    used: counter.used,
    limit: counter.limit,
  });
});

const errorMessage = computed(() =>
  errorCode.value
    ? t(`errors.${errorCode.value}`, t("errors.INTERNAL_ERROR"))
    : null,
);

function onStepChange(value: string | number) {
  goToStep(String(value) as WizardStep);
}

function editField(field: "title" | "objective" | "frequency") {
  errorCode.value = null;
  goToStep(fieldOwnerStep[field]);
}

async function submit() {
  if (!limits.canCreateStudy()) {
    errorCode.value = "STUDY_CREATE_LIMIT_REACHED";
    return;
  }
  errorCode.value = null;
  pending.value = true;
  try {
    created.value = await studies.createStudy(toPayload());
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : "INTERNAL_ERROR";
  } finally {
    pending.value = false;
  }
}

async function viewCreatedStudy() {
  await router.push({
    name: "studies-home",
    query: created.value ? { created: created.value.id } : {},
  });
}

function createAnother() {
  created.value = null;
  errorCode.value = null;
  reset();
}

function hasDraftData() {
  return Boolean(
    draft.title.trim() ||
    draft.objective.trim() ||
    draft.frequency.trim() ||
    draft.notes.trim(),
  );
}

function cancel() {
  if (hasDraftData()) {
    cancelDialogOpen.value = true;
    return;
  }
  void leaveWizard();
}

function keepEditing() {
  cancelDialogOpen.value = false;
}

async function leaveWizard() {
  cancelDialogOpen.value = false;
  await router.push({ name: "studies-home" });
}

async function confirmDiscard() {
  await leaveWizard();
}
</script>

<template>
  <main
    class="flex min-h-screen items-center justify-center bg-background px-4 py-10"
  >
    <div
      class="w-full max-w-lg overflow-hidden rounded-[20px] border border-border bg-surface shadow-card"
    >
      <template v-if="!created">
        <header class="flex flex-col gap-4 border-b border-border px-6 py-5">
          <div>
            <h1 class="text-lg font-semibold text-foreground">
              {{ t("studies.wizard.title") }}
            </h1>
            <p class="text-sm text-muted">
              {{
                t("studies.wizard.step", {
                  step: stepIndex + 1,
                  total: steps.length,
                })
              }}
            </p>
          </div>
          <AppStepper
            :items="stepperItems"
            :model-value="currentStep"
            :furthest-index="furthestIndex"
            :aria-label="t('studies.wizard.stepperAria')"
            @update:model-value="onStepChange"
          />
        </header>

        <div class="px-6 py-6">
          <StudyWizardIdentityStep
            v-if="currentStep === 'identity'"
            :title="draft.title"
            :label="t('studies.wizard.fields.title')"
            :heading="t('studies.wizard.prompts.identity.heading')"
            :hint="t('studies.wizard.prompts.identity.hint')"
            :placeholder="t('studies.wizard.prompts.identity.placeholder')"
            @update:title="draft.title = $event"
          />
          <StudyWizardObjectiveStep
            v-else-if="currentStep === 'objective'"
            :objective="draft.objective"
            :label="t('studies.wizard.fields.objective')"
            :heading="t('studies.wizard.prompts.objective.heading')"
            :hint="t('studies.wizard.prompts.objective.hint')"
            :placeholder="t('studies.wizard.prompts.objective.placeholder')"
            @update:objective="draft.objective = $event"
          />
          <StudyWizardRoutineStep
            v-else-if="currentStep === 'routine'"
            :frequency="draft.frequency"
            :notes="draft.notes"
            :frequency-label="t('studies.wizard.fields.frequency')"
            :notes-label="t('studies.wizard.fields.notes')"
            :heading="t('studies.wizard.prompts.routine.heading')"
            :hint="t('studies.wizard.prompts.routine.hint')"
            :frequency-placeholder="
              t('studies.wizard.prompts.routine.frequencyPlaceholder')
            "
            :notes-placeholder="
              t('studies.wizard.prompts.routine.notesPlaceholder')
            "
            @update:frequency="draft.frequency = $event"
            @update:notes="draft.notes = $event"
          />
          <StudyWizardConfirmStep
            v-else
            :title="draft.title"
            :objective="draft.objective"
            :frequency="draft.frequency"
            :notes="draft.notes"
            :title-label="t('studies.wizard.fields.title')"
            :objective-label="t('studies.wizard.fields.objective')"
            :frequency-label="t('studies.wizard.fields.frequency')"
            :edit-label="t('studies.wizard.edit')"
            :heading="t('studies.wizard.prompts.confirm.heading')"
            :usage-label="usageLabel"
            @edit="editField"
          />

          <AppAlert v-if="errorMessage" class="mt-4" tone="error">
            {{ errorMessage }}
          </AppAlert>
        </div>

        <StudyWizardActions
          :is-first="isFirst"
          :is-last="isLast"
          :pending="pending"
          :back-label="t('common.back')"
          :cancel-label="t('common.cancel')"
          :continue-label="t('common.continue')"
          :submit-label="t('studies.wizard.submit')"
          :loading-label="t('common.loading')"
          @back="back()"
          @cancel="cancel"
          @next="next()"
          @submit="submit"
        />
      </template>

      <StudyWizardSuccessPanel
        v-else
        :success-title="t('studies.wizard.success.title')"
        :success-subtitle="
          t('studies.wizard.success.subtitle', { title: created.title })
        "
        :view-label="t('studies.wizard.success.view')"
        :create-another-label="t('studies.wizard.success.createAnother')"
        @view="viewCreatedStudy"
        @create-another="createAnother"
      />
    </div>

    <AppConfirmDialog
      v-model="cancelDialogOpen"
      :title="t('studies.wizard.cancelConfirmTitle')"
      :description="t('studies.wizard.cancelConfirm')"
      :confirm-label="t('studies.wizard.cancelConfirmDiscard')"
      :cancel-label="t('studies.wizard.cancelConfirmKeep')"
      confirm-color="error"
      @confirm="confirmDiscard"
      @cancel="keepEditing"
    />
  </main>
</template>
