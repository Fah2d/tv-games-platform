'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TabooGamePage() {
  const router = useRouter()
  const [view, setView] = useState<'menu' | 'join' | 'howto'>('menu')
  const [joinCode, setJoinCode] = useState('')
  const [joinName, setJoinName] = useState('')
  const [error, setError] = useState('')

  function handleJoin() {
    const code = joinCode.trim().toUpperCase()
    const name = joinName.trim()
    if (!code || code.length !== 4) { setError('أدخل رمز غرفة صحيح'); return }
    if (!name) { setError('أدخل اسمك'); return }
    router.push(`/games/taboo/player-view?code=${code}&name=${encodeURIComponent(name)}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white" dir="rtl">
      <div className="max-w-sm w-full">

        <div className="text-center mb-8">
          <p className="text-6xl mb-3">🚫</p>
          <h1 className="text-4xl font-black text-white mb-1">ولا كلمة</h1>
          <p className="text-zinc-400 text-sm">وصّف الكلمة بدون ما تقول الكلمات المحرّمة</p>
        </div>

        {view === 'menu' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/games/taboo/setup')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-xl transition-colors"
            >
              إنشاء غرفة
            </button>
            <button
              onClick={() => setView('join')}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-4 rounded-2xl text-xl transition-colors"
            >
              انضمام للعبة
            </button>
            <button
              onClick={() => setView('howto')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-2xl text-lg transition-colors"
            >
              كيف تلعب؟
            </button>
            <a href="/" className="text-center text-zinc-500 hover:text-zinc-300 text-sm transition-colors mt-1">
              العودة للرئيسية
            </a>
          </div>
        )}

        {view === 'howto' && (
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 space-y-4">
              <h2 className="text-xl font-black text-center text-indigo-400">طريقة اللعب</h2>

              <div className="flex gap-3">
                <span className="text-2xl shrink-0">👥</span>
                <div>
                  <p className="font-bold text-white">الفرق</p>
                  <p className="text-zinc-400 text-sm">قسّم اللاعبين إلى فريقَين أو أكثر (٢ إلى ٨ لاعبين)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl shrink-0">🎤</span>
                <div>
                  <p className="font-bold text-white">المُلمِّح</p>
                  <p className="text-zinc-400 text-sm">كل دور، لاعب واحد يشوف الكلمة السرية + الكلمات المحرّمة على جواله</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl shrink-0">🚫</span>
                <div>
                  <p className="font-bold text-white">القاعدة الذهبية</p>
                  <p className="text-zinc-400 text-sm">ممنوع تقول الكلمة المستهدفة أو أي كلمة من الكلمات الحمراء — لو قلتها ينفجر البزرور!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl shrink-0">✅</span>
                <div>
                  <p className="font-bold text-white">التخمين</p>
                  <p className="text-zinc-400 text-sm">باقي اللاعبين يخمنون الكلمة من الإشارات — كل كلمة صحيحة = نقطة للمُلمِّح</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl shrink-0">🏆</span>
                <div>
                  <p className="font-bold text-white">الفوز</p>
                  <p className="text-zinc-400 text-sm">اللاعب اللي يجمع أكثر نقاط في نهاية الجولات يفوز</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('menu')}
              className="text-center text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              رجوع
            </button>
          </div>
        )}

        {view === 'join' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="رمز الغرفة (4 أحرف)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-indigo-500 uppercase"
            />
            <input
              type="text"
              placeholder="اسمك"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              maxLength={20}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-indigo-500"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleJoin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-xl transition-colors"
            >
              انضمام
            </button>
            <button
              onClick={() => { setView('menu'); setError('') }}
              className="text-center text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              رجوع
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
