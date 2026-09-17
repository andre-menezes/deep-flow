<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { limits, useUsage } from '@/features/auth'
import { ApiError } from '@/shared/http'
import type { WizardStep } from '../composables/useStudyWizard'
import { useStudyWizard } from '../composables/useStudyWizard'
import { useStudyListStore } from '../stores/studyListStore'
import type { Study } from '../domain/study'

const { t } = useI18n()
const router = useRouter()
const studies = useStudyListStore()
const usage = useUsage()
const { currentStep, draft, stepIndex, isFirst, isLast, furthestIndex, next, back, goToStep, reset, toPayload, steps } =
  useStudyWizard()

const errorCode = ref<string | null>(null)
const pending = ref(false)
const created = ref<Study | null>(null)

const stepLabels: Record<WizardStep, string> = {
  identity: t('studies.wizard.steps.identity'),
  objective: t('studies.wizard.steps.objective'),
  routine: t('studies.wizard.steps.routine'),
  confirm: t('studies.wizard.steps.confirm'),
}

const fieldOwnerStep: Record<'title' | 'objective' | 'frequency', WizardStep> = {
  title: 'identity',
  objective: 'objective',
  frequency: 'routine',
}

const usageLabel = computed(() => {
  const counter = usage.value?.studyCreationsThisPeriod
  if (!counter) return null
  return t('studies.wizard.usage', { used: counter.used, limit: counter.limit })
})

function editField(field: keyof typeof fieldOwnerStep) {
  errorCode.value = null
  goToStep(fieldOwnerStep[field])
}

async function submit() {
  if (!limits.canCreateStudy()) {
    errorCode.value = 'STUDY_CREATE_LIMIT_REACHED'
    return
  }
  errorCode.value = null
  pending.value = true
  try {
    created.value = await studies.createStudy(toPayload())
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : 'INTERNAL_ERROR'
  } finally {
    pending.value = false
  }
}

async function viewCreatedStudy() {
  await router.push({ name: 'studies-home', query: created.value ? { created: created.value.id } : {} })
}

