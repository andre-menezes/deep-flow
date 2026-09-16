import { describe, expect, it } from 'vitest'
import { generateSchedule, goalProgress } from './schedule'
import type { Goal } from '../types'

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'g1',
    title: 'Meta de teste',
    subject: 'Testes',
    totalHours: 10,
    deadline: '2026-01-31',
    daysPerWeek: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('generateSchedule', () => {
  const today = new Date('2026-01-01T00:00:00')

  it('distributes the exact total of planned minutes across sessions', () => {
    const goal = makeGoal({ totalHours: 10 })
    const sessions = generateSchedule(goal, today)

    expect(sessions.length).toBeGreaterThan(0)
    const total = sessions.reduce((sum, s) => sum + s.plannedMinutes, 0)
    expect(total).toBe(600) // 10h * 60min, no rounding drift
  })

  it('only schedules on the requested number of weekdays', () => {
    const goal = makeGoal({ daysPerWeek: 2, deadline: '2026-01-14' })
    const sessions = generateSchedule(goal, today)

    const weekdays = new Set(
      sessions.map((s) => new Date(s.date + 'T00:00:00').getDay()),
    )
    expect(weekdays.size).toBeLessThanOrEqual(2)
  })

  it('returns an empty schedule when the deadline is in the past', () => {
    const goal = makeGoal({ deadline: '2025-12-01' })
    expect(generateSchedule(goal, today)).toEqual([])
  })

  it('creates sessions with a stable, unique id per goal', () => {
    const goal = makeGoal()
    const sessions = generateSchedule(goal, today)
    const ids = new Set(sessions.map((s) => s.id))
    expect(ids.size).toBe(sessions.length)
  })
})

describe('goalProgress', () => {
  it('computes completion percentage from logged minutes', () => {
    const goal = makeGoal({ totalHours: 10 })
    const sessions = generateSchedule(goal, new Date('2026-01-01T00:00:00'))
    sessions[0].completedMinutes = 300 // 5h of 10h

    const { percent, completedMinutes } = goalProgress(goal, sessions)
    expect(completedMinutes).toBe(300)
    expect(percent).toBe(50)
  })

  it('caps progress at 100 percent', () => {
    const goal = makeGoal({ totalHours: 1 })
    const sessions = generateSchedule(goal, new Date('2026-01-01T00:00:00'))
    sessions[0].completedMinutes = 9999

    expect(goalProgress(goal, sessions).percent).toBe(100)
  })
})
