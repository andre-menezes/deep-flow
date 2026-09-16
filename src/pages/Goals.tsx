import { useState, type FormEvent } from 'react'
import { useStudy, type NewGoalInput } from '../context/study-store'
import { goalProgress } from '../lib/schedule'
import { daysUntil, formatMinutes } from '../lib/format'

function defaultDeadline(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

const EMPTY_FORM: NewGoalInput = {
  title: '',
  subject: '',
  totalHours: 20,
  deadline: defaultDeadline(),
  daysPerWeek: 5,
}

export function Goals() {
  const { goals, sessions, addGoal, removeGoal } = useStudy()
  const [form, setForm] = useState<NewGoalInput>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Informe um título para a meta.')
      return
    }
    if (form.totalHours <= 0) {
      setError('A carga horária deve ser maior que zero.')
      return
    }
    if (daysUntil(form.deadline) < 0) {
      setError('O prazo precisa ser uma data futura.')
      return
    }
    addGoal(form)
    setForm({ ...EMPTY_FORM, deadline: defaultDeadline() })
    setError(null)
  }

  return (
    <>
      <div className="page-header">
        <h1>Metas</h1>
        <p>Defina objetivos de aprendizado e gere cronogramas automaticamente.</p>
      </div>

      <div className="stack">
        <div className="card">
          <h3 className="card__title">Nova meta</h3>
          <form onSubmit={handleSubmit} className="stack">
            <div className="form-grid">
              <div>
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  placeholder="Ex.: Dominar Álgebra Linear"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="subject">Área / disciplina</label>
                <input
                  id="subject"
                  placeholder="Ex.: Matemática"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="hours">Carga horária (h)</label>
                <input
                  id="hours"
                  type="number"
                  min={1}
                  value={form.totalHours}
                  onChange={(e) =>
                    setForm({ ...form, totalHours: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label htmlFor="days">Dias por semana</label>
                <select
                  id="days"
                  value={form.daysPerWeek}
                  onChange={(e) =>
                    setForm({ ...form, daysPerWeek: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'dia' : 'dias'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="deadline">Prazo</label>
                <input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                />
              </div>
            </div>
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</div>
            )}
            <div className="row row--end">
              <button type="submit" className="btn">
                Criar meta e gerar cronograma
              </button>
            </div>
          </form>
        </div>

        {goals.length === 0 ? (
          <div className="card empty">
            <div className="empty__emoji">🎯</div>
            <p>Nenhuma meta cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid--two">
            {goals.map((goal) => {
              const { percent, completedMinutes, plannedMinutes } =
                goalProgress(goal, sessions)
              const remaining = daysUntil(goal.deadline)
              return (
                <div key={goal.id} className="card goal">
                  <div className="goal__head">
                    <div>
                      <h3 className="goal__title">{goal.title}</h3>
                      <div className="goal__meta">
                        <span className="tag">{goal.subject || 'Geral'}</span>{' '}
                        · {goal.totalHours}h · {goal.daysPerWeek}x/semana
                      </div>
                    </div>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => removeGoal(goal.id)}
                      aria-label={`Remover meta ${goal.title}`}
                    >
                      Remover
                    </button>
                  </div>

                  <div>
                    <div className="progress__label">
                      <span>{percent}% concluído</span>
                      <span>
                        {formatMinutes(completedMinutes)} /{' '}
                        {formatMinutes(plannedMinutes)}
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress__bar"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="goal__meta">
                    {remaining >= 0
                      ? `⏳ ${remaining} dia(s) até o prazo`
                      : '⚠️ prazo vencido'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
