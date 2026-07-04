export type SpeedPhase = 'lobby' | 'countdown' | 'challenge' | 'selecting' | 'finished'

export interface SpeedPlayer {
  id: string
  socketId: string
  name: string
  score: number
  colorIndex: number
}

export interface SpeedSettings {
  totalRounds: number
  selectedCategories: string[]
}

export const DEFAULT_SPEED_SETTINGS: SpeedSettings = {
  totalRounds: 10,
  selectedCategories: ['physical', 'vocal', 'thinking', 'creative'],
}

export interface SpeedChallenge {
  text: string
  categoryId: string
}

export interface SpeedStatePayload {
  roomCode: string
  phase: SpeedPhase
  settings: SpeedSettings
  players: SpeedPlayer[]
  currentRound: number
  countdownValue: number | null
  currentChallenge: SpeedChallenge | null
  lastWinnerName: string | null
  winner: string | null
}

// Full Tailwind class names per player color slot — must appear verbatim for Tailwind to include them
export const PLAYER_COLOR_CLASSES = [
  { bg: 'bg-red-500',    phoneBg: 'bg-red-600',    text: 'text-red-400',    border: 'border-red-500',    btnHover: 'hover:bg-red-400'    },
  { bg: 'bg-blue-500',   phoneBg: 'bg-blue-600',   text: 'text-blue-400',   border: 'border-blue-500',   btnHover: 'hover:bg-blue-400'   },
  { bg: 'bg-green-500',  phoneBg: 'bg-green-600',  text: 'text-green-400',  border: 'border-green-500',  btnHover: 'hover:bg-green-400'  },
  { bg: 'bg-yellow-400', phoneBg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-400', btnHover: 'hover:bg-yellow-300' },
  { bg: 'bg-purple-500', phoneBg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', btnHover: 'hover:bg-purple-400' },
  { bg: 'bg-pink-500',   phoneBg: 'bg-pink-600',   text: 'text-pink-400',   border: 'border-pink-500',   btnHover: 'hover:bg-pink-400'   },
  { bg: 'bg-orange-500', phoneBg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500', btnHover: 'hover:bg-orange-400' },
  { bg: 'bg-teal-500',   phoneBg: 'bg-teal-600',   text: 'text-teal-400',   border: 'border-teal-500',   btnHover: 'hover:bg-teal-400'   },
]
