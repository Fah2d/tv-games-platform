'use client'

import type { FastestPhase } from '../types'

interface HostControlsProps {
  phase: FastestPhase
  buzzedPlayerName: string | null
  pointsPerCorrect: number
  onAward: (points: number) => void
  onNext: () => void
  onEnd: () => void
}

export default function HostControls({
  phase,
  buzzedPlayerName,
  pointsPerCorrect,
  onAward,
  onNext,
  onEnd,
}: HostControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t-4 border-yellow-500 px-4 py-3 z-40">
      <div className="max-w-4xl mx-auto flex gap-2 flex-wrap items-center justify-center">

        {/* Award buttons — only visible when someone has buzzed */}
        {phase === 'buzzed' && buzzedPlayerName && (
          <>
            <button
              onClick={() => onAward(pointsPerCorrect)}
              className="px-5 py-2 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              ✓ صح ({pointsPerCorrect} نقطة)
            </button>
            <button
              onClick={() => onAward(0)}
              className="px-5 py-2 rounded-xl font-bold text-sm bg-red-700 hover:bg-red-800 text-white transition-colors"
            >
              ✗ خطأ (0 نقطة)
            </button>
          </>
        )}

        {/* Skip — visible when buzzers are open with no buzz */}
        {phase === 'ready' && (
          <button
            onClick={onNext}
            className="px-5 py-2 rounded-xl font-bold text-sm bg-zinc-600 hover:bg-zinc-700 text-zinc-300 border border-zinc-500 transition-colors"
          >
            ⏭ تخطي السؤال
          </button>
        )}

        {/* End game — always visible */}
        <button
          onClick={onEnd}
          className="px-4 py-2 rounded-xl font-bold text-sm bg-red-900/60 hover:bg-red-900 text-red-300 border border-red-700/50 transition-colors"
        >
          🏁 إنهاء
        </button>
      </div>
    </div>
  )
}
