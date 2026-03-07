import { Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import { LandingPage } from './LandingPage'
import { Dashboard } from './pages/Dashboard'

/**
 * Root: URL-based routing.
 * / = homepage (landing)
 * /dailybricks = dashboard (profile, bricks, calendar)
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dailybricks" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
