import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-kiln-50 via-white to-kiln-50">
      <header className="border-b border-kiln-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-xl text-kiln-800">MindKiln AI</h1>
            <p className="text-sm text-kiln-600 mt-0.5">AI Execution Coach</p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-kiln-700 text-white hover:bg-kiln-800 transition-colors"
          >
            Open workspace
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-4xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-kiln-500 mb-3">
              AI execution coach
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-kiln-900 tracking-tight mb-4">
              Turn messy thoughts into clear execution.
            </h2>
            <p className="text-base text-kiln-700 mb-6">
              MindKiln takes vague, emotional goals and forges them into reality-checked, reframed, and sequenced
              execution plans. No hype. Just honest structure.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                to="/app"
                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-kiln-700 text-white hover:bg-kiln-800 shadow-sm transition-colors"
              >
                Start Planning
              </Link>
              <p className="text-xs text-kiln-500">
                Built for founders, operators, and anyone feeling stuck or overwhelmed.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-kiln-100 bg-white/80 shadow-sm p-5 space-y-4">
            <p className="text-xs font-medium text-kiln-500 uppercase tracking-wider">How it thinks</p>
            <div className="space-y-3 text-xs text-kiln-700">
              <div className="rounded-xl border border-kiln-100 bg-kiln-50/80 p-3">
                <p className="font-semibold text-kiln-800 mb-1">Reality Check</p>
                <p>It names what&apos;s vague, magical-thinking, or emotionally overloaded—gently but clearly.</p>
              </div>
              <div className="rounded-xl border border-kiln-100 bg-white p-3">
                <p className="font-semibold text-kiln-800 mb-1">Reframe</p>
                <p>It converts the fantasy into a concrete direction you can actually work on.</p>
              </div>
              <div className="rounded-xl border border-kiln-100 bg-white p-3">
                <p className="font-semibold text-kiln-800 mb-1">Execution Plan</p>
                <p>It sequences the work into realistic, prioritized steps with time estimates.</p>
              </div>
              <div className="rounded-xl border border-kiln-200 bg-kiln-900 text-kiln-50 p-3">
                <p className="font-semibold mb-1">First Action</p>
                <p>It gives you one small thing you can do in the next 30 minutes to unstick yourself.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

