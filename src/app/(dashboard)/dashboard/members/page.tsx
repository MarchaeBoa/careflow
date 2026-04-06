"use client"

import { useState } from "react"
import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Phone,
  Users,
  UserCheck,
  UserX,
  PauseCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─── Types ─────────────────────────────────────────────────────────

type MemberStatus = "active" | "inactive" | "on-hold" | "discharged"

interface MemberRow {
  id: string
  name: string
  initials: string
  dob: string
  age: number
  status: MemberStatus
  location: string
  emergencyContact: string
  emergencyPhone: string
  lastNote: string
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockMembers: MemberRow[] = [
  { id: "m1", name: "James Wilson", initials: "JW", dob: "Mar 15, 1958", age: 68, status: "active", location: "Main Center", emergencyContact: "Mary Wilson", emergencyPhone: "(555) 100-2001", lastNote: "Apr 5, 2026" },
  { id: "m2", name: "Maria Garcia", initials: "MG", dob: "Jul 22, 1965", age: 60, status: "active", location: "East Wing", emergencyContact: "Carlos Garcia", emergencyPhone: "(555) 100-2002", lastNote: "Apr 4, 2026" },
  { id: "m3", name: "Robert Brown", initials: "RB", dob: "Nov 3, 1972", age: 53, status: "active", location: "Main Center", emergencyContact: "Susan Brown", emergencyPhone: "(555) 100-2003", lastNote: "Apr 3, 2026" },
  { id: "m4", name: "Anna Lee", initials: "AL", dob: "Feb 14, 1980", age: 46, status: "on-hold", location: "West Campus", emergencyContact: "David Lee", emergencyPhone: "(555) 100-2004", lastNote: "Mar 28, 2026" },
  { id: "m5", name: "John Taylor", initials: "JT", dob: "Sep 8, 1955", age: 70, status: "inactive", location: "Main Center", emergencyContact: "Pat Taylor", emergencyPhone: "(555) 100-2005", lastNote: "Mar 20, 2026" },
  { id: "m6", name: "Emily Chen", initials: "EC", dob: "Dec 30, 1990", age: 35, status: "active", location: "East Wing", emergencyContact: "Wei Chen", emergencyPhone: "(555) 100-2006", lastNote: "Apr 5, 2026" },
  { id: "m7", name: "Michael Davis", initials: "MD", dob: "Jun 17, 1968", age: 57, status: "active", location: "West Campus", emergencyContact: "Janet Davis", emergencyPhone: "(555) 100-2007", lastNote: "Apr 1, 2026" },
  { id: "m8", name: "Sophie Martin", initials: "SM", dob: "Apr 25, 1975", age: 50, status: "inactive", location: "Main Center", emergencyContact: "Pierre Martin", emergencyPhone: "(555) 100-2008", lastNote: "Mar 15, 2026" },
  { id: "m9", name: "David Kim", initials: "DK", dob: "Aug 12, 1983", age: 42, status: "active", location: "East Wing", emergencyContact: "Jung Kim", emergencyPhone: "(555) 100-2009", lastNote: "Apr 4, 2026" },
  { id: "m10", name: "Lisa Park", initials: "LP", dob: "Jan 7, 1992", age: 34, status: "active", location: "West Campus", emergencyContact: "Tom Park", emergencyPhone: "(555) 100-2010", lastNote: "Apr 6, 2026" },
  { id: "m11", name: "Thomas Wright", initials: "TW", dob: "May 20, 1961", age: 64, status: "active", location: "Main Center", emergencyContact: "Linda Wright", emergencyPhone: "(555) 100-2011", lastNote: "Apr 6, 2026" },
  { id: "m12", name: "Patricia Nguyen", initials: "PN", dob: "Oct 11, 1978", age: 47, status: "on-hold", location: "East Wing", emergencyContact: "Huy Nguyen", emergencyPhone: "(555) 100-2012", lastNote: "Mar 30, 2026" },
  { id: "m13", name: "Charles Robinson", initials: "CR", dob: "Mar 2, 1950", age: 76, status: "active", location: "Main Center", emergencyContact: "Diane Robinson", emergencyPhone: "(555) 100-2013", lastNote: "Apr 2, 2026" },
  { id: "m14", name: "Helen Foster", initials: "HF", dob: "Aug 28, 1987", age: 38, status: "discharged", location: "West Campus", emergencyContact: "Mark Foster", emergencyPhone: "(555) 100-2014", lastNote: "Feb 10, 2026" },
  { id: "m15", name: "William Adams", initials: "WA", dob: "Dec 5, 1970", age: 55, status: "active", location: "East Wing", emergencyContact: "Grace Adams", emergencyPhone: "(555) 100-2015", lastNote: "Apr 5, 2026" },
]

// ─── Status config ─────────────────────────────────────────────────

const statusConfig: Record<MemberStatus, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  inactive: { label: "Inativo", className: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  "on-hold": { label: "Em Espera", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  discharged: { label: "Desligado", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
}

// ─── Columns ───────────────────────────────────────────────────────

const columns: ColumnDef<MemberRow, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/members/${row.original.id}`} className="flex items-center gap-3 group">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-teal-50 text-teal-700 text-xs font-semibold dark:bg-teal-950/40 dark:text-teal-400">
            {row.original.initials}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {row.original.name}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "dob",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nascimento" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.dob}</span>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Idade" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.age}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const cfg = statusConfig[row.original.status]
      return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
          {cfg.label}
        </span>
      )
    },
    filterFn: (row, id, value) => value === "all" ? true : row.getValue(id) === value,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unidade" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "emergencyContact",
    header: "Contato de Emergência",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{row.original.emergencyContact}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Phone size={10} />
          {row.original.emergencyPhone}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "lastNote",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Última Nota" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.lastNote}</span>,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={14} />
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem><Eye size={14} className="mr-2" />Ver</DropdownMenuItem>
          <DropdownMenuItem><Edit size={14} className="mr-2" />Editar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Archive size={14} className="mr-2" />Arquivar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Page ──────────────────────────────────────────────────────────

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filtered = mockMembers
    .filter((m) => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (statusFilter !== "all" && m.status !== statusFilter) return false
      if (locationFilter !== "all" && m.location !== locationFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "age") return a.age - b.age
      if (sortBy === "recent") return b.lastNote.localeCompare(a.lastNote)
      return 0
    })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atendidos"
        description="Gerencie os atendidos e suas informações"
        action={
          <Button>
            <Plus size={16} className="mr-1.5" />
            Novo Atendido
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value="1.247" icon={Users} trend={{ value: 3.2, direction: "up" }} description="vs mês passado" />
        <StatCard label="Ativos" value="1.189" icon={UserCheck} trend={{ value: 1.8, direction: "up" }} description="vs mês passado" />
        <StatCard label="Inativos" value={42} icon={UserX} trend={{ value: 5, direction: "down" }} description="vs mês passado" />
        <StatCard label="Em Espera" value={16} icon={PauseCircle} description="Aguardando revisão" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar atendidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="on-hold">Em Espera</option>
          <option value="discharged">Desligado</option>
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todas Unidades</option>
          <option value="Main Center">Main Center</option>
          <option value="East Wing">East Wing</option>
          <option value="West Campus">West Campus</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="name">Ordenar por Nome</option>
          <option value="age">Ordenar por Idade</option>
          <option value="recent">Ordenar por Nota Recente</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="name"
        searchPlaceholder="Buscar atendidos..."
        showSearch={false}
      />
    </div>
  )
}
