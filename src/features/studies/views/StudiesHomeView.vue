<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { limits } from '@/features/auth'
import { useAuthStore } from '@/features/auth'
import { ApiError } from '@/shared/http'
import { useStudyListStore } from '../stores/studyListStore'

const { t } = useI18n()
const studies = useStudyListStore()
const auth = useAuthStore()
const errorCode = ref<string | null>(null)

onMounted(async () => {
  try {
    await studies.fetchStudies()
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : 'INTERNAL_ERROR'
  }
})
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
    <header class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">{{ t('studies.home.title') }}</h1>
        <p class="text-stone-600">{{ t('studies.home.subtitle') }}</p>
      </div>
      <button class="text-sm text-stone-700 underline" type="button" @click="auth.logout()">
        {{ t('common.logout') }}
      </button>
    </header>

    <RouterLink
      v-if="limits.canCreateStudy()"
      class="inline-flex w-fit rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      :to="{ name: 'studies-create' }"
    >
      {{ t('studies.home.create') }}
    </RouterLink>
    <p v-else class="text-sm text-amber-800">{{ t('errors.STUDY_CREATE_LIMIT_REACHED') }}</p>

    <p v-if="errorCode" class="text-sm text-red-700" role="alert">
      {{ t(`errors.${errorCode}`, t('errors.INTERNAL_ERROR')) }}
    </p>

    <p v-if="studies.status === 'success' && studies.data.length === 0" class="text-sm text-stone-500">
      {{ t('studies.home.empty') }}
    </p>

    <ul class="flex flex-col gap-3">
      <li
        v-for="study in studies.data"
        :key="study.id"
        class="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
      >
        <p class="font-medium text-stone-900">{{ study.title }}</p>
        <p class="text-sm text-stone-600">{{ study.objective }}</p>
        <p class="mt-1 text-xs uppercase tracking-wide text-stone-500">{{ study.status }}</p>
      </li>
    </ul>
  </main>
</template>
