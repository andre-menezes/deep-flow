import { useEffect, useRef, useState } from 'react'
import { useStudy } from '../context/study-store'

type Mode = 'focus' | 'break'

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export function Pomodoro() {
  const { goals, logFocusMinutes } = useStudy()
  const [mode, setMode] = useState<Mode>('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [completedFocus, setCompletedFocus] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (goals.length > 0 && !selectedGoal) {
      setSelectedGoal(goals[0].id)
    }
  }, [goals, selectedGoal])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (remaining !== 0 || !running) return
    setRunning(false)
    if (mode === 'focus') {
      const minutes = Math.round(DURATIONS.focus / 60)
      if (selectedGoal) logFocusMinutes(selectedGoal, minutes)
      setCompletedFocus((c) => c + 1)
      setMode('break')
      setRemaining(DURATIONS.break)
    } else {
      setMode('focus')
      setRemaining(DURATIONS.focus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  function reset() {
    setRunning(false)
    setRemaining(DURATIONS[mode])
  }

  function switchMode(next: Mode) {
    setRunning(false)
    setMode(next)
    setRemaining(DURATIONS[next])
  }

  const progress = 1 - remaining / DURATIONS[mode]
  const ringStyle = {
    background: `conic-gradient(var(--primary) ${progress * 360}deg, var(--bg-elev) 0deg)`,
  }

  return (
    <>
      <div className="page-header">
        <h1>Foco</h1>
        <p>Técnica Pomodoro: cada ciclo de foco registra tempo na sua meta.</p>
      </div>

      <div className="grid grid--two">
        <div className="card">
          <div className="timer">
            <div className="timer__mode">
              {mode === 'focus' ? '● Foco' : '☕ Pausa'}
            </div>
            <div className="timer__ring" style={ringStyle}>
              <div
                className="timer__ring"
                style={{
                  width: 232,
                  height: 232,
                  background: 'var(--bg-card)',
                }}
              >
                <div className="timer__display">{format(remaining)}</div>
              </div>
            </div>
            <div className="row">
              <button className="btn" onClick={() => setRunning((r) => !r)}>
                {running ? 'Pausar' : 'Iniciar'}
              </button>
              <button className="btn btn--ghost" onClick={reset}>
                Reiniciar
              </button>
            </div>
            <div className="row">
              <button
                className={
                  'btn btn--sm ' + (mode === 'focus' ? '' : 'btn--ghost')
                }
                onClick={() => switchMode('focus')}
              >
                Foco (25min)
              </button>
              <button
                className={
                  'btn btn--sm ' + (mode === 'break' ? '' : 'btn--ghost')
                }
                onClick={() => switchMode('break')}
              >
                Pausa (5min)
              </button>
            </div>
          </div>
        </div>

        <div className="card stack">
          <h3 className="card__title">Sessão de foco</h3>
          {goals.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>
              Crie uma meta para registrar o tempo dos seus ciclos de foco.
            </p>
          ) : (
            <div>
              <label htmlFor="goal">Meta em foco</label>
              <select
                id="goal"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid--stats">
            <div className="card stat-card">
              <div className="stat-card__label">Ciclos concluídos hoje</div>
              <div className="stat-card__value">{completedFocus}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-card__label">Tempo focado</div>
              <div className="stat-card__value">{completedFocus * 25}min</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            Ao final de cada ciclo de foco, 25 minutos são registrados
            automaticamente no cronograma da meta selecionada.
          </p>
        </div>
      </div>
    </>
  )
}
