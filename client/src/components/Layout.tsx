import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="group inline-flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-brand-emerald-500/30 to-brand-indigo-500/30 text-sm">
              T
            </span>
            <span className="text-zinc-100 group-hover:text-white">Trening raspored</span>
          </Link>

          <span className="badge badge-indigo">Nedeljni plan</span>
        </div>
      </header>

      <main className="container-page">{children}</main>
    </div>
  )
}
