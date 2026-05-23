export type FastestPhase = 'lobby' | 'ready' | 'buzzed' | 'finished'

export interface FastestPlayer {
  id: string
  socketId: string
  name: string
  score: number
  colorIndex: number
}

export interface FastestSettings {
  totalQuestions: number
  pointsPerCorrect: number
  maxPlayers: number
}

export const DEFAULT_FASTEST_SETTINGS: FastestSettings = {
  totalQuestions: 10,
  pointsPerCorrect: 10,
  maxPlayers: 8,
}

export interface FastestStatePayload {
  roomCode: string
  phase: FastestPhase
  settings: FastestSettings
  players: FastestPlayer[]
  currentQuestion: number
  buzzedPlayerName: string | null
  buzzTimestamp: number | null
  winner: string | null
}

// Full Tailwind class names per player color slot — must appear verbatim for Tailwind to include them
export const PLAYER_COLOR_CLASSES = [
  { bg: 'bg-red-500',    hover: 'hover:bg-red-400',    ring: 'ring-red-400',    text: 'text-red-400',    border: 'border-red-500'    },
  { bg: 'bg-blue-500',   hover: 'hover:bg-blue-400',   ring: 'ring-blue-400',   text: 'text-blue-400',   border: 'border-blue-500'   },
  { bg: 'bg-green-500',  hover: 'hover:bg-green-400',  ring: 'ring-green-400',  text: 'text-green-400',  border: 'border-green-500'  },
  { bg: 'bg-yellow-400', hover: 'hover:bg-yellow-300', ring: 'ring-yellow-300', text: 'text-yellow-400', border: 'border-yellow-400' },
  { bg: 'bg-purple-500', hover: 'hover:bg-purple-400', ring: 'ring-purple-400', text: 'text-purple-400', border: 'border-purple-500' },
  { bg: 'bg-pink-500',   hover: 'hover:bg-pink-400',   ring: 'ring-pink-400',   text: 'text-pink-400',   border: 'border-pink-500'   },
  { bg: 'bg-orange-500', hover: 'hover:bg-orange-400', ring: 'ring-orange-400', text: 'text-orange-400', border: 'border-orange-500' },
  { bg: 'bg-teal-500',   hover: 'hover:bg-teal-400',   ring: 'ring-teal-400',   text: 'text-teal-400',   border: 'border-teal-500'   },
]
