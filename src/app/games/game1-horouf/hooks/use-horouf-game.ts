// Game state manager for حروف. useReducer drives all state transitions.
// checkWin runs inside the reducer so it always sees the freshly-updated grid.

'use client'

import { useReducer, useRef } from 'react'
import type {
  HoroufGameState,
  HoroufSettings,
  HexCell,
  TeamId,
  TeamConfig,
  RoundState,
  Question,
} from '../types'
import { generateGrid, checkWin } from '../utils/grid'
// checkWin is used inside horoufReducer (AWARD_POINT case), not in the hook body.
import { getRandomQuestion } from '../utils/questions'

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

type HoroufAction =
  | { type: 'INIT_GAME'; payload: HoroufSettings }
  | { type: 'START_ROUND' }
  | { type: 'SELECT_CELL'; payload: { cellId: string; question: Question | null } }
  | { type: 'NEW_QUESTION'; payload: { question: Question } }
  | { type: 'SHOW_ANSWER' }
  | { type: 'AWARD_POINT'; payload: { teamId: TeamId } }
  | { type: 'ADVANCE_FROM_WIN_REVEAL' }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' }

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialTeams: [TeamConfig, TeamConfig] = [
  { id: 'team1', name: 'الفريق الأول', color: '#34D399', score: 0 },
  { id: 'team2', name: 'الفريق الثاني', color: '#60A5FA', score: 0 },
]

