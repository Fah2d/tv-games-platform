export type TeamId = 'team1' | 'team2'

export type GamePhase = 'setup' | 'round-intro' | 'playing' | 'round-end' | 'match-end'

export interface TeamConfig {
  id: TeamId
  name: string
  color: string
  score: number
}

export interface FawazeeerQuestion {
  id: string
  question: string
  answer: string
}

export interface FawazeeerSettings {
  team1Name: string
  team2Name: string
  team1Color: string
  team2Color: string
  questionsPerRound: number
  totalRounds: number
}

export interface FawazeeerGameState {
  phase: GamePhase
  teams: [TeamConfig, TeamConfig]
  totalRounds: number
  questionsPerRound: number
  currentRound: number
  currentQuestionIndexInRound: number
  showAnswer: boolean
  questionAnswered: boolean
  questions: FawazeeerQuestion[]
}
