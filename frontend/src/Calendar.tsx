/**
 * Calendar for current month. Days with at least one brick are colored (indigo);
 * days with no brick are blank/subtle.
 */
type Props = {
  /** Set of dates (YYYY-MM-DD) that have at least one brick */
  datesWithBricks: Set<string>
}

export function Calendar({ datesWithBricks }: Props) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Build grid: empty cells for offset, then 1..daysInMonth
  const leadingBlanks = startWeekday
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7
  const cells: (number | null)[] = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < totalCells) cells.push(null)

  const todayDate = now.getDate()

  return (
    <section className="w-full max-w-[320px]">
      <h2 className="text-lg font-semibold text-slate-100 mb-3">{monthName}</h2>
      <div className="grid w-full grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasBrick = datesWithBricks.has(dateStr)
          const isToday = day === todayDate

          return (
            <div
              key={dateStr}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm
                ${hasBrick ? 'bg-indigo-500 text-white font-medium' : 'text-slate-500'}
                ${isToday && !hasBrick ? 'ring-1 ring-white/30' : ''}
                ${isToday && hasBrick ? 'ring-2 ring-white' : ''}`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </section>
  )
}
