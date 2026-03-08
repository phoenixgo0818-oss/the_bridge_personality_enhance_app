import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, type Quote } from './api'

const FALLBACK_QUOTES: Quote[] = [
  { quote_text: 'One brick at a time.', individual: 'UpHuman', nation: '' },
]

/**
 * Landing page: transformation hover area, rotating quotes, CTA.
 * Quotes loaded from database; fallback if fetch fails.
 */
export function LandingPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    api.getQuotes().then(setQuotes).catch(() => setQuotes(FALLBACK_QUOTES))
  }, [])

  const list = quotes.length > 0 ? quotes : FALLBACK_QUOTES
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % list.length)
    }, 6000)
    return () => clearInterval(id)
  }, [list.length])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500">
      {/* Header: logo + copy filling the space */}
      <header className="flex h-[200px] w-full items-start justify-between gap-6 border-b border-white/80 px-6 py-5 md:h-[240px] md:gap-8 md:px-10 md:py-6">
        <img
          src="/logo.png"
          alt="UpHuman"
          className="-mt-1 h-[calc(100%-1.5rem)] w-auto shrink-0 object-contain md:-mt-0.5 md:h-[calc(100%-2rem)]"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 md:gap-3">
          <p className="text-lg font-medium leading-snug text-white/95 md:text-xl lg:text-2xl">
            Are you feeling stuck, unmotivated, or overwhelmed?
          </p>
          <p className="text-xl font-semibold leading-snug text-white md:text-2xl lg:text-3xl">
            Build yourself one brick at a time with Uphuman.
          </p>
          <p className="text-base leading-relaxed text-white/90 md:text-lg lg:text-xl">
            Lay daily bricks of growth, track them throughout the day, and watch yourself become stronger.
          </p>
          <Link
            to="/dailybricks"
            className="mt-1 w-fit rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg transition-all hover:bg-white/95 hover:shadow-xl active:scale-[0.98] md:mt-2 md:px-8 md:py-3.5 md:text-lg"
          >
            Start Laying Your First Brick
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex min-h-[calc(100vh-320px)] max-w-6xl flex-col items-center justify-center gap-10 px-4 py-12 md:flex-row md:gap-16 lg:gap-24">
        {/* Left: transformation hover area */}
        <div
          className="group relative h-[240px] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 md:h-[320px] md:max-w-lg"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br from-slate-600/80 to-slate-800/80 backdrop-blur-sm transition-opacity duration-500 ${hover ? 'opacity-0' : 'opacity-100'}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br from-indigo-500/60 via-blue-500/60 to-cyan-500/60 backdrop-blur-sm transition-opacity duration-500 ${hover ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p
              className={`text-center text-lg font-medium text-white/90 transition-opacity duration-500 md:text-xl ${hover ? 'opacity-0' : 'opacity-100'}`}
            >
              Safe & comfortable
            </p>
            <p
              className={`absolute text-center text-lg font-medium text-white transition-opacity duration-500 md:text-xl ${hover ? 'opacity-100' : 'opacity-0'}`}
            >
              Strong & progressive
            </p>
          </div>
        </div>

        {/* Right: quotes + CTA */}
        <div className="flex w-full max-w-md flex-col items-center gap-8 md:max-w-lg md:items-start">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <blockquote key={quoteIndex} className="min-h-[100px] animate-[fadeIn_0.6s_ease-out] md:min-h-[120px]">
              <p className="text-lg leading-relaxed text-slate-200 md:text-xl">
                &ldquo;{list[quoteIndex % list.length]?.quote_text}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-slate-400">
                — {list[quoteIndex % list.length]?.individual}
                {list[quoteIndex % list.length]?.nation ? ` (${list[quoteIndex % list.length]?.nation})` : ''}
              </footer>
            </blockquote>
          </div>

          <div className="flex w-full flex-col items-center gap-4 md:items-start">
            <p className="text-center text-white/70 md:text-left">One brick at a time.</p>
            <Link
              to="/dailybricks"
              className="w-full rounded-xl bg-indigo-500 px-8 py-4 text-center font-medium text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/25 active:scale-[0.98] md:w-auto"
            >
              Start Laying Your First Brick
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
