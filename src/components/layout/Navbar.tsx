import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { toast } from 'sonner'
import RiptidePen from '../motifs/RiptidePen'

const NAV_ITEMS = [
  { to: '/',           emoji: '🌻', label: 'Home'       },
  { to: '/gallery',    emoji: '📸', label: 'Gallery'    },
  { to: '/letters',    emoji: '💌', label: 'Letters'    },
  { to: '/jar',        emoji: '🥚', label: 'Jar'        },
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-sm border-b-0 relative">
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
              title={label}
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 rounded-full text-2xl transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-sunflower/30 shadow-soft'
                  : 'text-chocolate/60 hover:text-chocolate hover:bg-sunflower/20'
                }`
              }
            >
              {emoji}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <RiptidePen className="text-chocolate/30 hover:text-chocolate/80" />
          <button
            onClick={handleSignOut}
            className="btn-ghost text-sm text-chocolate/50 hover:text-chocolate py-1 px-3"
          >
            bye 👋
          </button>
        </div>

      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunflower to-transparent" />
    </nav>
  )
}