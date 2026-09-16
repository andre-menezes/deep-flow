import { useMemo, useState } from 'react'
import { useStudy } from '../context/study-store'
import { formatDate, formatMinutes } from '../lib/format'

export function Schedule() {
  const { goals, sessions, toggleSession } = useStudy()
  const [goalFilter, setGoalFilter] = useState<string>('all')

  const goalName = useMemo(() => {
    const map = new Map<string, string>()
    goals.forEach((g) => map.set(g.id, g.title))
    return map
  }, [goals])

  const visible = useMemo(() => {
    return sessions
      .filter((s) => goalFilter === 'all' || s.goalId === goalFilter)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [sessions, goalFilter])

  return (
    <>
      <div className="page-header">
        <h1>Cronograma</h1>
        <p>Suas sessões de estudo planejadas, prontas para acompanhar.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="card empty">
          <div className="empty__emoji">🗓️</div>
          <p>Nenhuma sessão ainda. Crie uma meta para gerar seu cronograma.</p>
        </div>
      ) : (
        <div className="card">
          <div className="row" style={{ marginBottom: 16 }}>
            <label htmlFor="filter" style={{ margin: 0 }}>
              Filtrar por meta:
            </label>
            <select
              id="filter"
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              style={{ maxWidth: 260 }}
            >
              <option value="all">Todas as metas</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Meta</th>
                <th>Planejado</th>
                <th>Concluído</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id}>
                  <td>{formatDate(s.date)}</td>
                  <td>{goalName.get(s.goalId) ?? '—'}</td>
                  <td>{formatMinutes(s.plannedMinutes)}</td>
                  <td>{formatMinutes(s.completedMinutes)}</td>
                  <td>
                    <span
                      className={
                        'badge ' +
                        (s.status === 'done' ? 'badge--done' : 'badge--pending')
                      }
                    >
                      {s.status === 'done' ? 'Concluída' : 'Pendente'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => toggleSession(s.id)}
                    >
                      {s.status === 'done' ? 'Reabrir' : 'Concluir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
