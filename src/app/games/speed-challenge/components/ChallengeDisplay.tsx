import type { SpeedChallenge } from '../types'
import { CHALLENGE_CATEGORIES } from '../challenges'

interface Props {
  challenge: SpeedChallenge
}

export default function ChallengeDisplay({ challenge }: Props) {
  const category = CHALLENGE_CATEGORIES.find((c) => c.id === challenge.categoryId)

  return (
    <div className="flex flex-col items-center text-center px-4">
      {category && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">{category.emoji}</span>
          <span className="text-zinc-500 text-sm uppercase tracking-widest">{category.nameAr}</span>
        </div>
      )}
      <p className="text-white font-black text-5xl md:text-7xl leading-tight max-w-2xl">
        {challenge.text}
      </p>
    </div>
  )
}
