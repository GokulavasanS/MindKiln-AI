function PriorityBadge({ level }) {
  const styles = {
    High: 'bg-amber-100 text-amber-800 border-amber-200',
    Medium: 'bg-sky-100 text-sky-800 border-sky-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  const s = styles[level] || styles.Low
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s}`}>
      {level}
    </span>
  )
}

function StepCard({ step }) {
  const priorityColors = {
    High: 'border-l-amber-500 bg-amber-50/50',
    Medium: 'border-l-sky-500 bg-sky-50/50',
    Low: 'border-l-slate-400 bg-slate-50/50',
  }
  const c = priorityColors[step.priority] || priorityColors.Low
  return (
    <article className={`rounded-xl border border-kiln-200 border-l-4 p-4 ${c}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-sm font-medium text-kiln-600">Step {step.step_number}</span>
        <PriorityBadge level={step.priority} />
        <span className="text-xs text-kiln-500 ml-auto">{step.estimated_time}</span>
      </div>
      <h3 className="font-semibold text-kiln-800 mb-1">{step.title}</h3>
      <p className="text-sm text-kiln-700 leading-relaxed">{step.description}</p>
    </article>
  )
}

export default function PlanDisplay({ plan, className = '' }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary card */}
      <section className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium text-kiln-500 uppercase tracking-wider mb-2">Goal summary</h2>
        <p className="text-kiln-800 font-medium">{plan.goal_summary}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <PriorityBadge level={plan.priority_level} />
          <span className="text-sm text-kiln-600">{plan.estimated_total_time}</span>
        </div>
      </section>

      {/* First action – highlighted */}
      <section className="rounded-xl border-2 border-kiln-500 bg-kiln-100/80 p-5">
        <h2 className="text-sm font-medium text-kiln-600 uppercase tracking-wider mb-2">
          First action to take now
        </h2>
        <p className="text-kiln-900 font-medium leading-relaxed">{plan.first_action_to_take_now}</p>
      </section>

      {/* Execution steps */}
      <section>
        <h2 className="text-sm font-medium text-kiln-500 uppercase tracking-wider mb-3">
          Execution plan
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {plan.execution_plan.map((step) => (
            <li key={step.step_number}>
              <StepCard step={step} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
