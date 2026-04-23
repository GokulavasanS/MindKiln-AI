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
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 sm:py-14">
        {/* Page header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="font-serif text-display-sm text-ink mb-2"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            History
          </h1>
          <p className="text-body text-ash">
            Every mess you've shaped. Revisit and continue.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start">
          {/* Plan list — left sidebar */}
          <section className="animate-fade-in">
            <p className="text-micro uppercase tracking-[0.14em] text-ash mb-4">
              Previous goals
            </p>

            <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#B5AFA7 transparent' }}>
              {loadingList && (
                <p className="text-caption text-ash italic font-hand text-lg">Loading…</p>
              )}
              {!loadingList && plans.length === 0 && (
                <div className="py-8 text-center">
                  <p className="font-hand text-lg text-ash-dark">
                    No plans yet.
                  </p>
                  <p className="text-caption text-ash mt-1">
                    Go to the workspace and forge your first one.
                  </p>
                </div>
              )}
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left px-4 py-3 transition-all duration-180 group ${
                    p.id === selectedId
                      ? 'bg-white shadow-torn'
                      : 'hover:bg-white/50'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  <p className={`text-caption leading-snug mb-1 line-clamp-2 ${
                    p.id === selectedId ? 'text-ink font-medium' : 'text-ink-light'
                  }`}>
                    {p.goal_text}
                  </p>
                  <p className="text-micro text-ash">
                    {new Date(p.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Plan detail — right content */}
          <section className="min-h-[300px]">
            {loadingDetail && (
              <div className="forge-loading">
                <div className="ember" />
                <p className="font-hand text-lg text-ash-dark">Loading plan…</p>
              </div>
            )}

            {error && (
              <div className="torn-paper p-5">
                <div className="relative z-10">
                  <p className="text-caption text-clay">{error}</p>
                </div>
              </div>
            )}

            {!loadingDetail && !selectedPlan && !error && (
              <div className="py-16 text-center animate-fade-in">
                <p className="font-hand text-xl text-ash-dark">
                  Select a plan to revisit it.
                </p>
              </div>
            )}

            {selectedPlan && !loadingDetail && (
              <div className="animate-fade-in">
                {/* Original goal */}
                <div className="torn-paper p-5 mb-8">
                  <div className="relative z-10">
                    <p className="text-micro uppercase tracking-[0.14em] text-ash mb-2">
                      Original goal
                    </p>
                    <p className="font-hand text-lg text-ink-light leading-relaxed whitespace-pre-line">
                      {selectedPlan.goal_text}
                    </p>
                  </div>
                </div>

                <PlanDisplay plan={selectedPlan} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
