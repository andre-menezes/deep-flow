import { useAuthStore } from '@/features/auth/stores/authStore'

export function can(capability: string) {
  return useAuthStore().can(capability)
}

export const limits = {
  canCreateStudy() {
    return useAuthStore().canCreateStudy()
  },
}

export function useUsage() {
  return useAuthStore().usage
}
