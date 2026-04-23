import { useMemo } from 'react'
import StepChapter from './StepChapter'

export default function ExecutionWorkspace({ plan, onToggleStep }) {
  const progress = useMemo(() => {
    if (!plan?.execution_plan?.length) return 0
    const total = plan.execution_plan.length
    const completed = plan.execution_plan.filter((s) => s.completed).length
    return Math.round((completed / total) * 100)
  }, [plan])

  const completedCount = plan?.execution_plan?.filter((s) => s.completed).length || 0
  const totalCount = plan?.execution_plan?.length || 0

  if (!plan) return null

  return (
    <div className="space-y-10 mt-10 animate-fade-in">
      {/* Post-forge micro-copy */}
      <p className="text-center font-hand text-xl text-ash-dark animate-slide-up">
        That was a lot. We shaped it.
      </p>

      {/* Marginalia: Reality Check & Reframe as coach annotations */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        {plan.reality_check && (
          <div className="marginalia animate-rise" style={{ animationDelay: '100ms', opacity: 0 }}>
            <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
              Reality Check
            </p>
            <p className="whitespace-pre-line">{plan.reality_check}</p>
          </div>
        )}
        {plan.reframe && (
          <div className="marginalia animate-rise" style={{ animationDelay: '200ms', opacity: 0 }}>
            <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
              Reframe
            </p>
            <p className="whitespace-pre-line">{plan.reframe}</p>
          </div>
        )}
      </div>

      <hr className="hand-divider" />

      {/* Goal Summary */}
      {plan.goal_summary && (
        <div className="text-center max-w-xl mx-auto animate-rise" style={{ animationDelay: '250ms', opacity: 0 }}>
          <p className="text-micro uppercase tracking-[0.14em] text-ash mb-3">Forged Goal</p>
          <h2 className="font-serif text-heading text-ink text-balance">{plan.goal_summary}</h2>
          <div className="flex items-center justify-center gap-4 mt-3 text-caption text-ash">
            {plan.priority_level && <span>{plan.priority_level} priority</span>}
            {plan.estimated_total_time && (
              <>
                <span className="w-1 h-1 rounded-full bg-ash/30" />
                <span>{plan.estimated_total_time}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* First Action — Polaroid Note */}
      {plan.first_action_to_take_now && (
        <div className="flex justify-center animate-rise" style={{ animationDelay: '350ms', opacity: 0 }}>
          <div className="polaroid-note max-w-md w-full">
            <p className="text-micro uppercase tracking-[0.14em] text-clay mb-3">
              Do this in the next 30 minutes
            </p>
            <p className="font-serif text-lg text-ink leading-relaxed">
              {plan.first_action_to_take_now}
            </p>
          </div>
        </div>
      )}

      <hr className="hand-divider" />

      {/* Kiln Firing Line (Progress) */}
      <section className="animate-rise" style={{ animationDelay: '400ms', opacity: 0 }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-micro uppercase tracking-[0.14em] text-ash mb-1">Kiln Progress</p>
            <p className="text-caption text-ash-dark">
              {completedCount} of {totalCount} steps fired
            </p>
          </div>
          <span className="font-serif text-xl text-ink">{progress}%</span>
        </div>
        <div className="kiln-fire-track">
          <div className="kiln-fire-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      {/* Steps as Chapters */}
      <section className="animate-rise" style={{ animationDelay: '450ms', opacity: 0 }}>
        <p className="text-micro uppercase tracking-[0.14em] text-ash mb-6">Execution Plan</p>
        <div className="space-y-8">
          {plan.execution_plan.map((step, i) => (
            <StepChapter
              key={step.step_id || step.step_number}
              step={step}
              index={i}
              onToggle={(completed) => onToggleStep?.(step, completed)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
