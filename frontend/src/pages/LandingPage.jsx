import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const MESSY_TEXT = `I have too many ideas and I don't know where to start and I keep switching between projects and nothing gets done and I feel like I'm wasting time...`

const FORGED_TEXT = `Prioritize one project for 2 weeks. Define 3 measurable milestones. Block 90-minute deep work sessions. Review progress every Friday.`

function LiveDemo() {
  const [phase, setPhase] = useState('messy') // messy → forging → forged
  const [displayText, setDisplayText] = useState('')
  const timerRef = useRef(null)
  const charIndex = useRef(0)

  useEffect(() => {
    // Type out the messy text character by character
    charIndex.current = 0
    setDisplayText('')

    timerRef.current = setInterval(() => {
      if (charIndex.current < MESSY_TEXT.length) {
        setDisplayText(MESSY_TEXT.slice(0, charIndex.current + 1))
        charIndex.current++
      } else {
        clearInterval(timerRef.current)
        // After typing is done, pause then forge
        setTimeout(() => {
          setPhase('forging')
          setTimeout(() => {
            setPhase('forged')
            setDisplayText(FORGED_TEXT)
            // Reset after showing forged state
            setTimeout(() => {
              setPhase('messy')
              charIndex.current = 0
              setDisplayText('')
              // Restart the typing
              timerRef.current = setInterval(() => {
                if (charIndex.current < MESSY_TEXT.length) {
                  setDisplayText(MESSY_TEXT.slice(0, charIndex.current + 1))
                  charIndex.current++
                } else {
                  clearInterval(timerRef.current)
                  setTimeout(() => {
                    setPhase('forging')
                    setTimeout(() => {
                      setPhase('forged')
                      setDisplayText(FORGED_TEXT)
                    }, 1200)
                  }, 1500)
                }
              }, 30)
            }, 4000)
          }, 1200)
        }, 1500)
      }
    }, 30)

    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="relative bg-white p-6 sm:p-8 shadow-torn" style={{ borderRadius: '2px' }}>
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px',
        }}
      />

      <div className="relative z-10 min-h-[180px]">
        {phase === 'forging' ? (
          <div className="flex items-center justify-center h-[180px]">
            <div className="forge-loading">
              <div className="ember" />
              <p className="text-caption text-ash italic font-hand text-lg">Forging clarity…</p>
            </div>
          </div>
        ) : (
          <p className={phase === 'forged' ? 'demo-text-forged animate-fade-in' : 'demo-text-messy'}>
            {displayText}
            {phase === 'messy' && <span className="inline-block w-0.5 h-5 bg-ink/30 ml-0.5 animate-pulse" />}
          </p>
        )}
      </div>

      {/* Phase label */}
      <div className="mt-4 pt-4 border-t border-ink/[0.06]">
        <p className="text-micro uppercase tracking-[0.15em] text-ash">
          {phase === 'messy' && '↑ Raw brain-dump'}
          {phase === 'forging' && '⟳ The kiln is working…'}
          {phase === 'forged' && '✓ Forged into clarity'}
        </p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Minimal landing nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span
            className="h-7 w-7 bg-clay flex items-center justify-center text-paper text-micro font-semibold"
            style={{ borderRadius: '2px' }}
          >
            MK
          </span>
          <span className="font-serif text-lg text-ink tracking-tight">MindKiln</span>
        </div>
        <Link
          to="/app"
          className="text-caption font-medium text-ash hover:text-ink transition-opacity duration-180"
        >
          Open workspace →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24 w-full grid gap-12 lg:gap-20 lg:grid-cols-[1fr_minmax(0,420px)] items-center">
          {/* Left: editorial headline */}
          <div>
            <h1 className="font-serif text-display text-ink text-balance mb-6"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
              Turn messy thoughts<br />
              into clear execution.
            </h1>
            <p className="text-body-lg text-ash-dark leading-editorial max-w-[480px] mb-8">
              You arrive overwhelmed. You type the mess. MindKiln forges it
              into a reality-checked, reframed execution plan — with the first
              thing to do in the next 30 minutes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/app" className="clay-button">
                Start Planning
              </Link>
              <span className="text-caption text-ash">
                For founders, operators, and the perpetually overwhelmed.
              </span>
            </div>

            {/* Hand-drawn divider */}
            <hr className="hand-divider mt-10" />

            {/* Subtle feature line */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2">
              {['Reality check', 'Reframe', 'Execution plan', 'First action'].map((item) => (
                <span key={item} className="text-caption text-ash flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay/40 inline-block" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: live demo */}
          <div className="lg:pl-4">
            <LiveDemo />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-micro text-ash">
          MindKiln — not another chatbot. A tool a potter would love.
        </p>
      </footer>
    </div>
  )
}
