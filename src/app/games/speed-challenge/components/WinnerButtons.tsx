import type { SpeedPlayer } from '../types'
import { PLAYER_COLOR_CLASSES } from '../types'

interface Props {
  players: SpeedPlayer[]
  onAward: (playerName: string) => void
  onSkip: () => void
}

export default function WinnerButtons({ players, onAward, onSkip }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t-4 border-yellow-500 px-4 py-4 z-40">
      <p className="text-center text-zinc-400 text-sm mb-3">من أكمل التحدي أولًا؟</p>
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {players.map((p) => {
          const colors = PLAYER_COLOR_CLASSES[p.colorIndex % PLAYER_COLOR_CLASSES.length]
          return (
            <button
              key={p.id}
              onClick={() => onAward(p.name)}
              className={`px-5 py-2 rounded-xl font-bold text-white text-base transition-colors ${colors.bg} ${colors.btnHover}`}
            >
              {p.name}
            </button>
          )
        })}
      </div>
      <div className="flex justify-center">
        <button
          onClick={onSkip}
          className="px-8 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-medium text-sm transition-colors"
        >
          تخطّي
        </button>
      </div>
    </div>
  )
}
