import { useState } from 'react'

export default function GoalSheet({ onSubmit, disabled }) {
  const [goal, setGoal] = useState('')
  const [forged, setForged] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = goal.trim()
    if (trimmed && !disabled) {
      setForged(true)
      onSubmit(trimmed)
    }
  }

  // Reset forged state when user starts typing again
  function handleChange(e) {
    setGoal(e.target.value)
    if (forged) setForged(false)
  }

  const hasText = goal.trim().length > 0

  return (
    <form onSubmit={handleSubmit}>
      <div className="torn-paper p-6 sm:p-8">
        {/* Faint ruled lines */}
        <div
          className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #1C1A17 31px, #1C1A17 32px)',
            backgroundPositionY: '48px',
          }}
        />

        <div className="relative z-10">
          <textarea
            id="goal-input"
            value={goal}
            onChange={handleChange}
            placeholder="Dump it all here. No structure needed."
            className={`goal-textarea ${forged ? 'forged' : ''}`}
            disabled={disabled}
            rows={5}
          />
        </div>

        {/* Ink underline effect */}
        {hasText && (
          <div className="h-0.5 bg-ink/[0.08] mt-1 animate-ink-spread origin-left" />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={disabled || !hasText}
          className="ink-button"
          id="forge-plan-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
            <path d="M8 1v6M8 15v-4M1 8h4M15 8h-4M3.5 3.5l2.5 2.5M12.5 12.5l-2.5-2.5M3.5 12.5l2.5-2.5M12.5 3.5l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Forge Plan
        </button>

        {!disabled && hasText && (
          <span className="text-micro text-ash italic">
            Let it be messy. We'll shape it.
          </span>
        )}
      </div>
    </form>
  )
}
