import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { toast } from 'sonner'
import RiptidePen from '../motifs/RiptidePen'

const NAV_ITEMS = [
  { to: '/',           emoji: '🌻', label: 'Home'       },
  { to: '/gallery',    emoji: '📸', label: 'Gallery'    },
  { to: '/letters',    emoji: '💌', label: 'Letters'    },
  { to: '/jar',        emoji: '🥚', label: 'Memory Jar' },
  { to: '/puns',       emoji: '😩', label: 'Puns'       },
  { to: '/map',        emoji: '📍', label: 'Map'        },
  { to: '/playlist',   emoji: '🎵', label: 'Playlist'   },
  { to: '/bucketlist', emoji: '♟️', label: 'Bucket List'},
]

export default function Navbar() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    sessionStorage.removeItem('gate')
    toast('see you soon 💛')
    navigate('/gate')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-sunflower/30">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-2">
        {/* Logo */}
        <span className="font-hand text-orchid-deep text-lg shrink-0">
          💛 our little corner
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, emoji, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-sunflower text-chocolate shadow-soft'
                  : 'text-chocolate/60 hover:text-chocolate hover:bg-sunflower/20'
                }`
              }
            >
              <span>{emoji}</span>
              <span className="hidden xl:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <RiptidePen className="text-chocolate/30 hover:text-chocolate/80" />
          <button
            onClick={handleSignOut}
            className="btn-ghost text-sm text-chocolate/50 hover:text-chocolate"
          >
            bye 👋
          </button>
        </div>
      </div>
    </nav>
  )
}
