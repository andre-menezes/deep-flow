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
  <main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
    <h1 class="text-3xl font-semibold tracking-tight">{{ t('common.appName') }}</h1>
    <p class="text-stone-600">{{ t('auth.login.subtitle') }}</p>

    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('auth.login.email') }}</span>
        <input
          v-model="email"
          type="email"
          required
          class="rounded-md border border-stone-300 bg-white px-3 py-2"
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span>{{ t('auth.login.password') }}</span>
        <input
          v-model="password"
          type="password"
          required
          minlength="8"
          class="rounded-md border border-stone-300 bg-white px-3 py-2"
        />
      </label>
      <p v-if="errorCode" class="text-sm text-red-700" role="alert">
        {{ t(`errors.${errorCode}`, t('errors.INTERNAL_ERROR')) }}
      </p>
      <button
        type="submit"
        class="rounded-md bg-stone-900 px-4 py-2 text-white disabled:opacity-60"
        :disabled="pending"
      >
        {{ pending ? t('common.loading') : t('auth.login.submit') }}
      </button>
    </form>
  </main>
</template>
