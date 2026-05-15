'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/shared/hooks/use-auth'

const GAMES = [
  {
    id: 'game1-horouf',
    name: 'حروف',
    description: 'لعبة حروف التريفيا',
    players: '٢ فريق',
    available: true,
  },
  {
    id: 'game2-tbd',
    name: 'قريباً',
    description: 'لعبة جديدة قادمة',
    players: '٢-١٠',
    available: false,
  },
]

function HoroufThumbnail() {
  return (
    <svg width="72" height="82" viewBox="0 0 72 82" fill="none" aria-hidden="true">
      <path
        d="M36 4L68 22V58L36 76L4 58V22L36 4Z"
        fill="#E8A838"
        fillOpacity="0.12"
        stroke="#E8A838"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#E8A838"
        fontSize="28"
        fontWeight="700"
        fontFamily="IBM Plex Sans Arabic, sans-serif"
      >
        ح
      </text>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="18" width="20" height="16" rx="3" stroke="#606070" strokeWidth="1.5" />
      <path d="M14 18v-4a6 6 0 0112 0v4" stroke="#606070" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="26" r="2" fill="#606070" />
    </svg>
  )
}

export default function HubPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <header className="flex items-center justify-between mb-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary">اختر لعبة</h1>
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm hidden sm:block">{user.email}</span>
          <button
            onClick={signOut}
            className="text-sm bg-transparent border border-border-default text-text-primary px-4 py-2 rounded-lg hover:border-border-hover hover:bg-bg-tertiary transition-colors"
          >
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  )
}

function GameCard({ game }: { game: (typeof GAMES)[0] }) {
  const card = (
    <div
      className={`bg-bg-secondary border border-border-default rounded-xl overflow-hidden transition-all ${
        game.available
          ? 'hover:border-border-hover hover:bg-bg-tertiary cursor-pointer'
          : 'opacity-60'
      }`}
    >
      <div className="h-36 bg-bg-tertiary flex items-center justify-center">
        {game.available ? <HoroufThumbnail /> : <LockIcon />}
      </div>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-1">{game.name}</h2>
        <p className="text-text-secondary text-sm mb-1">{game.description}</p>
        <p className="text-text-muted text-sm mb-5">{game.players}</p>
        {game.available ? (
          <div className="bg-accent-primary text-bg-primary font-semibold px-6 py-3 rounded-lg text-center text-base hover:bg-accent-hover transition-colors">
            العب الآن
          </div>
        ) : (
          <div className="border border-border-default text-text-muted font-semibold px-6 py-3 rounded-lg text-center text-base cursor-not-allowed">
            قريباً
          </div>
        )}
      </div>
    </div>
  )

  if (game.available) {
    return (
      <Link href={`/games/${game.id}`} className="block">
        {card}
      </Link>
    )
  }
  return card
}
