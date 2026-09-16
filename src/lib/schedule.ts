import type { Goal, StudySession } from '../types'

const WEEKDAYS = [1, 2, 3, 4, 5] // Mon-Fri
const WEEKEND = [6, 0] // Sat, Sun

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function pickStudyWeekdays(daysPerWeek: number): number[] {
  const clamped = Math.max(1, Math.min(7, Math.round(daysPerWeek)))
  const ordered = [...WEEKDAYS, ...WEEKEND]
  return ordered.slice(0, clamped)
}

/**
 * Distributes a goal's total study time across evenly spaced sessions between
 * "today" and the deadline, honoring the requested days-per-week cadence.
 *
 * Remainder minutes are spread onto the earliest sessions so the plan always
 * sums exactly to the goal's total, avoiding rounding drift over long horizons.
 */
export function generateSchedule(
  goal: Goal,
  today: Date = new Date(),
): StudySession[] {
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)

  const deadline = new Date(goal.deadline + 'T00:00:00')
  if (Number.isNaN(deadline.getTime()) || deadline < start) {
    return []
  }

  const studyDays = pickStudyWeekdays(goal.daysPerWeek)
  const candidateDates: Date[] = []
  for (
    let d = new Date(start);
    d <= deadline;
    d.setDate(d.getDate() + 1)
  ) {
    if (studyDays.includes(d.getDay())) {
      candidateDates.push(new Date(d))
    }
  }

  if (candidateDates.length === 0) {
    return []
  }

  const totalMinutes = Math.round(goal.totalHours * 60)
  const base = Math.floor(totalMinutes / candidateDates.length)
  let remainder = totalMinutes - base * candidateDates.length

  return candidateDates.map((date, index) => {
    const extra = remainder > 0 ? 1 : 0
    remainder -= extra
    return {
      id: `${goal.id}-${index}`,
      goalId: goal.id,
      date: toISODate(date),
      plannedMinutes: base + extra,
      completedMinutes: 0,
      status: 'pending' as const,
    }
  })
}

export function goalProgress(
  goal: Goal,
  sessions: StudySession[],
): { plannedMinutes: number; completedMinutes: number; percent: number } {
  const goalSessions = sessions.filter((s) => s.goalId === goal.id)
  const plannedMinutes = goalSessions.reduce(
    (sum, s) => sum + s.plannedMinutes,
    0,
  )
  const completedMinutes = goalSessions.reduce(
    (sum, s) => sum + s.completedMinutes,
    0,
  )
  const target = Math.round(goal.totalHours * 60)
  const percent =
    target === 0 ? 0 : Math.min(100, Math.round((completedMinutes / target) * 100))
  return { plannedMinutes, completedMinutes, percent }
}
