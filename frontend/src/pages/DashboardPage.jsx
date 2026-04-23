import { useEffect, useState } from 'react'
import GoalSheet from '../components/GoalSheet'
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
    // Validate the stored token against the server — don't blindly trust localStorage.
    const token = localStorage.getItem('mk_token')
    if (!token) return

    api.me()
      .then((user) => setUserEmail(user.email || 'Signed in'))
      .catch(() => {
        // Token is expired or invalid — clear it so auth panel appears.
        setAuthToken(null)
        setUserEmail(null)
      })
  }, [])

  async function handleSubmit(goal) {
    setError(null)
    setPlan(null)
    setLoading(true)
    try {
      const data = await api.generatePlan(goal)
      setPlan(data)
    } catch (err) {
      const msg = String(err.message || '').toLowerCase()
      // Clear stale/expired token on any auth failure.
      if (msg.includes('unauthorized') || msg.includes('credentials') || msg.includes('401')) {
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
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 sm:py-14">

        {/* Empty state */}
        {!plan && !loading && !error && (
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="font-serif text-display-sm text-ink mb-3"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              Workspace
            </h1>
            {!userEmail ? (
              <p className="text-body text-ash max-w-md mx-auto">
                Sign in to light the kiln. Then dump your messy thoughts and we'll forge them into clarity.
              </p>
            ) : (
              <p className="font-hand text-xl text-ash-dark">
                Your kiln is cold. Write something messy to light it.
              </p>
            )}
          </div>
        )}

        {/* Auth section */}
        {!userEmail && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start mb-10 animate-fade-in">
            <div className="py-6">
              <h2 className="font-serif text-heading text-ink mb-3">
                Before we begin
              </h2>
              <p className="text-body text-ash-dark leading-editorial">
                Create a free account so your goals and plans are saved.
                Once signed in, dump your thoughts and we'll shape them.
              </p>
            </div>
            <AuthPanel onAuthenticated={() => setUserEmail('Signed in')} />
          </div>
        )}

        {/* Signed-in indicator + logout */}
        {userEmail && (
          <div className="flex items-center justify-end mb-6 animate-fade-in">
            <div className="flex items-center gap-3 text-caption text-ash">
              <span className="w-1.5 h-1.5 rounded-full bg-clay inline-block" />
              <span>Signed in</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-ash hover:text-ink-light transition-opacity duration-180 underline underline-offset-2"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Goal Input — the torn-paper sheet */}
        <section className="mb-8">
          <GoalSheet onSubmit={handleSubmit} disabled={loading || !userEmail} />
          {!userEmail && (
            <p className="mt-3 text-caption text-ash italic text-center">
              Sign in first — we need somewhere to keep your plans warm.
            </p>
          )}
        </section>

        {/* Loading state */}
        {loading && (
          <div className="mt-8 animate-fade-in">
            <LoadingSpinner />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-6 torn-paper p-5 animate-fade-in">
            <div className="relative z-10">
              <p className="text-micro uppercase tracking-[0.14em] text-clay mb-1">Something broke</p>
              <p className="text-body text-ink-light">{error}</p>
            </div>
          </div>
        )}

        {/* Plan display */}
        <ExecutionWorkspace plan={plan} onToggleStep={handleToggleStep} />
      </main>
    </div>
  )
}
