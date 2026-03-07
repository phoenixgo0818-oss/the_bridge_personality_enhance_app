import { Link } from 'react-router-dom'

/**
 * Top navbar: transparent (opacity 0.5). Buttons: no color, only opacity change on hover/active (0.3).
 */
type Props = {
  currentView: 'landing' | 'app'
}

export function Navbar({ currentView }: Props) {
  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1 text-slate-300">
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
  )
}
