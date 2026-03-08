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
      <h2 className="text-lg font-semibold text-white/95 mb-3">
        Your bridge
      </h2>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:p-5">
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
            className="rounded-xl bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          {status === 'saved' && (
            <span className="text-sm text-emerald-300">Saved.</span>
          )}

          {status === 'error' && (
            <span className="text-sm text-red-300">Save failed.</span>
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
        className="block text-sm text-white/70 mb-1"
      >
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-slate-100 placeholder-white/40 backdrop-blur-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  )
}
