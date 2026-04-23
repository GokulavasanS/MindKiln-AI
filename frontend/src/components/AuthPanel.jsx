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
    <div className="torn-paper p-6 sm:p-8">
      <div className="relative z-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-xl text-ink">
            {mode === 'login' ? 'Welcome back' : 'Join the kiln'}
          </h2>
          <button
            type="button"
            className="text-caption text-ash hover:text-ink-light transition-opacity duration-180"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'New here?' : 'Have an account?'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="ink-underline">
            <label className="block text-micro uppercase tracking-[0.12em] text-ash mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-2 bg-transparent border-none border-b border-ink/10 text-body text-ink placeholder-ash-light focus:outline-none"
              style={{ borderBottom: '1px solid rgba(28, 26, 23, 0.1)' }}
              placeholder="you@example.com"
            />
          </div>

          <div className="ink-underline">
            <label className="block text-micro uppercase tracking-[0.12em] text-ash mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-0 py-2 bg-transparent border-none border-b border-ink/10 text-body text-ink placeholder-ash-light focus:outline-none"
              style={{ borderBottom: '1px solid rgba(28, 26, 23, 0.1)' }}
              placeholder="8+ characters"
            />
          </div>

          {error && (
            <p className="text-caption text-clay font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="ink-button w-full mt-2"
          >
            {loading
              ? 'Working…'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
