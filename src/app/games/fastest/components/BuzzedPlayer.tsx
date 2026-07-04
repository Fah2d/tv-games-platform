import { PLAYER_COLOR_CLASSES } from '../types'
import type { FastestPlayer } from '../types'

interface BuzzedPlayerProps {
  player: FastestPlayer
}

export default function BuzzedPlayer({ player }: BuzzedPlayerProps) {
  const colors = PLAYER_COLOR_CLASSES[player.colorIndex % PLAYER_COLOR_CLASSES.length]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-8xl animate-bounce">⚡</div>
      <div className={`rounded-3xl px-10 py-6 border-4 ${colors.border} text-center`}>
        <p className="text-5xl font-black text-white mb-2">{player.name}</p>
        <p className={`text-2xl font-bold ${colors.text}`}>كان الأسرع!</p>
      </div>
    </div>
  )
}
