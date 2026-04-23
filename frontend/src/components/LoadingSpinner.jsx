export default function LoadingSpinner() {
  return (
    <div className="forge-loading" aria-label="Loading">
      <div className="ember" role="img" aria-hidden />
      <p className="font-hand text-xl text-ash-dark">
        The kiln is firing…
      </p>
      <p className="text-caption text-ash italic mt-1">
        Shaping your mess into something real.
      </p>
    </div>
  )
}
