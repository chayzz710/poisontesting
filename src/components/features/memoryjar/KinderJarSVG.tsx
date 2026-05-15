interface KinderJarSVGProps {
  noteCount: number
}

export default function KinderJarSVG({ noteCount }: KinderJarSVGProps) {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 220"
        className="w-48 h-52 drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Egg bottom half */}
        <ellipse cx="100" cy="150" rx="70" ry="60" fill="#F5C842" opacity="0.9" />

        {/* Egg top half (cracked open) */}
        <path
          d="M 30 130 Q 40 60 100 40 Q 160 60 170 130"
          fill="#FFFDF4"
          stroke="#F5C842"
          strokeWidth="2"
        />

        {/* Crack line */}
        <path
          d="M 30 130 Q 55 115 75 125 Q 95 135 100 120 Q 105 108 125 118 Q 148 128 170 130"
          fill="none"
          stroke="#E2A500"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Inside glow */}
        <ellipse cx="100" cy="128" rx="55" ry="20" fill="#FFF9E6" opacity="0.6" />

        {/* Little notes peeking out */}
        {noteCount > 0 && (
          <>
            <polygon points="85,125 95,105 105,125" fill="#FFFDF4" stroke="#9B7FD4" strokeWidth="1.5" opacity="0.9" />
            {noteCount > 1 && (
              <polygon points="100,122 112,100 120,120" fill="#FFFDF4" stroke="#F5C842" strokeWidth="1.5" opacity="0.8" />
            )}
            {noteCount > 2 && (
              <polygon points="72,126 80,108 90,124" fill="#FFFDF4" stroke="#3B82C4" strokeWidth="1.5" opacity="0.7" />
            )}
          </>
        )}

        {/* Shine on egg */}
        <ellipse cx="75" cy="85" rx="12" ry="8" fill="white" opacity="0.4" transform="rotate(-20 75 85)" />

        {/* Bottom shadow */}
        <ellipse cx="100" cy="208" rx="55" ry="8" fill="#3B1F0E" opacity="0.08" />
      </svg>

      <p className="font-hand text-orchid/60 text-sm mt-1">
        {noteCount === 0 ? 'waiting for memories…' : 'click a note to read it'}
      </p>
    </div>
  )
}
