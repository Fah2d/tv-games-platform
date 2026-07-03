import Link from 'next/link'

export default function HoroufPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-5xl font-bold mb-4">حروف</h1>
      <p className="text-zinc-400 mb-10 text-lg">لعبة الحروف والكلمات</p>
      <Link
        href="/lobby?game=game1-horouf"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl text-xl transition-colors"
      >
        إنشاء غرفة
      </Link>
      <Link href="/" className="mt-6 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  )
}
