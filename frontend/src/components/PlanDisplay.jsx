import StepChapter from './StepChapter'

export default function PlanDisplay({ plan, className = '', onToggleStep }) {
  if (!plan) return null

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Goal Summary */}
      {plan.goal_summary && (
        <div className="animate-rise" style={{ opacity: 0 }}>
          <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2">Goal Summary</p>
          <h2 className="font-serif text-heading text-ink">{plan.goal_summary}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-caption text-ash">
            {plan.priority_level && (
              <span className="text-clay font-medium">{plan.priority_level}</span>
            )}
            {plan.estimated_total_time && <span>{plan.estimated_total_time}</span>}
          </div>
        </div>
      )}

      {/* Reality Check & Reframe as Marginalia */}
      {(plan.reality_check || plan.reframe) && (
        <div className="grid gap-6 md:grid-cols-2 animate-rise" style={{ animationDelay: '100ms', opacity: 0 }}>
          {plan.reality_check && (
            <div className="marginalia">
              <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Reality Check
              </p>
              <p className="whitespace-pre-line">{plan.reality_check}</p>
            </div>
          )}
          {plan.reframe && (
            <div className="marginalia">
              <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Reframe
              </p>
              <p className="whitespace-pre-line">{plan.reframe}</p>
            </div>
          )}
        </div>
      )}

      {/* First action – Polaroid */}
      {plan.first_action_to_take_now && (
        <div className="flex justify-center animate-rise" style={{ animationDelay: '200ms', opacity: 0 }}>
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

      {/* Execution steps as chapters */}
      {plan.execution_plan?.length > 0 && (
        <section className="animate-rise" style={{ animationDelay: '300ms', opacity: 0 }}>
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
      )}
    </div>
  )
}
