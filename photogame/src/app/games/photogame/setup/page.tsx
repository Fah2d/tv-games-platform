'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_PHOTO_SETTINGS } from '../types'
import { PHOTO_CATEGORIES } from '../categories'

export default function PhotoGameSetupPage() {
  const router = useRouter()

  const [totalRounds, setTotalRounds] = useState(DEFAULT_PHOTO_SETTINGS.totalRounds)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    DEFAULT_PHOTO_SETTINGS.selectedCategories
  )
  const [error, setError] = useState('')

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    if (selectedCategories.length === 0) { setError('اختر فئة واحدة على الأقل'); return }
    const params = new URLSearchParams({
      rounds: String(totalRounds),
      cats: selectedCategories.join(','),
    })
    router.push(`/games/photogame/game-board?${params}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6" dir="rtl">
      <div className="max-w-sm mx-auto">

        <div className="text-center mb-8">
          <p className="text-5xl mb-2">📸</p>
          <h1 className="text-3xl font-black">إعداد اللعبة</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-5">
          <label className="block text-zinc-400 text-sm mb-3">عدد الجولات</label>
          <div className="flex gap-2">
            {[3, 5, 8, 10].map((n) => (
              <button
                key={n}
                onClick={() => setTotalRounds(n)}
                className={`flex-1 py-2 rounded-xl font-bold text-lg transition-colors ${
                  totalRounds === n ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-6">
          <label className="block text-zinc-400 text-sm mb-3">الفئات</label>
          <div className="space-y-2">
            {PHOTO_CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    active ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.nameAr}</span>
                  {active && <span className="mr-auto text-sm">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-xl transition-colors"
        >
          إنشاء الغرفة
        </button>

        <a href="/games/photogame" className="block text-center text-zinc-500 hover:text-zinc-300 text-sm mt-4 transition-colors">
          رجوع
        </a>
      </div>
    </div>
  )
}
