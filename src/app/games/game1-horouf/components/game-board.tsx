'use client'

import { useEffect } from 'react'
import type { HoroufGameState, TeamId } from '../types'
import HexGrid from './hex-grid'
import ControlPanel from './control-panel'

interface GameBoardProps {
  gameState: HoroufGameState
  onSelectCell: (cellId: string) => void
  onShowAnswer: () => void
  onNewQuestion: () => void
  onAwardPoint: (teamId: TeamId) => void
  onAdvanceFromWinReveal: () => void
}

export default function GameBoard({
  gameState,
  onSelectCell,
  onShowAnswer,
  onNewQuestion,
  onAwardPoint,
  onAdvanceFromWinReveal,
}: GameBoardProps) {
  const { teams, gridSize, currentRound, phase } = gameState
  const round = currentRound!
  const isWinReveal = phase === 'win-reveal'

  useEffect(() => {
    if (!isWinReveal) return
    const timer = setTimeout(onAdvanceFromWinReveal, 3000)
    return () => clearTimeout(timer)
  }, [isWinReveal, onAdvanceFromWinReveal])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* First child renders on RIGHT in RTL flex-row */}
      <div className="w-[360px] shrink-0 h-full">
        <ControlPanel
          roundNumber={round.roundNumber}
          currentCell={round.currentCell}
          currentQuestion={round.currentQuestion}
          showAnswer={round.showAnswer}
          teams={teams}
          onShowAnswer={onShowAnswer}
          onNewQuestion={onNewQuestion}
          onAwardPoint={onAwardPoint}
        />
      </div>

      {/* Second child renders on LEFT in RTL */}
      <div className="flex-1 flex items-center justify-center">
        <HexGrid
          grid={round.grid}
          gridSize={gridSize}
          teams={teams}
          onCellClick={onSelectCell}
          isWinReveal={isWinReveal}
          winningPath={round.winningPath}
        />
      </div>
    </div>
  )
}
