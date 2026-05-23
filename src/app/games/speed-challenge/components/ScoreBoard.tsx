import type { SpeedPlayer } from '../types'
import { PLAYER_COLOR_CLASSES } from '../types'

interface Props {
  players: SpeedPlayer[]
  currentRound: number
  totalRounds: number
}

export default function ScoreBoard({ players, currentRound, totalRounds }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">النقاط</span>
        <span className="text-zinc-500 text-xs">
          الجولة {currentRound} / {totalRounds}
        </span>
      </div>
      <div className="divide-y divide-zinc-800">
        {sorted.map((p, idx) => {
          const colors = PLAYER_COLOR_CLASSES[p.colorIndex % PLAYER_COLOR_CLASSES.length]
          return (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <span className="text-zinc-600 text-sm w-5 text-center">{idx + 1}</span>
              <div className={`w-3 h-3 rounded-full shrink-0 ${colors.bg}`} />
              <span className="flex-1 text-white font-medium">{p.name}</span>
              <span className={`font-black text-xl ${colors.text}`}>{p.score}</span>
            </div>
          )
        })}
        {players.length === 0 && (
          <p className="text-zinc-600 text-center py-4 text-sm">لا يوجد لاعبون بعد</p>
        )}
      </div>
    </div>
  )
}
