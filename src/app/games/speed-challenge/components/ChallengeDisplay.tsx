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
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{category.emoji}</span>
          <span className="text-zinc-400 text-lg">{category.nameAr}</span>
        </div>
      )}
      <p className="text-white text-3xl md:text-4xl font-black leading-tight max-w-2xl">
        {challenge.text}
      </p>
    </div>
  )
}
