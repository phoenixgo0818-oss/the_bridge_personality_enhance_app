type Props = { streak: number }

/** Simple pill showing "N day(s) streak". Streak is computed by the backend. */
export function StreakCounter({ streak }: Props) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md">
      <span className="text-lg font-semibold text-white">{streak}</span>
      <span className="text-sm text-white/90">
        {streak === 1 ? 'day' : 'days'} streak
      </span>
    </div>
  )
}
