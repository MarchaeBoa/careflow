import Link from "next/link"
import { Activity } from "lucide-react"

// Prevent static prerendering — auth pages depend on runtime env vars / session
export const dynamic = "force-dynamic"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left side: gradient panel (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-10 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <Activity className="h-12 w-12" />
          <h1 className="text-3xl font-bold tracking-tight">CareFlow</h1>
          <p className="max-w-sm text-lg text-primary-foreground/80">
            Simplifique sua gestao de cuidado com fluxos inteligentes e
            colaboracao em tempo real.
          </p>
        </div>
      </div>

      {/* Right side: auth form */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 lg:hidden"
        >
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">CareFlow</span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
