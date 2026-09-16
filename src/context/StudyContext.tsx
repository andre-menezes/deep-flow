import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, Goal } from '../types'
import { loadState, saveState } from '../storage'
import { generateSchedule } from '../lib/schedule'
import {
  StudyContext,
  type NewGoalInput,
  type StudyContextValue,
} from './study-store'

function createId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<StudyContextValue>(() => {
    function addGoal(input: NewGoalInput): Goal {
      const goal: Goal = {
        id: createId(),
        title: input.title.trim(),
        subject: input.subject.trim(),
        totalHours: input.totalHours,
        deadline: input.deadline,
        daysPerWeek: input.daysPerWeek,
        createdAt: new Date().toISOString(),
      }
      const newSessions = generateSchedule(goal)
      setState((prev) => ({
        goals: [...prev.goals, goal],
        sessions: [...prev.sessions, ...newSessions],
      }))
      return goal
    }

    function removeGoal(goalId: string) {
      setState((prev) => ({
        goals: prev.goals.filter((g) => g.id !== goalId),
        sessions: prev.sessions.filter((s) => s.goalId !== goalId),
      }))
    }

    function logSession(sessionId: string, minutes: number) {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                completedMinutes: Math.max(0, minutes),
                status: minutes >= s.plannedMinutes ? 'done' : s.status,
              }
            : s,
        ),
      }))
    }

    function toggleSession(sessionId: string) {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => {
          if (s.id !== sessionId) return s
          const nowDone = s.status !== 'done'
          return {
            ...s,
            status: nowDone ? 'done' : 'pending',
            completedMinutes: nowDone
              ? Math.max(s.completedMinutes, s.plannedMinutes)
              : 0,
          }
        }),
      }))
    }

    function logFocusMinutes(goalId: string, minutes: number) {
      if (minutes <= 0) return
      setState((prev) => {
        const today = new Date().toISOString().slice(0, 10)
        const sessions = [...prev.sessions]
        const idx = sessions.findIndex(
          (s) => s.goalId === goalId && s.date === today,
        )
        if (idx >= 0) {
          const target = sessions[idx]
          const completed = target.completedMinutes + minutes
          sessions[idx] = {
            ...target,
            completedMinutes: completed,
            status: completed >= target.plannedMinutes ? 'done' : target.status,
          }
        } else {
          sessions.push({
            id: createId(),
            goalId,
            date: today,
            plannedMinutes: minutes,
            completedMinutes: minutes,
            status: 'done',
          })
        }
        return { ...prev, sessions }
      })
    }

    return {
      goals: state.goals,
      sessions: state.sessions,
      addGoal,
      removeGoal,
      logSession,
      toggleSession,
      logFocusMinutes,
    }
  }, [state])

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}
