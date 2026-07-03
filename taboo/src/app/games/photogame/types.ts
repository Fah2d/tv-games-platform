export type PhotoPhase = 'lobby' | 'playing' | 'reveal' | 'finished'

export interface PhotoPlayer {
  id: string
  socketId: string
  name: string
  score: number
  colorIndex: number
  assignedPhoto: string | null  // null during playing (secret), filled during reveal
}

export interface PhotoSettings {
  totalRounds: number
  selectedCategories: string[]
}

export const DEFAULT_PHOTO_SETTINGS: PhotoSettings = {
  totalRounds: 5,
  selectedCategories: ['animals', 'flags', 'foods', 'sport', 'player'],
}

export interface PhotoStatePayload {
  roomCode: string
  phase: PhotoPhase
  settings: PhotoSettings
  players: PhotoPlayer[]   // assignedPhoto is null during playing, filled during reveal
  currentRound: number
  winner: string | null
}

export const PLAYER_COLOR_CLASSES = [
  { bg: 'bg-red-500',    phoneBg: 'bg-red-600',    text: 'text-red-400',    border: 'border-red-500',    btnHover: 'hover:bg-red-500'    },
  { bg: 'bg-blue-500',   phoneBg: 'bg-blue-600',   text: 'text-blue-400',   border: 'border-blue-500',   btnHover: 'hover:bg-blue-500'   },
  { bg: 'bg-green-500',  phoneBg: 'bg-green-600',  text: 'text-green-400',  border: 'border-green-500',  btnHover: 'hover:bg-green-500'  },
  { bg: 'bg-yellow-400', phoneBg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-400', btnHover: 'hover:bg-yellow-400' },
  { bg: 'bg-purple-500', phoneBg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', btnHover: 'hover:bg-purple-500' },
  { bg: 'bg-pink-500',   phoneBg: 'bg-pink-600',   text: 'text-pink-400',   border: 'border-pink-500',   btnHover: 'hover:bg-pink-500'   },
  { bg: 'bg-orange-500', phoneBg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500', btnHover: 'hover:bg-orange-500' },
  { bg: 'bg-teal-500',   phoneBg: 'bg-teal-600',   text: 'text-teal-400',   border: 'border-teal-500',   btnHover: 'hover:bg-teal-500'   },
]
