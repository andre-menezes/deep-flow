export type Plan = 'FREE' | 'PREMIUM'

export type Capability = string

export type LimitKey = string

export type Entitlements = {
  capabilities: Capability[]
  limits: Record<string, number>
}

export type UsageCounter = {
  used: number
  limit: number
  remaining: number
}

export type Usage = {
  studyCreationsThisPeriod: UsageCounter
}

export type User = {
  id: string
  email: string
  displayName: string
}
