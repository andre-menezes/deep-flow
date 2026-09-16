import { createContext, useContext } from 'react'
import type { Goal, StudySession } from '../types'

export interface NewGoalInput {
  title: string
  subject: string
  totalHours: number
  deadline: string
  daysPerWeek: number
}

export interface StudyContextValue {
  goals: Goal[]
  sessions: StudySession[]
  addGoal: (input: NewGoalInput) => Goal
  removeGoal: (goalId: string) => void
  logSession: (sessionId: string, minutes: number) => void
  toggleSession: (sessionId: string) => void
  logFocusMinutes: (goalId: string, minutes: number) => void
}

export const StudyContext = createContext<StudyContextValue | null>(null)

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext)
  if (!ctx) {
    throw new Error('useStudy deve ser usado dentro de <StudyProvider>')
  }
  return ctx
}
