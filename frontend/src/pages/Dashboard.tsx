import { useEffect, useRef, useState } from 'react'
import { api, type Brick, type Profile } from '../api'
import { Calendar } from '../Calendar'
import { ProfileEditor } from '../ProfileEditor'
import { TodayBrick } from '../TodayBrick'
import { StreakCounter } from '../StreakCounter'

/** Today's date as YYYY-MM-DD (same as backend). */
function todayString() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Daily bricks page: profile, today's action items, calendar, streak.
 * Route: /dailybricks
 */
export function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [todayBricks, setTodayBricks] = useState<Brick[] | undefined>(undefined)
  const [streak, setStreak] = useState<number>(0)
  const [datesWithBricks, setDatesWithBricks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastLoadedDateRef = useRef<string | null>(null)

  const load = async () => {
    setError(null)
    try {
      const [p, bricks, streakRes, brickList] = await Promise.all([
        api.getProfile(),
        api.getTodayBricks(),
        api.getStreak(),
        api.listBricks(60),
      ])
      setProfile(p)
      setTodayBricks(bricks ?? [])
      setStreak(streakRes.streak_days)
      setDatesWithBricks(new Set(brickList.map((b) => b.date)))
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

  const onProfileSaved = (p: Profile) => setProfile(p)

  const onBrickCreated = (b: Brick) => {
    setTodayBricks((prev) => [...(prev ?? []), b])
    setDatesWithBricks((prev) => new Set([...prev, b.date]))
    api.getStreak().then((r) => setStreak(r.streak_days))
  }

  const onBrickLaid = (brickId: number) => {
    setTodayBricks((prev) =>
      (prev ?? []).map((b) => (b.id === brickId ? { ...b, laid: true } : b))
    )
    api.getStreak().then((r) => setStreak(r.streak_days))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/70">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 py-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
          <p className="text-red-300 mb-2">{error}</p>
          <p className="text-sm text-white/60 mb-4">Is the backend running at http://localhost:8000?</p>
          <button
            type="button"
            onClick={load}
            className="rounded-xl bg-indigo-500 px-6 py-2.5 text-white hover:bg-indigo-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:max-w-5xl">
      <header className="mb-8">
        <h1 className="font-bridge text-4xl font-semibold tracking-tight text-white">Bridge</h1>
        <p className="text-sm text-white/70 mt-1">One brick at a time.</p>
      </header>

      <StreakCounter streak={streak} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr),320px] lg:items-start">
        <div className="min-w-0 space-y-8">
          <ProfileEditor initial={profile!} onSaved={onProfileSaved} />
          <TodayBrick
            bricks={todayBricks ?? []}
            onCreated={onBrickCreated}
            onLaid={onBrickLaid}
          />
        </div>
        <div className="min-w-0 shrink-0 lg:pl-2">
          <Calendar datesWithBricks={datesWithBricks} />
        </div>
      </div>
    </div>
  )
}
