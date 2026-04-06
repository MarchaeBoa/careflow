import { AuthProvider } from "@/components/auth/auth-provider"
import { DashboardShell } from "@/components/layout/dashboard-shell"

// Prevent static prerendering — dashboard pages depend on runtime env vars / session
export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}
