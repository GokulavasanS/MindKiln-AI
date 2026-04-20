import { useMemo } from 'react'
import PlanDisplay from './PlanDisplay'

export default function ExecutionWorkspace({ plan, onToggleStep }) {
  const progress = useMemo(() => {
    if (!plan?.execution_plan?.length) return 0
    const total = plan.execution_plan.length
    const completed = plan.execution_plan.filter((s) => s.completed).length
    return Math.round((completed / total) * 100)
  }, [plan])

  if (!plan) return null

  return (
    <div className="space-y-6 mt-8">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-kiln-500 uppercase tracking-wider mb-2">Reality check</h2>
          <p className="text-sm text-kiln-800 leading-relaxed whitespace-pre-line">{plan.reality_check}</p>
        </div>
        <div className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-kiln-500 uppercase tracking-wider mb-2">Reframe</h2>
          <p className="text-sm text-kiln-800 leading-relaxed whitespace-pre-line">{plan.reframe}</p>
        </div>
      </section>

      <section className="rounded-xl border border-kiln-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-medium text-kiln-500 uppercase tracking-wider mb-1">Execution progress</h2>
            <p className="text-xs text-kiln-600">
              {progress}% complete · {plan.execution_plan.filter((s) => s.completed).length} of{' '}
              {plan.execution_plan.length} steps
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kiln-100 text-kiln-700 border border-kiln-200">
            {plan.estimated_total_time}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-kiln-100 overflow-hidden">
          <div
            className="h-2 bg-kiln-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <PlanDisplay plan={plan} onToggleStep={onToggleStep} />
    </div>
  )
}

