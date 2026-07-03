import Link from 'next/link'

const GAMES = [
  {
    id: 'impostor',
    name: 'من الإمبوستر؟',
    description: 'لعبة الاكتشاف الاجتماعي',
    players: '٣-١٠',
    emoji: '🎭',
    available: true,
  },
  {
    id: 'game1-horouf',
    name: 'حروف',
    description: 'لعبة الحروف والكلمات',
    players: '٢-١٠',
    emoji: '🔤',
    available: true,
  },
]

export default function HubPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10" dir="rtl">
      <header className="mb-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white">منصة الألعاب</h1>
        <p className="text-zinc-500 text-sm mt-1">اختر لعبة وابدأ</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                <span className="text-6xl">{game.emoji}</span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white mb-1">{game.name}</h2>
                <p className="text-zinc-400 text-sm mb-1">{game.description}</p>
                <p className="text-zinc-600 text-xs mb-5">اللاعبون: {game.players}</p>
                <Link
                  href={`/games/${game.id}`}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  العب الآن
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
