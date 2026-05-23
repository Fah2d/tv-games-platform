import Link from 'next/link'

export default function SpeedChallengeWinnerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
      <p className="text-7xl mb-4">🏆</p>
      <h1 className="text-4xl font-black text-yellow-400 mb-4">مبروك!</h1>
      <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  )
}