function createAnother() {
  created.value = null
  errorCode.value = null
  reset()
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-10">
    <div class="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <template v-if="!created">
        <header class="flex flex-col gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <h1 class="text-lg font-semibold text-stone-900">{{ t('studies.wizard.title') }}</h1>
            <p class="text-sm text-stone-500">
              {{ t('studies.wizard.step', { step: stepIndex + 1, total: steps.length }) }}
            </p>
          </div>

          <ol class="flex gap-1" aria-label="Etapas do assistente">
            <li v-for="(step, index) in steps" :key="step" class="relative flex-1">
              <span
                v-if="index < steps.length - 1"
                class="absolute left-1/2 top-[11px] -z-10 h-0.5 w-full"
                :class="index < furthestIndex ? 'bg-teal-600' : 'bg-stone-200'"
                aria-hidden="true"
              />
              <button
                type="button"
                class="relative z-10 flex w-full flex-col items-center gap-1.5"
                :disabled="index > furthestIndex"
                :class="index > furthestIndex ? 'cursor-default' : 'cursor-pointer'"
                @click="goToStep(step)"
              >
                <span
                  class="flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-semibold"
                  :class="
                    index <= furthestIndex
                      ? 'bg-teal-600 text-white'
                      : 'bg-stone-100 text-stone-400'
                  "
                >
                  {{ index + 1 }}
                </span>
                <span
                  class="text-[11px]"
                  :class="index === stepIndex ? 'font-medium text-stone-900' : 'text-stone-500'"
                >
                  {{ stepLabels[step] }}
                </span>
              </button>
            </li>
          </ol>
        </header>

        <div class="px-6 py-6">
          <section v-if="currentStep === 'identity'" class="flex flex-col gap-4">
            <div>
              <h2 class="text-base font-semibold text-stone-900">Como vamos chamar esse Study?</h2>
              <p class="text-sm text-stone-500">Um nome curto ajuda a reconhecer no seu painel.</p>
            </div>
            <label class="flex flex-col gap-1.5 text-sm">
              <span class="font-medium text-stone-700">{{ t('studies.wizard.fields.title') }}</span>
              <input
                v-model="draft.title"
                required
                type="text"
                placeholder="Cálculo I"
                class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </section>

          <section v-else-if="currentStep === 'objective'" class="flex flex-col gap-4">
            <div>
              <h2 class="text-base font-semibold text-stone-900">Qual é o objetivo?</h2>
              <p class="text-sm text-stone-500">Descreva em poucas palavras o que você quer alcançar.</p>
            </div>
            <label class="flex flex-col gap-1.5 text-sm">
              <span class="font-medium text-stone-700">{{ t('studies.wizard.fields.objective') }}</span>
              <textarea
                v-model="draft.objective"
                required
                rows="4"
                placeholder="Passar na prova final com nota acima de 8"
                class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </section>

          <section v-else-if="currentStep === 'routine'" class="flex flex-col gap-4">
            <div>
              <h2 class="text-base font-semibold text-stone-900">Com que frequência você vai estudar?</h2>
              <p class="text-sm text-stone-500">Isso ajuda a organizar sua rotina — sem cobrar resultado.</p>
            </div>
            <label class="flex flex-col gap-1.5 text-sm">
              <span class="font-medium text-stone-700">{{ t('studies.wizard.fields.frequency') }}</span>
              <input
                v-model="draft.frequency"
                required
                type="text"
                placeholder="3x por semana"
                class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
            <label class="flex flex-col gap-1.5 text-sm">
              <span class="font-medium text-stone-700">{{ t('studies.wizard.fields.notes') }}</span>
              <input
                v-model="draft.notes"
                type="text"
                placeholder="Manhãs, sessões de 1h"
                class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </section>

          <section v-else class="flex flex-col gap-4">
            <h2 class="text-base font-semibold text-stone-900">Revise antes de criar</h2>
            <dl class="flex flex-col gap-3">
              <div class="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <dt class="text-xs text-stone-500">{{ t('studies.wizard.fields.title') }}</dt>
                  <dd class="text-sm text-stone-900">{{ draft.title }}</dd>
                </div>
                <button type="button" class="text-sm font-medium text-teal-700 hover:underline" @click="editField('title')">
                  {{ t('studies.wizard.edit') }}
                </button>
              </div>
              <div class="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <dt class="text-xs text-stone-500">{{ t('studies.wizard.fields.objective') }}</dt>
                  <dd class="text-sm text-stone-900">{{ draft.objective }}</dd>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-teal-700 hover:underline"
                  @click="editField('objective')"
                >
                  {{ t('studies.wizard.edit') }}
                </button>
              </div>
              <div class="flex items-start justify-between gap-3">
                <div>
                  <dt class="text-xs text-stone-500">{{ t('studies.wizard.fields.frequency') }}</dt>
                  <dd class="text-sm text-stone-900">
                    {{ draft.frequency }}<span v-if="draft.notes"> · {{ draft.notes }}</span>
                  </dd>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-teal-700 hover:underline"
                  @click="editField('frequency')"
                >
                  {{ t('studies.wizard.edit') }}
                </button>
              </div>
            </dl>
            <p v-if="usageLabel" class="text-xs text-stone-500">{{ usageLabel }}</p>
          </section>

          <p v-if="errorCode" class="mt-4 text-sm text-red-700" role="alert">
            {{ t(`errors.${errorCode}`, t('errors.INTERNAL_ERROR')) }}
          </p>
        </div>

        <footer class="flex justify-end gap-3 border-t border-stone-200 px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-40"
            :disabled="isFirst"
            @click="back()"
          >
            {{ t('common.back') }}
          </button>
          <button
            v-if="!isLast"
            type="button"
            class="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            @click="next()"
          >
            {{ t('common.continue') }}
          </button>
          <button
            v-else
            type="button"
            class="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            :disabled="pending"
            @click="submit"
          >
            {{ pending ? t('common.loading') : t('studies.wizard.submit') }}
          </button>
        </footer>
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-xl text-white" aria-hidden="true">
            ✓
          </span>
          <div>
            <h2 class="text-lg font-semibold text-stone-900">{{ t('studies.wizard.success.title') }}</h2>
            <p class="text-sm text-stone-500">
              {{ t('studies.wizard.success.subtitle', { title: created.title }) }}
            </p>
          </div>
          <button
            type="button"
            class="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
            @click="viewCreatedStudy"
          >
            {{ t('studies.wizard.success.view') }}
          </button>
          <button type="button" class="text-sm font-medium text-teal-700 hover:underline" @click="createAnother">
            {{ t('studies.wizard.success.createAnother') }}
          </button>
        </div>
      </template>
    </div>
  </main>
</template>
