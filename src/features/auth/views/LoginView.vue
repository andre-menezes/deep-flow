<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ApiError } from '@/shared/http'
import { useAuthStore } from '../stores/authStore'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errorCode = ref<string | null>(null)
const pending = ref(false)

async function onSubmit() {
  errorCode.value = null
  pending.value = true
  try {
    await auth.login(email.value, password.value)
    await router.push({ name: 'studies-home' })
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : 'INTERNAL_ERROR'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div class="flex flex-col gap-1 px-6 pt-6">
        <h1 class="text-xl font-semibold tracking-tight text-stone-900">{{ t('common.appName') }}</h1>
        <p class="text-sm text-stone-500">{{ t('auth.login.subtitle') }}</p>
      </div>

      <form class="flex flex-col gap-4 px-6 py-6" @submit.prevent="onSubmit">
        <label class="flex flex-col gap-1.5 text-sm">
          <span class="font-medium text-stone-700">{{ t('auth.login.email') }}</span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="voce@studia.app"
            class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </label>
        <label class="flex flex-col gap-1.5 text-sm">
          <span class="font-medium text-stone-700">{{ t('auth.login.password') }}</span>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="current-password"
            class="rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </label>

        <p v-if="errorCode" class="text-sm text-red-700" role="alert">
          {{ t(`errors.${errorCode}`, t('errors.INTERNAL_ERROR')) }}
        </p>

        <button
          type="submit"
          class="mt-1 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          :disabled="pending"
        >
          {{ pending ? t('common.loading') : t('auth.login.submit') }}
        </button>
      </form>
    </div>
  </main>
</template>
