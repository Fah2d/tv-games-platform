'use client'

import { PLAYER_COLOR_CLASSES } from '../types'
import type { FastestPhase } from '../types'

interface BuzzerButtonProps {
  myName: string
  buzzedPlayerName: string | null
  phase: FastestPhase
  colorIndex: number
  onBuzz: () => void
}

export default function BuzzerButton({
  myName,
  buzzedPlayerName,
  phase,
  colorIndex,
  onBuzz,
}: BuzzerButtonProps) {
  const colors = PLAYER_COLOR_CLASSES[colorIndex % PLAYER_COLOR_CLASSES.length]

  const isOpen = phase === 'ready' && buzzedPlayerName === null
  const iBuzzed = phase === 'buzzed' && buzzedPlayerName === myName
  const isLocked = phase === 'buzzed' && buzzedPlayerName !== myName

  if (iBuzzed) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-64 h-64 rounded-full bg-green-500 flex flex-col items-center justify-center ring-8 ring-green-300 animate-pulse shadow-2xl">
          <span className="text-7xl">✓</span>
          <span className="text-2xl font-black text-white mt-2">أنت الأسرع!</span>
        </div>
        <p className="text-green-300 text-xl font-bold animate-bounce">⚡ في انتظار المضيف...</p>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-64 h-64 rounded-full bg-zinc-700 flex flex-col items-center justify-center opacity-50">
          <span className="text-7xl">🔒</span>
          <span className="text-xl font-bold text-zinc-400 mt-2">متأخر!</span>
        </div>
        <p className="text-zinc-500 text-lg">{buzzedPlayerName} كان الأسرع</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onBuzz}
        disabled={!isOpen}
        className={`w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl font-black transition-transform
          ${isOpen
            ? `${colors.bg} ${colors.hover} text-white ring-4 ${colors.ring} active:scale-90 cursor-pointer`
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-40'
          }`}
      >
        <span className="text-7xl">🔴</span>
        <span className="text-2xl mt-2">{isOpen ? 'اضغط!' : 'انتظر...'}</span>
      </button>
      {isOpen && (
        <p className="text-yellow-400 text-lg font-bold animate-pulse">⚡ جاهز!</p>
      )}
    </div>
  )
}
