import { useState } from 'react'
import { api } from '../api'

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await api.register(email, password)
      }
      await api.login(email, password)
      onAuthenticated?.(email)
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-kiln-600 uppercase tracking-wider">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <button
          type="button"
          className="text-xs text-kiln-500 hover:text-kiln-700 underline underline-offset-2"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'New here? Sign up' : 'Have an account? Log in'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-kiln-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-kiln-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kiln-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-kiln-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 rounded-lg border border-kiln-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kiln-500 focus:border-transparent"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-kiln-600 text-white text-sm font-medium hover:bg-kiln-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Working…' : mode === 'login' ? 'Log in' : 'Sign up & log in'}
        </button>
      </form>
    </div>
  )
}

