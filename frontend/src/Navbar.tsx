import { Link } from 'react-router-dom'

/**
 * Top navbar: transparent, smooth edges (rounded), margin from browser edge, responsive.
 */
type Props = {
  currentView: 'landing' | 'app'
}

export function Navbar({ currentView }: Props) {
  return (
    <div className="px-4 pt-4">
      <nav className="sticky top-4 z-10 rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:gap-1">
          <div className="flex flex-wrap items-center gap-1 text-slate-300">
            <Link
              to="/"
              className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-white/30 ${currentView === 'landing' ? 'bg-white/30' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/dailybricks"
              className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-white/30 ${currentView === 'app' ? 'bg-white/30' : ''}`}
            >
              Daily bricks
            </Link>
            {[3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                className="min-w-[8rem] rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/30"
                aria-label={`Nav item ${i}`}
              >
                —
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}
