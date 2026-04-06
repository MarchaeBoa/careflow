"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { useAuthContext } from "@/components/auth/auth-provider"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile, organization, isAdmin, signOut } = useAuthContext()

  const userName = profile?.full_name ?? "Usuário"
  const userEmail = profile?.email ?? ""
  const userAvatarUrl = profile?.avatar_url ?? undefined
  const orgName = organization?.name ?? "CareFlow"

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar -- width is managed internally by Sidebar via useSidebarStore */}
      <div className="hidden md:block">
        <Sidebar
          orgName={orgName}
          userName={userName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          showAdmin={isAdmin}
          onLogout={signOut}
        />
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar
            orgName={orgName}
            userName={userName}
            userEmail={userEmail}
            userAvatarUrl={userAvatarUrl}
            showAdmin={isAdmin}
            onLogout={signOut}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          userName={userName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          notificationCount={3}
          onLogout={signOut}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
