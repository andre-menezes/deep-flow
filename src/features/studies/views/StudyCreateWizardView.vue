<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { limits } from '@/features/auth'
import { ApiError } from '@/shared/http'
import { useStudyWizard } from '../composables/useStudyWizard'
import { useStudyListStore } from '../stores/studyListStore'

const { t } = useI18n()
const router = useRouter()
const studies = useStudyListStore()
const {
  currentStep,
  draft,
  stepIndex,
  isFirst,
  isLast,
  next,
  back,
  toPayload,
  steps,
} = useStudyWizard()
const errorCode = ref<string | null>(null)
const pending = ref(false)

async function submit() {
  if (!limits.canCreateStudy()) {
    errorCode.value = 'STUDY_CREATE_LIMIT_REACHED'
    return
  }
  errorCode.value = null
  pending.value = true
  try {
    const created = await studies.createStudy(toPayload())
    await router.push({ name: 'studies-home', query: { created: created.id } })
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : 'INTERNAL_ERROR'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-10">
    <h1 class="text-2xl font-semibold">{{ t('studies.wizard.title') }}</h1>
    <p class="text-sm text-stone-600">
      {{ t('studies.wizard.step', { step: stepIndex + 1, total: steps.length }) }}
    </p>

    <section v-if="currentStep === 'identity'" class="flex flex-col gap-3">
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('studies.wizard.fields.title') }}</span>
        <input v-model="draft.title" required class="rounded-md border border-stone-300 px-3 py-2" />
      </label>
    </section>

    <section v-else-if="currentStep === 'objective'" class="flex flex-col gap-3">
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('studies.wizard.fields.objective') }}</span>
        <textarea
          v-model="draft.objective"
          required
          rows="4"
          class="rounded-md border border-stone-300 px-3 py-2"
        />
      </label>
    </section>

    <section v-else-if="currentStep === 'routine'" class="flex flex-col gap-3">
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('studies.wizard.fields.frequency') }}</span>
        <input v-model="draft.frequency" required class="rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('studies.wizard.fields.notes') }}</span>
        <input v-model="draft.notes" class="rounded-md border border-stone-300 px-3 py-2" />
      </label>
    </section>

    <section v-else class="flex flex-col gap-2 rounded-md border border-stone-200 bg-white p-4 text-sm">
      <p><strong>{{ t('studies.wizard.fields.title') }}:</strong> {{ draft.title }}</p>
      <p><strong>{{ t('studies.wizard.fields.objective') }}:</strong> {{ draft.objective }}</p>
      <p><strong>{{ t('studies.wizard.fields.frequency') }}:</strong> {{ draft.frequency }}</p>
    </section>

    <p v-if="errorCode" class="text-sm text-red-700" role="alert">
      {{ t(`errors.${errorCode}`, t('errors.INTERNAL_ERROR')) }}
    </p>

    <div class="flex gap-3">
      <button
        type="button"
        class="rounded-md border border-stone-300 px-4 py-2"
        :disabled="isFirst"
        @click="back()"
      >
        {{ t('common.back') }}
      </button>
      <button
        v-if="!isLast"
        type="button"
        class="rounded-md bg-stone-900 px-4 py-2 text-white"
        @click="next()"
      >
        {{ t('common.continue') }}
      </button>
      <button
        v-else
        type="button"
        class="rounded-md bg-stone-900 px-4 py-2 text-white disabled:opacity-60"
        :disabled="pending"
        @click="submit"
      >
        {{ pending ? t('common.loading') : t('studies.wizard.submit') }}
      </button>
    </div>
  </main>
</template>
