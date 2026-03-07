import { Link } from 'react-router-dom'

/**
 * Top navbar. Home links to /; other items are placeholders.
 * Background = disabled save button look; hover = active save button look.
 */
type Props = {
  currentView: 'landing' | 'app'
}

export function Navbar({ currentView }: Props) {
  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-indigo-500/50 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1 text-slate-300">
          <Link
            to="/"
            className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-indigo-500 hover:text-white ${currentView === 'landing' ? 'bg-indigo-500 text-white' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/dailybricks"
            className={`min-w-[8rem] rounded-lg px-4 py-2 text-center text-sm font-medium hover:bg-indigo-500 hover:text-white ${currentView === 'app' ? 'bg-indigo-500 text-white' : ''}`}
          >
            Daily bricks
          </Link>
          {[3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className="min-w-[8rem] rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-500 hover:text-white"
              aria-label={`Nav item ${i}`}
            >
              —
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
