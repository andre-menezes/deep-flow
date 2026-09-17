import { useAuthStore } from '@/features/auth'

export async function initSession() {
  const auth = useAuthStore()
  await auth.initSession()
}
