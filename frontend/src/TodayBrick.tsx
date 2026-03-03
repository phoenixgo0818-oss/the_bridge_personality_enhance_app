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
      <h2 className="text-lg font-medium text-stone-700 mb-3">Today&apos;s action items</h2>

      {/* List of today's bricks */}
      {bricks.length > 0 && (
        <ul className="space-y-2 mb-4">
          {bricks.map((b) => (
            <li
              key={b.id}
              className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
            >
              <p className="text-stone-800">{b.brick_text}</p>
              {b.laid ? (
                <p className="mt-2 text-sm text-green-600 font-medium">✓ Laid</p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMarkLaid(b.id)}
                  disabled={layingId !== null}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm"
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
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !text.trim()}
          className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
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
