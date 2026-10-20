import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

/** Same shell as the résumé (no extra overlays) so colors and canvas match the main site. */
export function GamesLayout() {
  return (
    <div className="resume-root relative min-h-dvh overflow-x-clip bg-surface print:bg-white">
      <Navbar />
      <Outlet />
    </div>
  )
}
