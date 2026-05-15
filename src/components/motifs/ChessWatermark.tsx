export default function ChessWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 100 100"
        width="500"
        height="500"
        style={{ opacity: 0.03 }}
        fill="#3B1F0E"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Queen piece silhouette */}
        <ellipse cx="50" cy="90" rx="28" ry="7" />
        <rect x="28" y="82" width="44" height="10" rx="3" />
        <rect x="33" y="60" width="34" height="24" rx="2" />
        <ellipse cx="50" cy="58" rx="17" ry="6" />
        {/* Crown points */}
        <circle cx="30" cy="48" r="5" />
        <circle cx="50" cy="44" r="5" />
        <circle cx="70" cy="48" r="5" />
        <circle cx="38" cy="44" r="3" />
        <circle cx="62" cy="44" r="3" />
        <path d="M25 58 L30 44 L38 52 L50 40 L62 52 L70 44 L75 58 Z" />
      </svg>
    </div>
  )
}
