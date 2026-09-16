export type SessionStatus = 'pending' | 'done'

export interface StudySession {
  id: string
  goalId: string
  date: string // ISO date (YYYY-MM-DD)
  plannedMinutes: number
  completedMinutes: number
  status: SessionStatus
}

export interface Goal {
  id: string
  title: string
  subject: string
  totalHours: number
  deadline: string // ISO date (YYYY-MM-DD)
  daysPerWeek: number
  createdAt: string // ISO datetime
}

export interface AppState {
  goals: Goal[]
  sessions: StudySession[]
}
