import { PLAYER_COLOR_CLASSES } from '../types'
import type { FastestPlayer } from '../types'

interface ScoreBoardProps {
  players: FastestPlayer[]
  currentQuestion: number
  totalQuestions: number
}

export default function ScoreBoard({ players, currentQuestion, totalQuestions }: ScoreBoardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
      <div className="px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
        <p className="text-zinc-400 text-sm font-medium">النقاط</p>
        <p className="text-zinc-500 text-xs">السؤال {currentQuestion} / {totalQuestions}</p>
      </div>
      <div className="divide-y divide-zinc-800">
        {sorted.map((p, idx) => {
          const colors = PLAYER_COLOR_CLASSES[p.colorIndex % PLAYER_COLOR_CLASSES.length]
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-zinc-500 text-sm w-5 text-center font-bold">{idx + 1}</span>
              <div className={`w-3 h-3 rounded-full shrink-0 ${colors.bg}`} />
              <span className="text-white font-medium flex-1">{p.name}</span>
              <span className={`font-black text-xl ${colors.text}`}>{p.score}</span>
            </div>
          )
        })}
        {players.length === 0 && (
          <div className="px-4 py-6 text-center text-zinc-600 text-sm">لا يوجد لاعبون</div>
        )}
      </div>
    </div>
  )
}
