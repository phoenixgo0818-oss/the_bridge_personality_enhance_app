import { useEffect, useRef, useState } from 'react'
import { api, type Brick, type Profile } from './api'
import { ProfileEditor } from './ProfileEditor'
import { TodayBrick } from './TodayBrick'
import { StreakCounter } from './StreakCounter'

/** Today's date as YYYY-MM-DD (same as backend). */
function todayString() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Root component: loads data on mount, renders StreakCounter + ProfileEditor + TodayBrick.
 * Refetches when the user returns to the tab and the calendar day has changed (so
 * "today's brick" and streak stay correct after midnight).
 */
function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  // undefined = not loaded yet, null = no brick today, Brick = has brick
  const [todayBrick, setTodayBrick] = useState<Brick | null | undefined>(undefined)
  const [streak, setStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  /** Date (YYYY-MM-DD) when we last loaded; used to detect new day and refetch. */
  const lastLoadedDateRef = useRef<string | null>(null)

  /** Fetch profile, today's brick, and streak in parallel. Called on mount, Retry, and when day changes. */
  const load = async () => {
    setError(null)
    try {
      const [p, brick, streakRes] = await Promise.all([
        api.getProfile(),
        api.getTodayBrick(),
        api.getStreak(),
      ])
      setProfile(p)
      setTodayBrick(brick ?? null)
      setStreak(streakRes.streak_days)
      lastLoadedDateRef.current = todayString()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /** When user returns to the tab or window, if the calendar day changed (e.g. past midnight), refetch so today's brick and streak are correct. */
  const refetchIfNewDay = () => {
    const now = todayString()
    if (lastLoadedDateRef.current !== null && lastLoadedDateRef.current !== now) {
      load()
    }
  }

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      refetchIfNewDay()
    }
    const onFocus = () => refetchIfNewDay()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  /** Child calls this after saving profile; we sync local state. */
  const onProfileSaved = (p: Profile) => setProfile(p)

  /** Child calls this after adding a brick; we update todayBrick and refresh streak. */
  const onBrickCreated = (b: Brick) => {
    setTodayBrick(b)
    api.getStreak().then((r) => setStreak(r.streak_days))
  }

  /** Child calls this after marking brick laid; we update UI and refresh streak. */
  const onBrickLaid = () => {
    setTodayBrick((prev) => (prev ? { ...prev, laid: true } : null))
    api.getStreak().then((r) => setStreak(r.streak_days))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-stone-500 mb-4">Is the backend running at http://localhost:8000?</p>
          <button
            type="button"
            onClick={load}
            className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">The Bridge</h1>
        <p className="text-stone-500 text-sm mt-1">One brick at a time.</p>
      </header>

      <StreakCounter streak={streak} />
      <ProfileEditor initial={profile!} onSaved={onProfileSaved} />
      <TodayBrick brick={todayBrick ?? null} onCreated={onBrickCreated} onLaid={onBrickLaid} />
    </div>
  )
}

export default App
