'use client'

import type { HexCell, Question } from '../types'

interface QuestionCardProps {
  currentCell: HexCell | null
  currentQuestion: Question | null
  showAnswer: boolean
  onShowAnswer: () => void
  onNewQuestion: () => void
}

export default function QuestionCard({
  currentCell,
  currentQuestion,
  showAnswer,
  onShowAnswer,
  onNewQuestion,
}: QuestionCardProps) {
  if (!currentCell || !currentQuestion) {
    return (
      <div className="bg-bg-secondary border border-border-default rounded-xl p-6 flex flex-col items-center justify-center min-h-[260px] gap-4">
        <div className="w-10 h-10 rounded-xl border border-border-default flex items-center justify-center text-text-muted text-lg">
          ؟
        </div>
        <p className="text-text-muted text-lg text-center">اختر حرفًا لإظهار السؤال</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border-default rounded-xl p-6 min-h-[260px] flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center text-xl font-bold text-bg-primary">
          {currentCell.letter}
        </div>
      </div>

      <p className="text-text-primary text-lg leading-relaxed text-right flex-1">
        {currentQuestion.text}
      </p>

      {showAnswer && (
        <p className="text-accent-primary text-xl font-bold text-right">
          {currentQuestion.answer}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onShowAnswer}
          disabled={showAnswer}
          className="flex-1 border border-border-default text-text-primary py-2 rounded-lg hover:border-border-hover hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
        >
          عرض الإجابة
        </button>
        <button
          onClick={onNewQuestion}
          className="flex-1 border border-border-default text-text-primary py-2 rounded-lg hover:border-border-hover hover:bg-bg-tertiary transition-colors text-sm font-semibold"
        >
          سؤال جديد
        </button>
      </div>
    </div>
  )
}
