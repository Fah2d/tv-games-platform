export default function WinnerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
      <p className="text-6xl mb-4">🏆</p>
      <h1 className="text-4xl font-black text-yellow-400 mb-2">انتهت اللعبة!</h1>
      <p className="text-zinc-400 mb-8">تحقق من الشاشة الرئيسية لمعرفة الفائز</p>
      <a
        href="/"
        className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        🏠 الرئيسية
      </a>
    </div>
  )
}
