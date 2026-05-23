'use client'

import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { FASTEST_RECONNECT, FASTEST_STATE, FASTEST_ERROR, FASTEST_BUZZ } from '@/shared/socket/events'
import type { FastestStatePayload } from '../types'
import { PLAYER_COLOR_CLASSES } from '../types'
import BuzzerButton from '../components/BuzzerButton'

function PlayerViewContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') ?? ''
  const name = searchParams.get('name') ?? ''

  const [state, setState] = useState<FastestStatePayload | null>(null)
  const [error, setError] = useState('')
  const [isReconnecting, setIsReconnecting] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!code || !name) return
    const socket = io({ reconnection: true, reconnectionDelay: 1000, reconnectionAttempts: 10 })
    socketRef.current = socket

    socket.on('connect', () => {
      setIsReconnecting(false)
      socket.emit(FASTEST_RECONNECT, { roomCode: code, playerName: name })
    })
    socket.on('disconnect', () => setIsReconnecting(true))
    socket.on(FASTEST_STATE, (s: FastestStatePayload) => setState(s))
    socket.on(FASTEST_ERROR, ({ message }: { message: string }) => setError(message))

    return () => { socket.disconnect() }
  }, [code, name])

  const handleBuzz = useCallback(() => {
    socketRef.current?.emit(FASTEST_BUZZ, { roomCode: code, playerName: name })
  }, [code, name])

  if (isReconnecting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">جاري إعادة الاتصال...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <a href="/games/fastest" className="text-yellow-400 hover:text-yellow-300">عودة</a>
        </div>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { phase, players, settings, currentQuestion, buzzedPlayerName } = state
  const me = players.find((p) => p.name === name)
  const myColorIndex = me?.colorIndex ?? 0

  // ── Lobby ─────────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
        <p className="text-5xl mb-4">⚡</p>
        <p className="text-2xl font-bold mb-1">{name}</p>
        <p className="text-zinc-400 mb-8">في انتظار بدء اللعبة...</p>
        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Finished ──────────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const myRank = sorted.findIndex((p) => p.name === name) + 1
    const isWinner = sorted[0]?.name === name
    const myScore = me?.score ?? 0
    const colors = PLAYER_COLOR_CLASSES[myColorIndex % PLAYER_COLOR_CLASSES.length]

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
        <p className="text-6xl mb-3">{isWinner ? '🏆' : '🎮'}</p>
        <p className="text-3xl font-black text-yellow-400 mb-1">
          {isWinner ? 'أنت الفائز!' : 'انتهت اللعبة'}
        </p>
        <p className="text-zinc-400 text-lg mb-6">
          المركز {myRank} من {players.length}
        </p>
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-8 py-5 mb-6 text-center">
          <p className="text-zinc-400 text-sm mb-1">نقاطك</p>
          <p className={`font-black text-5xl ${colors.text}`}>{myScore}</p>
        </div>
        <a
          href="/"
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          🏠 الرئيسية
        </a>
      </div>
    )
  }

  // ── Ready / Buzzed ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
      <div className="text-center mb-8">
        <p className="text-zinc-400 text-sm">
          السؤال {currentQuestion} / {settings.totalQuestions}
        </p>
        <p className="text-xl font-bold mt-1">{name}</p>
        {me && (
          <p className="text-zinc-500 text-sm mt-1">
            نقاطي: <span className="text-white font-bold">{me.score}</span>
          </p>
        )}
      </div>

      <BuzzerButton
        myName={name}
        buzzedPlayerName={buzzedPlayerName}
        phase={phase}
        colorIndex={myColorIndex}
        onBuzz={handleBuzz}
      />
    </div>
  )
}

export default function PlayerViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlayerViewContent />
    </Suspense>
  )
}
