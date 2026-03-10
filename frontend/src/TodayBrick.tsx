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
      <h2 className="text-lg font-semibold text-white/95 mb-3">Today&apos;s action items</h2>

      {/* List of today's bricks */}
      {bricks.length > 0 && (
        <ul className="space-y-2 mb-4">
          {bricks.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <p className="text-slate-100">{b.brick_text}</p>
              {b.laid ? (
                <p className="mt-2 text-sm text-emerald-300 font-medium">✓ Laid</p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMarkLaid(b.id)}
                  disabled={layingId !== null}
                className="mt-3 rounded-xl bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {layingId === b.id ? '…' : 'Mark as laid'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add new action item */}
      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="One small action for today…"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-slate-100 placeholder-white/40 backdrop-blur-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !text.trim()}
          className="rounded-xl bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add action item'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-300">{error}</p>
      )}
    </section>
  )
}
