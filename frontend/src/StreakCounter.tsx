type Props = { streak: number }

/** Simple pill showing "N day(s) streak". Streak is computed by the backend. */
export function StreakCounter({ streak }: Props) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-800">
      <span className="text-lg font-semibold">{streak}</span>
      <span className="text-sm">
        {streak === 1 ? 'day' : 'days'} streak
      </span>
    </div>
  )
}
