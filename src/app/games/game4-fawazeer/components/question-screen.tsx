'use client'

import type { FawazeeerGameState, TeamId } from '../types'

function toArabicIndic(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])
}

const ROUND_ORDINALS: Record<number, string> = {
  1: 'الأولى',
  2: 'الثانية',
  3: 'الثالثة',
  4: 'الرابعة',
  5: 'الخامسة',
}

interface QuestionScreenProps {
  gameState: FawazeeerGameState
  onShowAnswer: () => void
  onAwardPoint: (teamId: TeamId) => void
  onSkip: () => void
  onNextQuestion: () => void
}

export default function QuestionScreen({
  gameState,
  onShowAnswer,
  onAwardPoint,
  onSkip,
  onNextQuestion,
}: QuestionScreenProps) {
  const {
    teams,
    currentRound,
    totalRounds,
    questionsPerRound,
    currentQuestionIndexInRound,
    showAnswer,
    questionAnswered,
    questions,
  } = gameState

  const globalIndex = (currentRound - 1) * questionsPerRound + currentQuestionIndexInRound
  const currentQuestion = questions[globalIndex]
  const [team1, team2] = teams
  const ordinal = ROUND_ORDINALS[currentRound] ?? toArabicIndic(currentRound)
  const questionNum = currentQuestionIndexInRound + 1

  if (!currentQuestion) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary" dir="rtl">

      {/* Control panel — first child renders on RIGHT in RTL flex-row */}
      <div className="w-[300px] shrink-0 h-full flex flex-col p-5 gap-4 bg-[#0F0F1A] border-l border-border-default">

        {/* Round / question info */}
        <div>
          <p className="text-text-muted text-xs">الجولة</p>
          <h2 className="text-base font-bold text-text-primary">
            {ordinal} من {toArabicIndic(totalRounds)}
          </h2>
          <p className="text-text-muted text-xs mt-1">
            السؤال {toArabicIndic(questionNum)} من {toArabicIndic(questionsPerRound)}
          </p>
        </div>

        <div className="border-t border-border-default" />

        {/* (a) Reveal answer */}
        <button
          onClick={onShowAnswer}
          disabled={showAnswer}
          className="w-full py-3 rounded-lg font-semibold transition-colors bg-accent-primary text-bg-primary hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          اكشف الإجابة
        </button>

        <div className="border-t border-border-default" />

        {/* (b) Award team 1 / (c) Award team 2 */}
        <div className="flex flex-col gap-3 flex-1">
          {[team1, team2].map((team) => (
            <button
              key={team.id}
              onClick={() => onAwardPoint(team.id)}
              disabled={questionAnswered}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                questionAnswered
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:opacity-90 active:scale-[0.98] cursor-pointer'
              }`}
              style={{
                backgroundColor: team.color + '33',
                borderColor: team.color + '80',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-bg-primary font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: team.color }}
              >
                ✓
              </div>
              <span className="flex-1 text-text-primary font-semibold text-right text-sm">
                {team.name}
              </span>
              <span
                className="font-bold text-xl flex-shrink-0"
                style={{ color: team.color }}
              >
                {toArabicIndic(team.score)}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-border-default" />

        {/* (d) Skip */}
        <button
          onClick={onSkip}
          disabled={questionAnswered}
          className="w-full py-3 rounded-lg font-semibold transition-colors bg-bg-surface border border-border-default text-text-secondary hover:text-text-primary hover:border-border-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          تجاوز — لا أحد
        </button>

        {/* (e) Next question */}
        <button
          onClick={onNextQuestion}
          disabled={!questionAnswered}
          className="w-full py-3 rounded-lg font-semibold transition-colors bg-indigo-700 text-white hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          السؤال التالي ←
        </button>

      </div>

      {/* Main display — question centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 gap-10">

        <div className="max-w-2xl w-full text-center space-y-10">

          {/* Round badge */}
          <p className="text-text-muted text-sm tracking-wide">
            فوازير — الجولة {ordinal}
          </p>

          {/* Question text */}
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-relaxed">
            {currentQuestion.question}
          </h1>

          {/* Answer reveal */}
          {showAnswer && (
            <div className="animate-scale-fade-in">
              <div className="w-20 h-px bg-border-default mx-auto mb-6" />
              <p className="text-text-muted text-sm mb-3">الإجابة</p>
              <p className="text-3xl font-bold text-accent-primary">
                {currentQuestion.answer}
              </p>
            </div>
          )}

          {/* Awarded indicator */}
          {questionAnswered && (
            <p className="text-text-muted text-sm animate-fade-in-up">
              {showAnswer ? 'جاهز للسؤال التالي ←' : ''}
            </p>
          )}

        </div>

      </div>

    </div>
  )
}
