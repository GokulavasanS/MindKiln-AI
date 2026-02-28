import { useState } from 'react'

export default function GoalInput({ onSubmit, disabled }) {
  const [goal, setGoal] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = goal.trim()
    if (trimmed && !disabled) onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="goal" className="block text-sm font-medium text-kiln-700">
        Your goal
      </label>
      <textarea
        id="goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g. I need to prepare for a software engineering interview but I feel overwhelmed"
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-kiln-200 bg-white text-kiln-900 placeholder-kiln-400 focus:outline-none focus:ring-2 focus:ring-kiln-500 focus:border-transparent resize-y min-h-[100px]"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !goal.trim()}
        className="w-full py-3 px-4 rounded-xl bg-kiln-600 text-white font-medium hover:bg-kiln-700 focus:outline-none focus:ring-2 focus:ring-kiln-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Forge Plan
      </button>
    </form>
  )
}
