import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import PlanHistoryPage from './pages/PlanHistoryPage'

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`text-caption font-medium transition-opacity duration-180 ${
        isActive ? 'text-ink opacity-100' : 'text-ash hover:text-ink-light opacity-70 hover:opacity-100'
      }`}
    >
      {children}
    </Link>
  )
}

function Shell({ children }) {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  // Landing page has its own full-bleed layout — no shell nav
  if (isLanding) return <>{children}</>

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <nav className="border-b border-ink/[0.06] bg-paper/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Kiln mark — a small clay square with rough edges */}
            <span className="h-7 w-7 bg-clay flex items-center justify-center text-paper text-micro font-semibold"
              style={{ borderRadius: '2px' }}>
              MK
            </span>
            <span className="font-serif text-lg text-ink tracking-tight">MindKiln</span>
          </Link>
          <div className="flex items-center gap-5">
            <NavLink to="/app">Workspace</NavLink>
            <NavLink to="/history">History</NavLink>
          </div>
        </div>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/history" element={<PlanHistoryPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
