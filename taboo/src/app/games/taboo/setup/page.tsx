'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_TABOO_SETTINGS } from '../types'
import type { TabooDifficulty } from '../types'

const DIFFICULTY_LABELS: Record<TabooDifficulty, { ar: string; desc: string }> = {
  Easy:   { ar: 'سهل',   desc: 'كلمات يومية ومألوفة' },
  Medium: { ar: 'متوسط', desc: 'كلمات تحتاج تفكير' },
  Hard:   { ar: 'صعب',   desc: 'كلمات معقدة وتخصصية' },
}

export default function TabooSetupPage() {
  const router = useRouter()
  const [totalRounds, setTotalRounds] = useState(DEFAULT_TABOO_SETTINGS.totalRounds)
  const [difficulty, setDifficulty] = useState<TabooDifficulty>(DEFAULT_TABOO_SETTINGS.difficulty)

  function handleCreate() {
    const params = new URLSearchParams({
      rounds: String(totalRounds),
      diff: difficulty,
    })
    router.push(`/games/taboo/game-board?${params}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
      <div className="max-w-sm mx-auto">

        <div className="text-center mb-8">
          <p className="text-5xl mb-2">🚫</p>
          <h1 className="text-3xl font-black">ولا كلمة</h1>
          <p className="text-zinc-500 text-sm mt-1">إعداد اللعبة</p>
        </div>

        {/* Rounds */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-5">
          <label className="block text-zinc-400 text-sm mb-4">جولات لكل فريق</label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setTotalRounds((r) => Math.max(1, r - 1))}
              className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 text-white text-2xl font-black rounded-xl transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span className="text-5xl font-black text-white w-16 text-center tabular-nums">{totalRounds}</span>
            <button
              onClick={() => setTotalRounds((r) => Math.min(20, r + 1))}
              className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 text-white text-2xl font-black rounded-xl transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
          <p className="text-zinc-600 text-xs text-center mt-3">من ١ إلى ٢٠ جولة</p>
        </div>

        {/* Difficulty */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-6">
          <label className="block text-zinc-400 text-sm mb-3">مستوى الصعوبة</label>
          <div className="space-y-2">
            {(Object.keys(DIFFICULTY_LABELS) as TabooDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-right ${
                  difficulty === d ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <div className="flex-1">
                  <p className="font-bold">{DIFFICULTY_LABELS[d].ar}</p>
                  <p className={`text-xs ${difficulty === d ? 'text-indigo-200' : 'text-zinc-500'}`}>
                    {DIFFICULTY_LABELS[d].desc}
                  </p>
                </div>
                {difficulty === d && <span className="text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-xl transition-colors"
        >
          إنشاء الغرفة
        </button>

        <a href="/games/taboo" className="block text-center text-zinc-500 hover:text-zinc-300 text-sm mt-4 transition-colors">
          رجوع
        </a>
      </div>
    </div>
  )
}
