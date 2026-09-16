import { computed, reactive, ref } from 'vue'
import type { CreateStudyInput } from '../domain/study'

export type WizardStep = 'identity' | 'objective' | 'routine' | 'confirm'

const STEPS: WizardStep[] = ['identity', 'objective', 'routine', 'confirm']

export function useStudyWizard() {
  const currentStep = ref<WizardStep>('identity')
  const draft = reactive({
    title: '',
    objective: '',
    frequency: '',
    notes: '',
  })

  const stepIndex = computed(() => STEPS.indexOf(currentStep.value))
  const isFirst = computed(() => stepIndex.value === 0)
  const isLast = computed(() => stepIndex.value === STEPS.length - 1)

  function next() {
    if (!isLast.value) currentStep.value = STEPS[stepIndex.value + 1]!
  }

  function back() {
    if (!isFirst.value) currentStep.value = STEPS[stepIndex.value - 1]!
  }

  function toPayload(): CreateStudyInput {
    return {
      title: draft.title.trim(),
      objective: draft.objective.trim(),
      routine: {
        frequency: draft.frequency.trim(),
        notes: draft.notes.trim() || undefined,
      },
      status: 'ACTIVE',
    }
  }

  return { currentStep, draft, stepIndex, isFirst, isLast, next, back, toPayload, steps: STEPS }
}
