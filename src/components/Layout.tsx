import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Painel', icon: '📊', end: true },
  { to: '/metas', label: 'Metas', icon: '🎯', end: false },
  { to: '/cronograma', label: 'Cronograma', icon: '🗓️', end: false },
  { to: '/foco', label: 'Foco', icon: '⏱️', end: false },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__logo">🌊</span>
          <div>
            <div>Deep Flow</div>
            <div className="brand__sub">Estudos contínuos</div>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                'nav__link' + (isActive ? ' active' : '')
              }
            >
              <span className="nav__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          Transforme grandes metas de aprendizado em cronogramas práticos.
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  )
}
