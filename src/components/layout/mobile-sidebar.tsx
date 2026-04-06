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
  ChevronDown,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSidebarStore } from "@/stores/use-sidebar-store"

// ─── Navigation config (shared with sidebar) ─────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/dashboard/members", icon: Users },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Notes", href: "/dashboard/notes", icon: FileText },
  { label: "AI Reports", href: "/dashboard/ai-reports", icon: Brain },
  { label: "Life Plans", href: "/dashboard/life-plans", icon: Target },
  { label: "Medications", href: "/dashboard/medications", icon: Pill },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { label: "Content", href: "/dashboard/content", icon: BookOpen },
  { label: "Compliance", href: "/dashboard/compliance", icon: ShieldCheck },
]

const adminNavItems: NavItem[] = [
  { label: "Users", href: "/dashboard/admin/users", icon: UserCog },
  { label: "Organizations", href: "/dashboard/admin/organizations", icon: Building2 },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  { label: "Audit Log", href: "/dashboard/admin/audit-log", icon: ScrollText },
]

// ─── Mobile nav link ──────────────────────────────────────────────

function MobileNavLink({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-500" />
      )}
      <item.icon
        size={20}
        className={cn(
          "shrink-0",
          isActive ? "text-teal-600 dark:text-teal-400" : ""
        )}
      />
      <span>{item.label}</span>
    </Link>
  )
}

// ─── Mobile sidebar component ─────────────────────────────────────

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orgName?: string
  userName?: string
  userEmail?: string
  userAvatarUrl?: string
  onLogout?: () => void
}

export function MobileSidebar({
  open,
  onOpenChange,
  orgName = "CareFlow Org",
  userName = "User",
  userEmail = "user@careflow.com",
  userAvatarUrl,
  onLogout,
}: MobileSidebarProps) {
  const { adminExpanded, toggleAdmin } = useSidebarStore()

  const handleNavigate = () => {
    onOpenChange(false)
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        {/* Header */}
        <SheetHeader className="border-b border-border/40 px-4 py-4">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
          <p className="text-[11px] font-medium text-muted-foreground">
            {orgName}
          </p>
        </SheetHeader>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 px-3 py-3">
            {mainNavItems.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}

            <Separator className="my-3" />

            {/* Admin section */}
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
                <MobileNavLink
                  key={item.href}
                  item={item}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* User section */}
        <div className="border-t border-border/40 p-4">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              {userAvatarUrl && <AvatarImage src={userAvatarUrl} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{userName}</span>
              <span className="truncate text-[11px] text-muted-foreground">
                {userEmail}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                onLogout?.()
                onOpenChange(false)
              }}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
