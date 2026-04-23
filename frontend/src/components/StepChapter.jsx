import { useState } from 'react'

export default function StepChapter({ step, index, onToggle }) {
  const [justCompleted, setJustCompleted] = useState(false)
  const completed = !!step.completed

  function handleToggle() {
    const newState = !completed
    if (newState && !completed) {
      setJustCompleted(true)
      setTimeout(() => setJustCompleted(false), 1200)
    }
    onToggle?.(newState)
  }

  return (
    <div className="chapter-step animate-rise" style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}>
      {/* Chapter number */}
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <button
          type="button"
          onClick={handleToggle}
          className={`clay-stamp ${completed ? 'clay-stamp--done' : 'clay-stamp--empty'}`}
          aria-label={completed ? `Mark step ${step.step_number} incomplete` : `Complete step ${step.step_number}`}
        >
          {completed && '✓'}
        </button>
      </div>

      {/* Content */}
      <div className={`transition-opacity duration-220 ${completed ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-baseline gap-3 mb-1.5">
          <span className="font-serif text-heading text-ink" style={{ fontSize: '1.35rem' }}>
            {String(step.step_number).padStart(2, '0')}
          </span>
          <h3 className={`font-serif text-lg text-ink ${completed ? 'line-through decoration-clay/40' : ''}`}>
            {step.title}
          </h3>
        </div>

        <p className="text-body text-ash-dark leading-editorial mb-2">
          {step.description}
        </p>

        <div className="flex items-center gap-4 text-micro text-ash">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
              <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {step.estimated_time}
          </span>
          {step.priority && (
            <span className={`
              ${step.priority === 'High' ? 'text-clay' : ''}
              ${step.priority === 'Medium' ? 'text-ash-dark' : ''}
              ${step.priority === 'Low' ? 'text-ash' : ''}
            `}>
              {step.priority} priority
            </span>
          )}
          {/* Hand-drawn star for completion */}
          {justCompleted && (
            <span className="hand-star" role="img" aria-label="completed">★</span>
          )}
        </div>
      </div>
    </div>
  )
}
