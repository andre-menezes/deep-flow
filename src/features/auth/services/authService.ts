import { http } from '@/shared/http'
import type { AuthSessionPayload, MePayload } from '@/types/auth'

export type LoginBody = {
  email: string
  password: string
}

export const authService = {
  login(body: LoginBody) {
    return http<AuthSessionPayload>('/auth/login', { method: 'POST', body })
  },
  refresh() {
    return http<AuthSessionPayload>('/auth/refresh', { method: 'POST' })
  },
  logout() {
    return http<void>('/auth/logout', { method: 'POST' })
  },
  me() {
    return http<MePayload>('/auth/me')
  },
}
