import { useState } from 'react'
import { api, type Brick } from './api'

type Props = {
  brick: Brick | null  // null = no brick today, Brick = has brick
  onCreated: (b: Brick) => void
  onLaid: () => void
}

/**
 * Renders one of three states:
 * - undefined: loading (parent hasn't loaded yet)
 * - null: no brick today → show input + Add brick button
 * - Brick: has brick → show text + Mark as laid (or ✓ Laid)
 */
export function TodayBrick({ brick, onCreated, onLaid }: Props) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [laying, setLaying] = useState(false)
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
      setError(e instanceof Error ? e.message : 'Failed to add brick')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkLaid = async () => {
    setError(null)
    setLaying(true)
    try {
      await api.markTodayLaid()
      onLaid()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to mark as laid')
    } finally {
      setLaying(false)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-medium text-stone-700 mb-3">Today&apos;s brick</h2>

      {brick === undefined ? (
        <p className="text-stone-500">Loading…</p>
      ) : brick === null ? (
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
            {submitting ? 'Adding…' : 'Add brick'}
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-stone-800">{brick.brick_text}</p>
          {brick.laid ? (
            <p className="mt-2 text-sm text-green-600 font-medium">✓ Laid</p>
          ) : (
            <button
              type="button"
              onClick={handleMarkLaid}
              disabled={laying}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm"
            >
              {laying ? '…' : 'Mark as laid'}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </section>
  )
}
