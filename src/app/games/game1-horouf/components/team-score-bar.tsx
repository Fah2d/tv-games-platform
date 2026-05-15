'use client'

import type { TeamConfig } from '../types'

interface TeamScoreBarProps {
  team: TeamConfig
  isEnabled: boolean
  onAward: () => void
}

export default function TeamScoreBar({ team, isEnabled, onAward }: TeamScoreBarProps) {
  return (
    <button
      onClick={onAward}
      disabled={!isEnabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        isEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
      }`}
      style={{
        backgroundColor: team.color + '1A',
        borderColor: team.color + '4D',
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-bg-primary font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: team.color }}
      >
        ✓
      </div>

      <span className="flex-1 text-text-primary font-semibold text-base text-right">
        {team.name}
      </span>

      <div className="w-8 h-8 rounded-full bg-bg-surface border border-border-default flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0">
        {team.score}
      </div>
    </button>
  )
}
