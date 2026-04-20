import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import PlanHistoryPage from './pages/PlanHistoryPage'

function Shell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-kiln-50">
      <nav className="border-b border-kiln-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-kiln-700 text-[11px] flex items-center justify-center text-white font-semibold">
              MK
            </span>
            <div>
              <p className="text-sm font-semibold text-kiln-800 leading-none">MindKiln AI</p>
              <p className="text-[11px] text-kiln-500 leading-none mt-0.5">AI Execution Coach</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              to="/app"
              className="text-kiln-700 hover:text-kiln-900"
            >
              Workspace
            </Link>
            <Link
              to="/history"
              className="text-kiln-700 hover:text-kiln-900"
            >
              Plan history
            </Link>
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
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <LandingPage />
            </Shell>
          }
        />
        <Route
          path="/app"
          element={
            <Shell>
              <DashboardPage />
            </Shell>
          }
        />
        <Route
          path="/history"
          element={
            <Shell>
              <PlanHistoryPage />
            </Shell>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
