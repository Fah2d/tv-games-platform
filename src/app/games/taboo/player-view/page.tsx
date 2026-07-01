'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import {
  TABOO_JOIN, TABOO_STATE, TABOO_ERROR,
  TABOO_CARD, TABOO_GUESS_RESULT,
  TABOO_SUBMIT_CLUE, TABOO_SUBMIT_GUESS, TABOO_SKIP,
} from '@/shared/socket/events'
import type { TabooStatePayload } from '../types'
import { PLAYER_COLOR_CLASSES } from '../types'

interface CardPayload { targetWord: string; tabooWords: string[] }

function PlayerViewContent() {
  const searchParams = useSearchParams()
  const code = (searchParams.get('code') ?? '').toUpperCase()

  const [state, setState] = useState<TabooStatePayload | null>(null)
  const [error, setError] = useState('')
  const [teamInput, setTeamInput] = useState('')
  const [joined, setJoined] = useState(false)
  const [myTeam, setMyTeam] = useState('')

  const [card, setCard] = useState<CardPayload | null>(null)
  const [clueInput, setClueInput] = useState('')
  const [guessInput, setGuessInput] = useState('')
  const [guessResult, setGuessResult] = useState<boolean | null>(null)
  const guessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refs hold the latest values without re-triggering useEffect
  const socketRef = useRef<Socket | null>(null)
  const joinedRef = useRef(false)
  const myTeamRef = useRef('')

  // Single socket lifecycle — only recreated if code changes
  useEffect(() => {
    if (!code) return
    const socket = io()
    socketRef.current = socket

    socket.on('connect', () => {
      // Re-join automatically on reconnect (e.g. page refresh, network drop)
      if (joinedRef.current && myTeamRef.current) {
        socket.emit(TABOO_JOIN, { roomCode: code, playerName: myTeamRef.current })
      }
    })

    socket.on(TABOO_STATE, (s: TabooStatePayload) => {
      setState(s)
      if (s.phase !== 'playing') {
        setCard(null)
        setClueInput('')
        setGuessInput('')
      }
    })

    socket.on(TABOO_CARD, (payload: CardPayload) => {
      setCard(payload)
      setClueInput('')
    })

    socket.on(TABOO_GUESS_RESULT, ({ correct }: { correct: boolean }) => {
      setGuessResult(correct)
      if (correct) setGuessInput('')
      if (guessTimerRef.current) clearTimeout(guessTimerRef.current)
      guessTimerRef.current = setTimeout(() => setGuessResult(null), 1500)
    })

    socket.on(TABOO_ERROR, ({ message }: { message: string }) => setError(message))

    return () => { socket.disconnect() }
  }, [code])

  function handleJoin() {
    const team = teamInput.trim()
    if (!team) return
    joinedRef.current = true
    myTeamRef.current = team
    setMyTeam(team)
    setJoined(true)
    socketRef.current?.emit(TABOO_JOIN, { roomCode: code, playerName: team })
  }

  function emit(event: string, data: object = {}) {
    socketRef.current?.emit(event, { roomCode: code, ...data })
  }

  function submitClue() {
    const text = clueInput.trim()
    if (!text) return
    emit(TABOO_SUBMIT_CLUE, { clue: text })
    setClueInput('')
  }

  function submitGuess() {
    const text = guessInput.trim()
    if (!text) return
    emit(TABOO_SUBMIT_GUESS, { guess: text })
    setGuessInput('')
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center" dir="rtl">
      <div className="text-center px-6">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button onClick={() => setError('')} className="text-indigo-400 hover:text-indigo-300">حاول مرة أخرى</button>
      </div>
    </div>
  )

  // ── Join screen ────────────────────────────────────────────────────────────
  if (!joined) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6" dir="rtl">
      <p className="text-5xl mb-3">🚫</p>
      <h1 className="text-3xl font-black text-white mb-1">ولا كلمة</h1>
      <p className="text-indigo-400 text-4xl font-black tracking-widest mb-10">{code}</p>
      <div className="w-full max-w-xs">
        <label className="block text-zinc-400 text-sm mb-2 text-right">اسم فريقك</label>
        <input
          type="text"
          value={teamInput}
          onChange={(e) => setTeamInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          placeholder="مثال: الأبطال"
          maxLength={20}
          className="w-full bg-zinc-800 border border-zinc-600 rounded-2xl px-4 py-4 text-white text-center text-xl focus:outline-none focus:border-indigo-500 mb-4"
        />
        <button
          onClick={handleJoin}
          disabled={!teamInput.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-xl transition-colors"
        >
          انضم للعبة
        </button>
      </div>
    </div>
  )

  // ── Loading (waiting for first state) ─────────────────────────────────────
  if (!state) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const myPlayer = state.players.find((p) => p.name === myTeam)
  const myColors = myPlayer ? PLAYER_COLOR_CLASSES[myPlayer.colorIndex % PLAYER_COLOR_CLASSES.length] : null
  const clueGiver = state.players[state.currentTurnIndex % state.players.length]
  const isClueGiver = clueGiver?.name === myTeam
  const currentRound = Math.floor(state.currentTurnIndex / state.players.length) + 1

  // ── Lobby ──────────────────────────────────────────────────────────────────
  if (state.phase === 'lobby') return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${myColors?.phoneBg ?? 'bg-zinc-900'}`} dir="rtl">
      <p className="text-white text-3xl font-black mb-2">{myTeam}</p>
      <p className="text-white/60 text-lg">في انتظار بدء اللعبة...</p>
      <p className="text-white/30 text-sm mt-6">رمز الغرفة: {code}</p>
    </div>
  )

  // ── Finished ───────────────────────────────────────────────────────────────
  if (state.phase === 'finished') {
    const sorted = [...state.players].sort((a, b) => b.score - a.score)
    const rank = sorted.findIndex((p) => p.name === myTeam) + 1
    const medals = ['🥇', '🥈', '🥉']
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white" dir="rtl">
        <p className="text-6xl mb-3">{medals[rank - 1] ?? '🏁'}</p>
        <h1 className="text-3xl font-black text-indigo-400 mb-2">انتهت اللعبة!</h1>
        <p className={`text-2xl font-bold mb-1 ${myColors?.text ?? 'text-white'}`}>{myTeam}</p>
        <p className="text-white/70 mb-1">النقاط: <span className="font-black text-white">{myPlayer?.score ?? 0}</span></p>
        <p className="text-zinc-400">المركز {rank} من {sorted.length}</p>
      </div>
    )
  }

  // ── Turn End ───────────────────────────────────────────────────────────────
  if (state.phase === 'turn_end') return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${myColors?.phoneBg ?? 'bg-zinc-800'}`} dir="rtl">
      <p className="text-white text-3xl font-black mb-2">{myTeam}</p>
      <p className="text-white/70 text-lg mb-4">
        {isClueGiver ? `سجّلت ${state.turnScore} نقطة هذا الدور 🎉` : `انتهى دور ${clueGiver?.name ?? ''}`}
      </p>
      <p className="text-white/40 text-sm">في انتظار الدور التالي...</p>
      <p className={`mt-6 text-xl font-black ${myColors?.text ?? 'text-white'}`}>
        نقاطك: {myPlayer?.score ?? 0}
      </p>
    </div>
  )

  // ── Playing — Clue-giver ───────────────────────────────────────────────────
  if (isClueGiver) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" dir="rtl">
      <div className={`px-5 pt-5 pb-3 ${myColors?.phoneBg ?? 'bg-zinc-800'}`}>
        <div className="flex items-center justify-between">
          <p className="text-white font-black text-xl">{myTeam} 🎤</p>
          <p className="text-white/60 text-sm">جولة {currentRound}/{state.settings.totalRounds}</p>
          <p className="text-white font-bold">{myPlayer?.score ?? 0} نقطة</p>
        </div>
        <p className="text-white/50 text-center text-xs mt-2">وصّف الكلمة بدون ما تقول الكلمات الحمراء</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-36">
        {card ? (
          <>
            <div className="bg-zinc-900 border-2 border-indigo-500 rounded-2xl p-5 mb-4 text-center">
              <p className="text-zinc-400 text-xs mb-2">الكلمة المستهدفة</p>
              <p className="text-4xl font-black text-white">{card.targetWord}</p>
            </div>

            <div className="bg-zinc-900 border-2 border-red-700 rounded-2xl p-4 mb-4">
              <p className="text-red-400 text-xs font-bold mb-3 text-center">🚫 ممنوع تقولها</p>
              <div className="grid grid-cols-2 gap-2">
                {card.tabooWords.map((w) => (
                  <div key={w} className="bg-red-900/30 border border-red-800 rounded-xl px-3 py-2 text-red-300 font-bold text-center text-sm">
                    {w}
                  </div>
                ))}
              </div>
            </div>

            {state.clues.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3">
                <p className="text-zinc-500 text-xs mb-2">إشاراتك</p>
                {state.clues.map((c, i) => (
                  <div key={i} className={`text-sm px-3 py-1 flex gap-2 ${c.valid ? 'text-zinc-300' : 'text-red-400 line-through'}`}>
                    <span>{c.valid ? '💬' : '🚫'}</span>
                    <span>{c.text}</span>
                    {!c.valid && c.violatedWord && <span className="text-red-500 text-xs mr-auto">‹{c.violatedWord}›</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={clueInput}
            onChange={(e) => setClueInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitClue()}
            placeholder="اكتب إشارة..."
            className="flex-1 bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 text-white text-right focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={submitClue}
            disabled={!clueInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl transition-colors"
          >
            إرسال
          </button>
        </div>
        <button
          onClick={() => emit(TABOO_SKIP)}
          className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-bold py-2 rounded-xl transition-colors text-sm"
        >
          تخطّ الكلمة ↩
        </button>
      </div>
    </div>
  )

  // ── Playing — Guesser ──────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col ${myColors?.phoneBg ?? 'bg-zinc-800'}`} dir="rtl">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <p className="text-white font-black text-xl">{myTeam}</p>
        <p className="text-white/60 text-sm">جولة {currentRound}/{state.settings.totalRounds}</p>
        <p className="text-white font-bold">{myPlayer?.score ?? 0} نقطة</p>
      </div>
      <p className="text-white/70 text-center text-sm mb-1">المُلمِّح: <span className="font-black">{clueGiver?.name ?? '—'}</span></p>
      <p className="text-white/40 text-center text-xs mb-4">خمّن الكلمة من الإشارات</p>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {state.clues.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-white/30 text-sm">في انتظار الإشارات...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...state.clues].reverse().map((c, i) => (
              <div key={i} className={`px-4 py-3 rounded-xl font-medium ${c.valid ? 'bg-white/10 text-white' : 'bg-red-900/30 text-red-400 line-through'}`}>
                {c.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {guessResult !== null && (
        <div className={`fixed top-4 left-4 right-4 z-50 py-3 rounded-2xl text-center font-black text-lg ${guessResult ? 'bg-green-600' : 'bg-red-700'} text-white`}>
          {guessResult ? '✅ صح! نقطة لك' : '❌ خطأ — حاول مرة أخرى'}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-700 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
            placeholder="ما هي الكلمة؟"
            className="flex-1 bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 text-white text-right focus:outline-none focus:border-green-500"
          />
          <button
            onClick={submitGuess}
            disabled={!guessInput.trim()}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl transition-colors"
          >
            تخمين
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TabooPlayerViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlayerViewContent />
    </Suspense>
  )
}
