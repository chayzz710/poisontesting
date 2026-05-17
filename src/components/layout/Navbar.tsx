import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { toast } from 'sonner'
import RiptidePen from '../motifs/RiptidePen'

const NAV_ITEMS = [
  { to: '/',           emoji: '🌻', label: 'home'        },
  { to: '/gallery',    emoji: '📸', label: 'gallery'     },
  { to: '/letters',    emoji: '💌', label: 'letters'     },
  { to: '/jar',        emoji: '🥚', label: 'memory jar'  },
  { to: '/puns',       emoji: '😩', label: 'pun wall'    },
  { to: '/map',        emoji: '📍', label: 'map'         },
  { to: '/playlist',   emoji: '🎵', label: 'playlist'    },
  { to: '/bucketlist', emoji: '♟️', label: 'bucket list' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [tooltipX, setTooltipX] = useState(0)

  async function handleSignOut() {
    await signOut()
    sessionStorage.removeItem('gate')
    toast('see you soon 💛')
    navigate('/gate')
  }

  function handleMouseEnter(e: React.MouseEvent, label: string) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltipX(rect.left + rect.width / 2)
    setHoveredLabel(label)
  }

  function handleMouseLeave() {
    setHoveredLabel(null)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-sm relative">
      <div className="w-full px-6 h-16 flex items-center justify-between gap-2">

        <span className="font-hand text-orchid-deep text-base shrink-0 hidden md:block">
          💛 our little corner
        </span>

        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 justify-center">
          {NAV_ITEMS.map(({ to, emoji, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 rounded-full text-2xl transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-sunflower/30 shadow-soft'
                  : 'text-chocolate/60 hover:text-chocolate hover:bg-sunflower/20'
                }`
              }
              onMouseEnter={(e) => handleMouseEnter(e, label)}
              onMouseLeave={handleMouseLeave}
            >
              {emoji}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <RiptidePen className="text-chocolate/30 hover:text-chocolate/80" />
          <button
            onClick={handleSignOut}
            onMouseEnter={(e) => handleMouseEnter(e, 'sign out')}
            onMouseLeave={handleMouseLeave}
            className="btn-ghost text-sm text-chocolate/50 hover:text-chocolate py-1 px-3"
          >
            bye 👋
          </button>
        </div>

      </div>

      {/* single tooltip rendered fixed — escapes overflow clipping */}
      {hoveredLabel && (
        <span
          className="fixed top-16 font-hand text-sm text-orchid-deep bg-cream border border-orchid/20 px-3 py-1.5 rounded-full shadow-soft tracking-wide z-50 pointer-events-none -translate-x-1/2 whitespace-nowrap"
          style={{ left: tooltipX }}
        >
          {hoveredLabel}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunflower to-transparent" />
    </nav>
  )
}