import Link from 'next/link'

export default function SpeedChallengePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6" dir="rtl">
      <p className="text-7xl mb-4">⚡</p>
      <h1 className="text-4xl font-black text-white mb-2">لعبة التحدي السريع</h1>
      <p className="text-zinc-400 text-lg mb-10 text-center max-w-xs">
        تحديات سريعة — أول واحد يكملها يكسب النقطة!
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/games/speed-challenge/setup"
          className="block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl text-xl transition-colors"
        >
          🎮 العب على التلفزيون
        </Link>

        <Link
          href="/"
          className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-2xl transition-colors"
        >
          🏠 الرئيسية
        </Link>
      </div>
    </div>
  )
}
