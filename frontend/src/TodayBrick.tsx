import { useState } from 'react'
import { api, type Brick } from './api'

type Props = {
  bricks: Brick[]  // Today's action items; empty = none yet
  onCreated: (b: Brick) => void
  onLaid: (brickId: number) => void
}

/**
 * Renders today's action items: list of bricks + add form.
 * Each item has its own "Mark as laid". Streak counts only when ALL are laid.
 */
export function TodayBrick({ bricks, onCreated, onLaid }: Props) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [layingId, setLayingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    const t = text.trim()
    if (!t) return
    setError(null)
    setSubmitting(true)
    try {
      const b = await api.createTodayBrick(t)
      onCreated(b)
      setText('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add action item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkLaid = async (brickId: number) => {
    setError(null)
    setLayingId(brickId)
    try {
      await api.markBrickLaid(brickId)
      onLaid(brickId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to mark as laid')
    } finally {
      setLayingId(null)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-100 mb-3">Today&apos;s action items</h2>

      {/* List of today's bricks */}
      {bricks.length > 0 && (
        <ul className="space-y-2 mb-4">
          {bricks.map((b) => (
            <li
              key={b.id}
              className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-sm"
            >
              <p className="text-slate-100">{b.brick_text}</p>
              {b.laid ? (
                <p className="mt-2 text-sm text-emerald-400 font-medium">✓ Laid</p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMarkLaid(b.id)}
                  disabled={layingId !== null}
                  className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 text-sm"
                >
                  {layingId === b.id ? '…' : 'Mark as laid'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add new action item */}
      <div className="space-y-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="One small action for today…"
          className="w-full rounded-lg border border-white/40 bg-[rgba(30,33,39,0.85)] backdrop-blur-sm px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !text.trim()}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add action item'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </section>
  )
}