const initialState: HoroufGameState = {
  phase: 'setup',
  gridSize: 5,
  roundsToWin: 2,
  teams: initialTeams,
  currentRound: null,
  hostName: '',
  isMatchWin: false,
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function horoufReducer(state: HoroufGameState, action: HoroufAction): HoroufGameState {
  switch (action.type) {
    case 'INIT_GAME': {
      const { gridSize, roundsToWin, hostName, team1Name, team2Name, team1Color, team2Color } = action.payload
      const teams: [TeamConfig, TeamConfig] = [
        { id: 'team1', name: team1Name.trim() || 'الفريق الأول', color: team1Color, score: 0 },
        { id: 'team2', name: team2Name.trim() || 'الفريق الثاني', color: team2Color, score: 0 },
      ]
      return {
        phase: 'round-intro',
        gridSize,
        roundsToWin,
        hostName,
        teams,
        currentRound: null,
        isMatchWin: false,
      }
    }

    case 'START_ROUND': {
      const prevRoundNumber = state.currentRound?.roundNumber ?? 0
      const newRound: RoundState = {
        roundNumber: prevRoundNumber + 1,
        grid: generateGrid(state.gridSize),
        currentCell: null,
        currentQuestion: null,
        showAnswer: false,
        winner: null,
        winningPath: [],
      }
      return { ...state, phase: 'playing', currentRound: newRound }
    }

    case 'SELECT_CELL': {
      const { cellId, question } = action.payload
      const round = state.currentRound
      if (!round || state.phase !== 'playing') return state

      // If the already-selected cell is clicked again, deselect it.
      if (round.currentCell?.id === cellId) {
        const newGrid = round.grid.map((gridRow) =>
          gridRow.map((cell) =>
            cell.id === cellId ? { ...cell, isSelected: false } : cell
          )
        )
        return {
          ...state,
          currentRound: {
            ...round,
            grid: newGrid,
            currentCell: null,
            currentQuestion: null,
            showAnswer: false,
          },
        }
      }

      // Locate the target cell and confirm it is unclaimed.
      let targetCell: HexCell | null = null
      for (const gridRow of round.grid) {
        for (const cell of gridRow) {
          if (cell.id === cellId && cell.owner === null) {
            targetCell = cell
            break
          }
        }
        if (targetCell !== null) break
      }
      if (!targetCell) return state

      const selectedCell: HexCell = { ...targetCell, isSelected: true }

      const newGrid = round.grid.map((gridRow) =>
        gridRow.map((cell) => {
          if (cell.id === cellId) return selectedCell
          // Clear selection on any previously selected cell.
          return cell.isSelected ? { ...cell, isSelected: false } : cell
        })
      )

      return {
        ...state,
        currentRound: {
          ...round,
          grid: newGrid,
          currentCell: selectedCell,
          currentQuestion: question,
          showAnswer: false,
        },
      }
    }

    case 'NEW_QUESTION': {
      const round = state.currentRound
      if (!round) return state
      return {
        ...state,
        currentRound: {
          ...round,
          currentQuestion: action.payload.question,
          showAnswer: false,
        },
      }
    }

    case 'SHOW_ANSWER': {
      const round = state.currentRound
      if (!round) return state
      return { ...state, currentRound: { ...round, showAnswer: true } }
    }

    case 'AWARD_POINT': {
      const round = state.currentRound
      if (!round || !round.currentCell) return state

      const { teamId } = action.payload
      const { row, col } = round.currentCell

      // Immutably mark the cell as owned and deselect it.
      const newGrid = round.grid.map((gridRow, r) =>
        r === row
          ? gridRow.map((cell, c) =>
              c === col ? { ...cell, owner: teamId, isSelected: false } : cell
            )
          : gridRow
      )

      // Run win check on the freshly updated grid — teamId is from the action, not a closure.
      const winResult = checkWin(newGrid, teamId, state.gridSize)

      const clearedRoundBase: RoundState = {
        ...round,
        grid: newGrid,
        currentCell: null,
        currentQuestion: null,
        showAnswer: false,
      }

      if (!winResult.won) {
        return { ...state, currentRound: clearedRoundBase }
      }

      // Team won this round — update score and determine if match is over.
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

      const winningTeam = newTeams.find((t) => t.id === teamId)!
      const matchOver = winningTeam.score >= state.roundsToWin

      return {
        ...state,
        phase: 'win-reveal',
        isMatchWin: matchOver,
        teams: newTeams,
        currentRound: {
          ...clearedRoundBase,
          winner: teamId,
          winningPath: winResult.path,
        },
      }
    }

    case 'ADVANCE_FROM_WIN_REVEAL': {
      if (state.phase !== 'win-reveal') return state
      return { ...state, phase: state.isMatchWin ? 'match-end' : 'round-end' }
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'round-end') return state
      return { ...state, phase: 'round-intro' }
    }

    case 'END_GAME': {
      return initialState
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHoroufGame() {
  const [gameState, dispatch] = useReducer(horoufReducer, initialState)

  // Tracks question IDs used across the entire match to avoid repetition.
  const usedQuestionIds = useRef<string[]>([])

  function initGame(settings: HoroufSettings): void {
    usedQuestionIds.current = []
    dispatch({ type: 'INIT_GAME', payload: settings })
  }

  function startRound(): void {
    dispatch({ type: 'START_ROUND' })
  }

  function selectCell(cellId: string): void {
    const round = gameState.currentRound
    if (!round || gameState.phase !== 'playing') return

    // Find the cell's letter so we can look up a question.
    let targetLetter = ''
    for (const gridRow of round.grid) {
      for (const cell of gridRow) {
        if (cell.id === cellId && cell.owner === null) {
          targetLetter = cell.letter
          break
        }
      }
      if (targetLetter) break
    }
    if (!targetLetter) return

    const question = getRandomQuestion(targetLetter, usedQuestionIds.current)
    if (question) {
      usedQuestionIds.current = [...usedQuestionIds.current, question.id]
    }

    dispatch({ type: 'SELECT_CELL', payload: { cellId, question } })
  }

  function newQuestion(): void {
    const round = gameState.currentRound
    if (!round || !round.currentCell) return

    const letter = round.currentCell.letter
    const question = getRandomQuestion(letter, usedQuestionIds.current)

    // No more questions for this letter — keep the current one rather than crashing.
    if (!question) return

    usedQuestionIds.current = [...usedQuestionIds.current, question.id]
    dispatch({ type: 'NEW_QUESTION', payload: { question } })
  }

  function showAnswer(): void {
    dispatch({ type: 'SHOW_ANSWER' })
  }

  function awardPoint(teamId: TeamId): void {
    if (!gameState.currentRound?.currentCell) return
    dispatch({ type: 'AWARD_POINT', payload: { teamId } })
  }

  function advanceFromWinReveal(): void {
    dispatch({ type: 'ADVANCE_FROM_WIN_REVEAL' })
  }

  function nextRound(): void {
    dispatch({ type: 'NEXT_ROUND' })
  }

  function endGame(): void {
    usedQuestionIds.current = []
    dispatch({ type: 'END_GAME' })
  }

  return {
    gameState,
    initGame,
    startRound,
    selectCell,
    newQuestion,
    showAnswer,
    awardPoint,
    advanceFromWinReveal,
    nextRound,
    endGame,
  }
}
