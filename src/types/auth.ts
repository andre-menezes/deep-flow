import type { Entitlements, Plan, Usage, User } from '@/types/entitlements'

export type SessionStatus =
  | 'UNKNOWN'
  | 'INITIALIZING'
  | 'AUTHENTICATED'
  | 'UNAUTHENTICATED'

export type AuthSessionPayload = {
  accessToken: string
  user: User
  plan: Plan
  entitlements: Entitlements
  usage: Usage
}

export type MePayload = {
  user: User
  plan: Plan
  entitlements: Entitlements
  usage: Usage
}
