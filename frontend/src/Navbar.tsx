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
      <nav className="navbar-glow sticky top-4 z-10 rounded-lg border border-white/10 bg-gradient-to-br from-slate-600/80 to-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:gap-1">
          <div className="flex flex-wrap items-center gap-1 text-slate-300">
            <Link
              to="/"
              className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-gradient-to-br hover:from-indigo-500/60 hover:via-blue-500/60 hover:to-cyan-500/60 ${currentView === 'landing' ? 'bg-gradient-to-br from-indigo-500/60 via-blue-500/60 to-cyan-500/60' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/dailybricks"
              className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-gradient-to-br hover:from-indigo-500/60 hover:via-blue-500/60 hover:to-cyan-500/60 ${currentView === 'app' ? 'bg-gradient-to-br from-indigo-500/60 via-blue-500/60 to-cyan-500/60' : ''}`}
            >
              Daily bricks
            </Link>
            {[3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                className="min-w-[8rem] rounded-lg px-4 py-2 text-sm font-medium hover:bg-gradient-to-br hover:from-indigo-500/60 hover:via-blue-500/60 hover:to-cyan-500/60"
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
