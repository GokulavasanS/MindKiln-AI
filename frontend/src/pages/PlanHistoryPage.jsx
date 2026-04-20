import { useEffect, useState } from 'react'
import { api } from '../api'
import PlanDisplay from '../components/PlanDisplay'

export default function PlanHistoryPage() {
  const [plans, setPlans] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoadingList(true)
      setError(null)
      try {
        const data = await api.listPlans()
        setPlans(data)
        if (data.length && !selectedId) {
          setSelectedId(data[0].id)
        }
      } catch (err) {
        setError(err.message || 'Failed to load plans')
      } finally {
        setLoadingList(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    async function loadDetail() {
      setLoadingDetail(true)
      try {
        const data = await api.getPlan(selectedId)
        setSelectedPlan(data)
      } catch (err) {
        setError(err.message || 'Failed to load plan')
      } finally {
        setLoadingDetail(false)
      }
    }
    loadDetail()
  }, [selectedId])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-kiln-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="font-semibold text-xl text-kiln-800">Plan history</h1>
          <p className="text-sm text-kiln-600 mt-0.5">Review and reopen your previous execution plans.</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-kiln-600 uppercase tracking-[0.14em] mb-1">
            Previous goals
          </h2>
          <div className="rounded-xl border border-kiln-200 bg-white p-3 max-h-[480px] overflow-y-auto space-y-1">
            {loadingList && <p className="text-xs text-kiln-500">Loading…</p>}
            {!loadingList && plans.length === 0 && (
              <p className="text-sm text-kiln-500">No plans yet. Generate a plan from the dashboard first.</p>
            )}
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${p.id === selectedId
                    ? 'border-kiln-500 bg-kiln-50'
                    : 'border-transparent hover:border-kiln-200 hover:bg-kiln-50/60'
                  }`}
              >
                <p className="line-clamp-2 text-kiln-800 text-xs mb-1">{p.goal_text}</p>
                <p className="text-[11px] text-kiln-500">
                  {new Date(p.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-kiln-600 uppercase tracking-[0.14em] mb-1">Plan details</h2>
          <div className="rounded-xl border border-kiln-200 bg-white p-4 min-h-[260px]">
            {loadingDetail && <p className="text-xs text-kiln-500">Loading plan…</p>}
            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
            {!loadingDetail && !selectedPlan && !error && (
              <p className="text-sm text-kiln-500">Select a plan on the left to view its details.</p>
            )}
            {selectedPlan && (
              <div className="space-y-3">
                <div className="rounded-xl border border-kiln-100 bg-kiln-50/70 p-3">
                  <p className="text-xs font-medium text-kiln-600 uppercase tracking-[0.16em] mb-1">
                    Original goal
                  </p>
                  <p className="text-sm text-kiln-800 whitespace-pre-line">{selectedPlan.goal_text}</p>
                </div>
                <PlanDisplay plan={selectedPlan} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

