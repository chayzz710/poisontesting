import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RiptidePenProps {
  className?: string
}

export default function RiptidePen({ className = '' }: RiptidePenProps) {
  const [hovered, setHovered] = useState(false)
  const [psst, setPsst] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    setPsst(true)
  }

  const handleNavigate = () => {
    setPsst(false)
    navigate('/profile')
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* The pen/sword */}
      <span
        className="inline-block cursor-pointer transition-all duration-300 select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        style={{ transform: hovered ? 'rotate(-20deg) scale(1.3)' : 'none' }}
      >
        {hovered ? '⚔️' : '🖊️'}
      </span>

      {/* Psst bubble */}
      {psst && (
        <>
          {/* Click outside to dismiss */}
          <span
            className="fixed inset-0 z-40"
            onClick={() => setPsst(false)}
          />
          <span
            className="absolute z-50 top-full right-0 mt-2 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Little triangle pointer */}
            <span className="block w-3 h-3 bg-cream border-l-2 border-t-2 border-orchid/30 rotate-45 ml-auto mr-3 -mb-1.5" />
            
            {/* Bubble */}
            <span className="flex flex-col items-center gap-2 bg-cream border-2 border-orchid/30 rounded-2xl shadow-polaroid px-4 py-3">
              <span className="font-hand text-sm text-chocolate">
                psst… wanna see something cool?
              </span>
              <span className="flex gap-2">
                <button
                  onClick={() => setPsst(false)}
                  className="font-hand text-xs text-chocolate/40 hover:text-chocolate transition px-2 py-1"
                >
                  maybe later
                </button>
                <button
                  onClick={handleNavigate}
                  className="font-hand text-xs text-orchid font-medium hover:text-orchid-deep transition bg-orchid/10 hover:bg-orchid/20 px-3 py-1 rounded-full"
                >
                  yes! →
                </button>
              </span>
            </span>
          </span>
        </>
      )}
    </span>
  )
}