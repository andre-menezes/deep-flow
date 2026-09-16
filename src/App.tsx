import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Goals } from './pages/Goals'
import { Schedule } from './pages/Schedule'
import { Pomodoro } from './pages/Pomodoro'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/metas" element={<Goals />} />
        <Route path="/cronograma" element={<Schedule />} />
        <Route path="/foco" element={<Pomodoro />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
