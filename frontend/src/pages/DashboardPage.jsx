import { useEffect, useState } from 'react'
import GoalInput from '../components/GoalInput'
import LoadingSpinner from '../components/LoadingSpinner'
import ExecutionWorkspace from '../components/ExecutionWorkspace'
import AuthPanel from '../components/AuthPanel'
import { api, setAuthToken } from '../api'

export default function DashboardPage() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    // Very lightweight "session" — just presence of token.
    const token = localStorage.getItem('mk_token')
    if (token) {
      // We don't have a /me endpoint yet; keep email only in memory once logged in.
      setUserEmail('Signed in')
    }
  }, [])

  async function handleSubmit(goal) {
    setError(null)
    setPlan(null)
    setLoading(true)
    try {
      const data = await api.generatePlan(goal)
      setPlan(data)
    } catch (err) {
      if (String(err.message || '').toLowerCase().includes('unauthorized')) {
        setAuthToken(null)
        setUserEmail(null)
      }
      setError(err.message || 'Something went wrong while generating the plan.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStep(step, completed) {
    if (!step.step_id) return
    try {
      await api.updateStep(step.step_id, completed)
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          execution_plan: prev.execution_plan.map((s) =>
            s.step_id === step.step_id ? { ...s, completed } : s,
          ),
        }
      })
    } catch (err) {
      console.error('Failed to update step', err)
    }
  }

  function handleLogout() {
    api.logout()
    setUserEmail(null)
    setPlan(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-kiln-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-semibold text-xl text-kiln-800">MindKiln AI</h1>
            <p className="text-sm text-kiln-600 mt-0.5">Turn messy thoughts into clear execution.</p>
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="text-xs text-kiln-600">{userEmail}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-kiln-600 hover:text-kiln-800 underline underline-offset-2"
                >
                  Log out
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {!userEmail && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start mb-4">
            <div className="rounded-xl border border-dashed border-kiln-200 bg-kiln-50/60 p-5">
              <h2 className="text-sm font-medium text-kiln-600 uppercase tracking-wider mb-2">
                Sign in to start planning
              </h2>
              <p className="text-sm text-kiln-700">
                Create a free account so your goals and plans can be saved. Once signed in, you can generate plans and
                revisit them in your history.
              </p>
            </div>
            <AuthPanel onAuthenticated={() => setUserEmail('Signed in')} />
          </div>
        )}

        <section className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-kiln-600 uppercase tracking-wider mb-3">Goal Input</h2>
          <GoalInput onSubmit={handleSubmit} disabled={loading || !userEmail} />
          {!userEmail && (
            <p className="mt-2 text-xs text-kiln-500">
              You&apos;ll need to sign in first so we can save your plans.
            </p>
          )}
        </section>

        {loading && (
          <div className="mt-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}

        <ExecutionWorkspace plan={plan} onToggleStep={handleToggleStep} />
      </main>
    </div>
  )
}

