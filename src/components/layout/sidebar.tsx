"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Brain,
  Target,
  Pill,
  CheckSquare,
  Calendar,
  BookOpen,
  ShieldCheck,
  UserCog,
  Building2,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebarStore } from "@/stores/use-sidebar-store"

// ─── Navigation config ────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Atendidos", href: "/dashboard/members", icon: Users },
  { label: "Presença", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Notas", href: "/dashboard/notes", icon: FileText },
  { label: "Relatórios IA", href: "/dashboard/ai-reports", icon: Brain },
  { label: "Planos de Vida", href: "/dashboard/life-plans", icon: Target },
  { label: "Medicações", href: "/dashboard/medications", icon: Pill },
  { label: "Tarefas", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Agendamentos", href: "/dashboard/appointments", icon: Calendar },
  { label: "Conteúdos", href: "/dashboard/content", icon: BookOpen },
  { label: "Compliance", href: "/dashboard/compliance", icon: ShieldCheck },
]

const adminNavItems: NavItem[] = [
  { label: "Usuários", href: "/dashboard/admin/users", icon: UserCog },
  { label: "Organizações", href: "/dashboard/admin/organizations", icon: Building2 },
  { label: "Configurações", href: "/dashboard/admin/settings", icon: Settings },
  { label: "Auditoria", href: "/dashboard/admin/audit-log", icon: ScrollText },
]

// ─── Nav link component ───────────────────────────────────────────

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const pathname = usePathname()
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)

  const link = (
    <Link
      href={item.href}
      className={cn(
        "group/nav-link relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "gap-3",
        isActive
          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-500 transition-all" />
      )}
      <item.icon
        size={20}
        className={cn(
          "shrink-0 transition-colors",
          isActive
            ? "text-teal-600 dark:text-teal-400"
            : "text-muted-foreground group-hover/nav-link:text-foreground"
        )}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={link} />
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
}

// ─── Sidebar component ────────────────────────────────────────────

interface SidebarProps {
  orgName?: string
  userName?: string
  userEmail?: string
  userAvatarUrl?: string
  showAdmin?: boolean
  onLogout?: () => void
}

export function Sidebar({
  orgName = "CareFlow Org",
  userName = "User",
  userEmail = "user@careflow.com",
  userAvatarUrl,
  showAdmin = true,
  onLogout,
}: SidebarProps) {
  const { sidebarOpen, toggleSidebar, adminExpanded, toggleAdmin } =
    useSidebarStore()

  const collapsed = !sidebarOpen

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-r border-border/60 bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* ── Header: Logo + org name ────────────────── */}
        <div
          className={cn(
            "flex items-center border-b border-border/40 px-4 py-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {collapsed ? (
            <Logo size="sm" showText={false} />
          ) : (
            <div className="flex flex-col gap-1 overflow-hidden">
              <Logo size="sm" />
              <span className="truncate pl-0.5 text-[11px] font-medium text-muted-foreground">
                {orgName}
              </span>
            </div>
          )}
        </div>

        {/* ── Collapse toggle ────────────────────────── */}
        <Button
          variant="outline"
          size="icon-xs"
          className="absolute -right-3 top-6 z-10 rounded-full border border-border bg-card shadow-sm hover:bg-muted"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </Button>

        {/* ── Navigation ─────────────────────────────── */}
        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col gap-1 px-2">
            {/* Main nav */}
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} />
            ))}

            {/* Admin section — only visible for org_admin / super_admin */}
            {showAdmin && (
              <>
                <Separator className="my-3" />

                {collapsed ? (
                  // In collapsed mode, show admin items as icons
                  adminNavItems.map((item) => (
                    <NavLink key={item.href} item={item} collapsed={collapsed} />
                  ))
                ) : (
                  <>
                    <button
                      onClick={toggleAdmin}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronDown
                        size={14}
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          !adminExpanded && "-rotate-90"
                        )}
                      />
                      <span>Admin</span>
                    </button>
                    <div
                      className={cn(
                        "flex flex-col gap-1 overflow-hidden transition-all duration-200",
                        adminExpanded
                          ? "max-h-[300px] opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      {adminNavItems.map((item) => (
                        <NavLink
                          key={item.href}
                          item={item}
                          collapsed={collapsed}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </nav>
        </ScrollArea>

        {/* ── User section ───────────────────────────── */}
        <div className="border-t border-border/40 p-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <Avatar size="sm">
                      {userAvatarUrl && <AvatarImage src={userAvatarUrl} />}
                      <AvatarFallback>
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <TooltipContent side="right" sideOffset={8}>
                {userName}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar size="default">
                {userAvatarUrl && <AvatarImage src={userAvatarUrl} />}
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {userName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onLogout}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
