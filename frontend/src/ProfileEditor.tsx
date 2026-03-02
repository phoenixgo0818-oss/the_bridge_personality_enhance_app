import { useEffect, useMemo, useRef, useState } from 'react'
import { api, type Profile } from './api'

type Props = {
  initial: Profile
  onSaved: (p: Profile) => void
}

/**
 * Two controlled textareas for "Who am I today?" and "Who do I want to become?"
 * Saves via PUT /profile and notifies parent via onSaved.
 * Save is disabled when form is unchanged (isDirty).
 */
export function ProfileEditor({ initial, onSaved }: Props) {
  const [currentSelf, setCurrentSelf] = useState(initial.current_self)
  const [futureSelf, setFutureSelf] = useState(initial.future_self)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const timeoutRef = useRef<number | null>(null)

  // Sync only when initial actually changes meaningfully
  useEffect(() => {
    setCurrentSelf(initial.current_self)
    setFutureSelf(initial.future_self)
  }, [initial.current_self, initial.future_self])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Derived state: is form changed?
  const isDirty = useMemo(() => {
    return (
      currentSelf !== initial.current_self ||
      futureSelf !== initial.future_self
    )
  }, [currentSelf, futureSelf, initial])

  const handleSave = async () => {
    if (saving || !isDirty) return

    setSaving(true)
    setStatus('idle')

    try {
      const updated = await api.updateProfile(currentSelf, futureSelf)
      onSaved(updated)

      setStatus('saved')

      timeoutRef.current = window.setTimeout(() => {
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-medium text-stone-700 mb-3">
        Your bridge
      </h2>

      <div className="space-y-3">
        <Field
          id="current"
          label="Who am I today?"
          value={currentSelf}
          onChange={setCurrentSelf}
          placeholder="A few words about where you are now…"
        />

        <Field
          id="future"
          label="Who do I want to become?"
          value={futureSelf}
          onChange={setFutureSelf}
          placeholder="A few words about who you're building toward…"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          {status === 'saved' && (
            <span className="text-sm text-green-600">Saved.</span>
          )}

          {status === 'error' && (
            <span className="text-sm text-red-600">Save failed.</span>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Small Internal Reusable Field Component ---------- */

type FieldProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

function Field({ id, label, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm text-stone-500 mb-1"
      >
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
    </div>
  )
}
