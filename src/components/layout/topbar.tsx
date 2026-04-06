"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bell,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebarStore } from "@/stores/use-sidebar-store"

// ─── Breadcrumb helper ────────────────────────────────────────────

const segmentTranslations: Record<string, string> = {
  "dashboard": "Painel",
  "members": "Atendidos",
  "attendance": "Presença",
  "notes": "Notas",
  "ai-reports": "Relatórios IA",
  "life-plans": "Planos de Vida",
  "medications": "Medicações",
  "tasks": "Tarefas",
  "appointments": "Agendamentos",
  "content": "Conteúdos",
  "compliance": "Compliance",
  "settings": "Configurações",
  "admin": "Admin",
}

function formatSegment(segment: string): string {
  if (segmentTranslations[segment]) return segmentTranslations[segment]
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean)

  if (segments.length === 0) return [{ label: "Painel", href: "/dashboard" }]

  return [
    { label: "Painel", href: "/dashboard" },
    ...segments.map((seg, i) => ({
      label: formatSegment(seg),
      href: "/dashboard/" + segments.slice(0, i + 1).join("/"),
    })),
  ]
}

// ─── Topbar component ─────────────────────────────────────────────

interface TopbarProps {
  userName?: string
  userEmail?: string
  userAvatarUrl?: string
  notificationCount?: number
  onLogout?: () => void
  onOpenMobileSidebar?: () => void
}

export function Topbar({
  userName = "User",
  userEmail = "user@careflow.com",
  userAvatarUrl,
  notificationCount = 0,
  onLogout,
  onOpenMobileSidebar,
}: TopbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const breadcrumbs = useBreadcrumbs()
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Painel"

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md backdrop-saturate-150 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 lg:hidden"
        onClick={onOpenMobileSidebar}
      >
        <Menu size={20} />
      </Button>

      {/* Left: Breadcrumb / page title */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-muted-foreground/50">/</span>
              )}
              <span
                className={cn(
                  i === breadcrumbs.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="truncate text-lg font-semibold md:hidden">
          {pageTitle}
        </h1>
      </div>

      {/* Center: Global search */}
      <button
        className="hidden items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 sm:flex"
        onClick={() => {
          // Trigger command palette (Cmd+K)
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true })
          )
        }}
      >
        <Search size={16} className="shrink-0" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="pointer-events-none hidden select-none rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
          {typeof navigator !== "undefined" &&
          navigator.userAgent.includes("Mac")
            ? "\u2318K"
            : "Ctrl+K"}
        </kbd>
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          <Sun size={18} className="rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon size={18} className="absolute rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar size="sm">
                  {userAvatarUrl && <AvatarImage src={userAvatarUrl} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={8} side="bottom">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/dashboard/settings">
                  <User size={16} />
                  Perfil
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link href="/dashboard/settings">
                  <Settings size={16} />
                  Configurações
                </Link>
              }
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onLogout}>
              <LogOut size={16} />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
