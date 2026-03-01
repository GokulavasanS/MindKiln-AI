import { useState } from 'react'
import GoalInput from './components/GoalInput'
import PlanDisplay from './components/PlanDisplay'
import LoadingSpinner from './components/LoadingSpinner'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Debug log for deployment
if (API_BASE.includes('your-app.up.railway.app')) {
  console.warn('VITE_API_URL is still set to placeholder. Please update it in Vercel environment variables.')
}
console.log('App connecting to API at:', API_BASE || '(local proxy)')

export default function App() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(goal) {
    setError(null)
    setPlan(null)
    setLoading(true)

    // Ensure URL is clean
    const apiUrl = `${API_BASE.replace(/\/$/, '')}/generate-plan`

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      })

      let data
      try {
        data = await res.json()
      } catch (e) {
        throw new Error(`Server returned non-JSON response (Status: ${res.status}). Check if the backend is running correctly at ${API_BASE}`)
      }

      if (!res.ok) {
        throw new Error(data.detail || `Server error: ${res.status}`)
      }
      setPlan(data)
    } catch (e) {
      console.error('API Error:', e)
      setError(e.message || 'Something went wrong while connecting to the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-kiln-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="font-semibold text-xl text-kiln-800">MindKiln AI</h1>
          <p className="text-sm text-kiln-600 mt-0.5">Turn messy thoughts into structured execution.</p>
        </div>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <GoalInput onSubmit={handleSubmit} disabled={loading} />
        {loading && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}
        {plan && !loading && <PlanDisplay plan={plan} className="mt-8" />}
      </main>
    </div>
  )
}
