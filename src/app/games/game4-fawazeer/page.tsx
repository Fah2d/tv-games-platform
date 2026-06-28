'use client'

import { useRouter } from 'next/navigation'
import { useFawazeeerGame } from './hooks/use-fawazeer-game'
import type { TeamId } from './types'
import SetupScreen from './components/setup-screen'
import RoundIntroScreen from './components/round-intro-screen'
import QuestionScreen from './components/question-screen'
import RoundEndScreen from './components/round-end-screen'
import MatchEndScreen from './components/match-end-screen'
import { playAwardSound, playShowAnswerSound, playNewQuestionSound } from './utils/sounds'

export default function FawazeeerPage() {
  const router = useRouter()
  const {
    gameState,
    initGame,
    startRound,
    showAnswer,
    awardPoint,
    skip,
    nextQuestion,
    nextRound,
    endGame,
  } = useFawazeeerGame()

  const { phase } = gameState

  function handleShowAnswer(): void {
    playShowAnswerSound()
    showAnswer()
  }

  function handleAwardPoint(teamId: TeamId): void {
    playAwardSound()
    awardPoint(teamId)
  }

  function handleNextQuestion(): void {
    playNewQuestionSound()
    nextQuestion()
  }

  if (phase === 'setup') {
    return <SetupScreen onStart={initGame} />
  }

  if (phase === 'round-intro') {
    return <RoundIntroScreen gameState={gameState} onStart={startRound} />
  }

  if (phase === 'playing') {
    return (
      <QuestionScreen
        gameState={gameState}
        onShowAnswer={handleShowAnswer}
        onAwardPoint={handleAwardPoint}
        onSkip={skip}
        onNextQuestion={handleNextQuestion}
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
