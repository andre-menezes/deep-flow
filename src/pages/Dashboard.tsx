import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useStudy } from '../context/study-store'
import { goalProgress } from '../lib/schedule'
import { formatMinutes } from '../lib/format'
import { StatCard } from '../components/StatCard'

function lastNDays(n: number): string[] {
  const days: string[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  for (let i = n - 1; i >= 0; i--) {
    const day = new Date(d)
    day.setDate(d.getDate() - i)
    days.push(day.toISOString().slice(0, 10))
  }
  return days
}

export function Dashboard() {
  const { goals, sessions } = useStudy()

  const totalCompleted = sessions.reduce((s, x) => s + x.completedMinutes, 0)
  const totalPlanned = sessions.reduce((s, x) => s + x.plannedMinutes, 0)
  const doneCount = sessions.filter((s) => s.status === 'done').length

  const overallPercent =
    totalPlanned === 0
      ? 0
      : Math.min(100, Math.round((totalCompleted / totalPlanned) * 100))

  const chartData = useMemo(() => {
    const days = lastNDays(14)
    return days.map((date) => {
      const minutes = sessions
        .filter((s) => s.date === date)
        .reduce((sum, s) => sum + s.completedMinutes, 0)
      return {
        date: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
        horas: Math.round((minutes / 60) * 10) / 10,
      }
    })
  }, [sessions])

  return (
    <>
      <div className="page-header">
        <h1>Painel</h1>
        <p>Acompanhamento visual do seu desempenho de estudos.</p>
      </div>

      {goals.length === 0 ? (
        <div className="card empty">
          <div className="empty__emoji">🌱</div>
          <h2>Comece criando sua primeira meta</h2>
          <p>
            Defina um objetivo de aprendizado e o Deep Flow gera um cronograma
            prático para você.
          </p>
          <Link to="/metas" className="btn" style={{ display: 'inline-block' }}>
            Criar meta
          </Link>
        </div>
      ) : (
        <div className="stack">
          <div className="grid grid--stats">
            <StatCard label="Metas ativas" value={String(goals.length)} />
            <StatCard
              label="Horas estudadas"
              value={formatMinutes(totalCompleted)}
              hint={`de ${formatMinutes(totalPlanned)} planejadas`}
            />
            <StatCard
              label="Sessões concluídas"
              value={String(doneCount)}
              hint={`${sessions.length} no total`}
            />
            <StatCard label="Progresso geral" value={`${overallPercent}%`} />
          </div>

          <div className="card">
            <h3 className="card__title">Horas estudadas (últimos 14 dias)</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26304f" />
                  <XAxis dataKey="date" stroke="#97a3c7" fontSize={12} />
                  <YAxis stroke="#97a3c7" fontSize={12} allowDecimals />
                  <Tooltip
                    contentStyle={{
                      background: '#141a2e',
                      border: '1px solid #26304f',
                      borderRadius: 10,
                      color: '#e6ebff',
                    }}
                    formatter={(v: number) => [`${v} h`, 'Horas']}
                  />
                  <Area
                    type="monotone"
                    dataKey="horas"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#flow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="card__title">Progresso por meta</h3>
            <div className="stack">
              {goals.map((goal) => {
                const { percent, completedMinutes } = goalProgress(
                  goal,
                  sessions,
                )
                return (
                  <div key={goal.id}>
                    <div className="progress__label">
                      <span>
                        {goal.title}{' '}
                        <span className="tag">{goal.subject}</span>
                      </span>
                      <span>
                        {percent}% · {formatMinutes(completedMinutes)}
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress__bar"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
