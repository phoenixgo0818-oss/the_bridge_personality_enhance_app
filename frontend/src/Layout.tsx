import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

/**
 * Wraps all pages: Navbar + current route content (Outlet).
 * Navbar uses pathname to highlight Home when at /.
 */
export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen">
      <Navbar currentView={isHome ? 'landing' : 'app'} />
      <Outlet />
    </div>
  )
}
