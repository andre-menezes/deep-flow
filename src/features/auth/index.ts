export { authRoutes } from './routes'
export { useAuthStore } from './stores/authStore'
export { can, limits, useUsage } from './entitlements'

import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

export const authMessages = {
  'pt-BR': ptBR,
  en,
}
