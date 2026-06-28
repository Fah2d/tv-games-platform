'use client'

import { useState } from 'react'
import type { FawazeeerSettings } from '../types'

const TEAM_COLORS = [
  '#34D399', '#F87171', '#60A5FA', '#A78BFA',
  '#F59E0B', '#EC4899', '#14B8A6', '#F97316',
]

const ROUNDS_OPTIONS = [2, 3, 5]
const QPR_OPTIONS = [3, 5, 7]

interface SetupScreenProps {
  onStart: (settings: FawazeeerSettings) => void
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [team1Color, setTeam1Color] = useState('#34D399')
  const [team2Color, setTeam2Color] = useState('#F87171')
  const [totalRounds, setTotalRounds] = useState(3)
  const [questionsPerRound, setQuestionsPerRound] = useState(5)

  function handleStart(): void {
    onStart({ team1Name, team2Name, team1Color, team2Color, totalRounds, questionsPerRound })
  }

  const teamRows = [
    {
      key: 'team1',
      nameLabel: 'اسم الفريق الأول',
      placeholder: 'الفريق الأول',
      nameValue: team1Name,
      setName: setTeam1Name,
      colorLabel: 'لون الفريق الأول',
      color: team1Color,
      conflict: team2Color,
      setColor: setTeam1Color,
    },
    {
      key: 'team2',
      nameLabel: 'اسم الفريق الثاني',
      placeholder: 'الفريق الثاني',
      nameValue: team2Name,
      setName: setTeam2Name,
      colorLabel: 'لون الفريق الثاني',
      color: team2Color,
      conflict: team1Color,
      setColor: setTeam2Color,
    },
  ]

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary">فوازير</h1>
          <p className="text-text-secondary mt-2">إعداد اللعبة</p>
        </div>

        {teamRows.map(({ key, nameLabel, placeholder, nameValue, setName, colorLabel, color, conflict, setColor }) => (
          <div key={key} className="space-y-2">
            <label className="text-text-primary font-semibold block">{nameLabel}</label>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="bg-bg-surface border border-border-default rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors w-full text-right"
            />
            <label className="text-text-primary font-semibold block">{colorLabel}</label>
            <div className="flex gap-3 flex-wrap">
              {TEAM_COLORS.map((swatch) => {
                const isSelected = color === swatch
                const isConflict = conflict === swatch
                return (
                  <button
                    key={swatch}
                    disabled={isConflict}
                    onClick={() => setColor(swatch)}
                    aria-label={swatch}
                    className={`w-9 h-9 rounded-full transition-all ${
                      isConflict
                        ? 'opacity-30 cursor-not-allowed'
                        : isSelected
                        ? 'ring-2 ring-white scale-110'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: swatch }}
                  />
                )
              })}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-text-primary font-semibold block">عدد الجولات</label>
          <div className="flex gap-2">
            {ROUNDS_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setTotalRounds(n)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  totalRounds === n
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-surface border border-border-default text-text-secondary hover:border-border-hover hover:text-text-primary'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-text-primary font-semibold block">أسئلة لكل جولة</label>
          <div className="flex gap-2">
            {QPR_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setQuestionsPerRound(n)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  questionsPerRound === n
                    ? 'bg-accent-primary text-bg-primary'
                    : 'bg-bg-surface border border-border-default text-text-secondary hover:border-border-hover hover:text-text-primary'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-accent-primary text-bg-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors"
        >
          ابدأ اللعبة
        </button>

      </div>
    </div>
  )
}
