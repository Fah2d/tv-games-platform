'use client'

import { useRouter } from 'next/navigation'
import { useHoroufGame } from './hooks/use-horouf-game'
import SetupScreen from './components/setup-screen'
import RoundIntroScreen from './components/round-intro-screen'
import GameBoard from './components/game-board'
import RoundEndScreen from './components/round-end-screen'
import MatchEndScreen from './components/match-end-screen'

export default function HoroufPage() {
  const router = useRouter()
  const {
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
  } = useHoroufGame()

  const { phase } = gameState

  if (phase === 'setup') {
    return <SetupScreen onStart={initGame} />
  }

  if (phase === 'round-intro') {
    return <RoundIntroScreen gameState={gameState} onStart={startRound} />
  }

  if (phase === 'playing' || phase === 'win-reveal') {
    return (
      <GameBoard
        gameState={gameState}
        onSelectCell={selectCell}
        onShowAnswer={showAnswer}
        onNewQuestion={newQuestion}
        onAwardPoint={awardPoint}
        onAdvanceFromWinReveal={advanceFromWinReveal}
      />
    )
  }

  if (phase === 'round-end') {
    return <RoundEndScreen gameState={gameState} onNextRound={nextRound} />
  }

  if (phase === 'match-end') {
    return (
      <MatchEndScreen
        gameState={gameState}
        onPlayAgain={endGame}
        onGoHome={() => router.push('/')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <p className="text-text-secondary">جاري التحميل...</p>
    </div>
  )
}
