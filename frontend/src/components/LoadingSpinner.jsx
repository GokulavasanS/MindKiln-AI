export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3" aria-label="Loading">
      <div
        className="w-10 h-10 rounded-full border-2 border-kiln-200 border-t-kiln-600 animate-spin"
        role="img"
        aria-hidden
      />
      <p className="text-sm text-kiln-600">Forging your plan…</p>
    </div>
  )
}
