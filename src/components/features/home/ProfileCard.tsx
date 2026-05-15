import { motion } from 'framer-motion'

import type { Profile } from '../../../types'

interface ProfileCardProps {
  profile: Profile
  stats?: {
    letters?: number
    puns?: number
    photos?: number
  }
  delay?: number
}

export default function ProfileCard({ profile, stats = {}, delay = 0 }: ProfileCardProps) {
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card flex flex-col items-center gap-4 text-center w-64"
    >
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sunflower/50 shadow-soft bg-sunflower/10 flex items-center justify-center text-4xl">
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt={profile.display_name ?? ''} className="w-full h-full object-cover" />
          : '🐱'
        }
      </div>

      {/* Name */}
      <div>
        <h3 className="font-display text-2xl text-chocolate">{profile.display_name}</h3>
        {profile.nickname && (
          <p className="font-hand text-orchid-deep text-lg">"{profile.nickname}"</p>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-chocolate/60 leading-relaxed">{profile.bio}</p>
      )}

      {/* Love language */}
      {profile.love_language && (
        <span className="px-3 py-1 bg-sunflower/20 rounded-full font-hand text-sm text-chocolate/70">
          💛 {profile.love_language}
        </span>
      )}

      {/* Fav things */}
      {profile.fav_things && profile.fav_things.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {profile.fav_things.map((thing: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-orchid/10 text-orchid-deep rounded-full font-hand">
              {thing}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {Object.keys(stats).length > 0 && (
        <div className="flex gap-4 pt-2 border-t border-chocolate/10 w-full justify-center">
          {stats.letters != null && (
            <div className="text-center">
              <p className="font-display text-lg text-chocolate">{stats.letters}</p>
              <p className="text-xs text-chocolate/50 font-hand">letters</p>
            </div>
          )}
          {stats.puns != null && (
            <div className="text-center">
              <p className="font-display text-lg text-chocolate">{stats.puns}</p>
              <p className="text-xs text-chocolate/50 font-hand">puns</p>
            </div>
          )}
          {stats.photos != null && (
            <div className="text-center">
              <p className="font-display text-lg text-chocolate">{stats.photos}</p>
              <p className="text-xs text-chocolate/50 font-hand">photos</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
