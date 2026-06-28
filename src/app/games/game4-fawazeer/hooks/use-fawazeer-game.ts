'use client'

import { useReducer } from 'react'
import type {
  FawazeeerGameState,
  FawazeeerSettings,
  TeamId,
  TeamConfig,
} from '../types'
import { QUESTIONS, shuffleQuestions } from '../questions'

type FawazeeerAction =
  | { type: 'INIT_GAME'; payload: FawazeeerSettings }
  | { type: 'START_ROUND' }
  | { type: 'SHOW_ANSWER' }
  | { type: 'AWARD_POINT'; payload: { teamId: TeamId } }
  | { type: 'SKIP' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' }

const initialTeams: [TeamConfig, TeamConfig] = [
  { id: 'team1', name: 'الفريق الأول', color: '#34D399', score: 0 },
  { id: 'team2', name: 'الفريق الثاني', color: '#F87171', score: 0 },
]

const initialState: FawazeeerGameState = {
  phase: 'setup',
  teams: initialTeams,
  totalRounds: 3,
  questionsPerRound: 5,
  currentRound: 1,
  currentQuestionIndexInRound: 0,
  showAnswer: false,
  questionAnswered: false,
  questions: [],
}

function fawazeeerReducer(
  state: FawazeeerGameState,
  action: FawazeeerAction,
): FawazeeerGameState {
  switch (action.type) {
    case 'INIT_GAME': {
      const { team1Name, team2Name, team1Color, team2Color, questionsPerRound, totalRounds } =
        action.payload

      const shuffled = shuffleQuestions(QUESTIONS)
      const totalRequested = totalRounds * questionsPerRound
      const actualTotal = Math.min(shuffled.length, totalRequested)
      const actualQPerRound = Math.max(1, Math.floor(actualTotal / totalRounds))
      const selected = shuffled.slice(0, actualQPerRound * totalRounds)

      const teams: [TeamConfig, TeamConfig] = [
        { id: 'team1', name: team1Name.trim() || 'الفريق الأول', color: team1Color, score: 0 },
        { id: 'team2', name: team2Name.trim() || 'الفريق الثاني', color: team2Color, score: 0 },
      ]

      return {
        phase: 'round-intro',
        teams,
        totalRounds,
        questionsPerRound: actualQPerRound,
        currentRound: 1,
        currentQuestionIndexInRound: 0,
        showAnswer: false,
        questionAnswered: false,
        questions: selected,
      }
    }

    case 'START_ROUND': {
      if (state.phase !== 'round-intro') return state
      return { ...state, phase: 'playing', showAnswer: false, questionAnswered: false }
    }

    case 'SHOW_ANSWER': {
      if (state.phase !== 'playing' || state.showAnswer) return state
      return { ...state, showAnswer: true }
    }

    case 'AWARD_POINT': {
      if (state.phase !== 'playing' || state.questionAnswered) return state
      const { teamId } = action.payload
      const newTeams: [TeamConfig, TeamConfig] = [
        {
          ...state.teams[0],
          score: state.teams[0].id === teamId ? state.teams[0].score + 1 : state.teams[0].score,
        },
        {
          ...state.teams[1],
          score: state.teams[1].id === teamId ? state.teams[1].score + 1 : state.teams[1].score,
        },
      ]
      return { ...state, teams: newTeams, questionAnswered: true, showAnswer: true }
    }

    case 'SKIP': {
      if (state.phase !== 'playing' || state.questionAnswered) return state
      return { ...state, questionAnswered: true, showAnswer: true }
    }

    case 'NEXT_QUESTION': {
      if (state.phase !== 'playing' || !state.questionAnswered) return state

      const nextIndexInRound = state.currentQuestionIndexInRound + 1
      const globalIndexAfter =
        (state.currentRound - 1) * state.questionsPerRound + nextIndexInRound

      const roundDone =
        nextIndexInRound >= state.questionsPerRound ||
        globalIndexAfter >= state.questions.length

      const allDone =
        globalIndexAfter >= state.questions.length ||
        (roundDone && state.currentRound >= state.totalRounds)

      if (allDone) {
        return { ...state, phase: 'match-end' }
      }

      if (roundDone) {
        return { ...state, phase: 'round-end' }
      }

      return {
        ...state,
        currentQuestionIndexInRound: nextIndexInRound,
        showAnswer: false,
        questionAnswered: false,
      }
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'round-end') return state
      return {
        ...state,
        phase: 'round-intro',
        currentRound: state.currentRound + 1,
        currentQuestionIndexInRound: 0,
        showAnswer: false,
        questionAnswered: false,
      }
    }

    case 'END_GAME': {
      return initialState
    }

    default:
      return state
  }
}

export function useFawazeeerGame() {
  const [gameState, dispatch] = useReducer(fawazeeerReducer, initialState)

  function initGame(settings: FawazeeerSettings): void {
    dispatch({ type: 'INIT_GAME', payload: settings })
  }

  function startRound(): void {
    dispatch({ type: 'START_ROUND' })
  }

  function showAnswer(): void {
    dispatch({ type: 'SHOW_ANSWER' })
  }

  function awardPoint(teamId: TeamId): void {
    dispatch({ type: 'AWARD_POINT', payload: { teamId } })
  }

  function skip(): void {
    dispatch({ type: 'SKIP' })
  }

  function nextQuestion(): void {
    dispatch({ type: 'NEXT_QUESTION' })
  }

  function nextRound(): void {
    dispatch({ type: 'NEXT_ROUND' })
  }

  function endGame(): void {
    dispatch({ type: 'END_GAME' })
  }

  return {
    gameState,
    initGame,
    startRound,
    showAnswer,
    awardPoint,
    skip,
    nextQuestion,
    nextRound,
    endGame,
  }
}
