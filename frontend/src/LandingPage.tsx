import { Link } from 'react-router-dom'

/**
 * Home / landing page with mot_3.jpg as full-screen background.
 * CTA links to /dailybricks.
 */
export function LandingPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/mot_3.jpg')" }}
    >
      <div className="absolute inset-0 bg-[rgb(30,33,39)]/60" />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <h1 className="font-bridge text-5xl font-semibold tracking-tight text-white drop-shadow-md md:text-6xl">
          Bridge
        </h1>
        <p className="mt-3 text-center text-lg text-slate-200 drop-shadow">
          One brick at a time.
        </p>
        <p className="mt-6 max-w-md text-center text-slate-300">
          Build the gap between who you are and who you want to become.
        </p>
        <Link
          to="/dailybricks"
          className="mt-10 rounded-lg bg-indigo-500 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-indigo-600"
        >
          Enter
        </Link>
      </div>
    </div>
  )
}
