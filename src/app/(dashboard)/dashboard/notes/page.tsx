"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  FileText,
  ClipboardList,
  Clock,
  ThumbsUp,
  Search,
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

type NoteStatus = "draft" | "pending" | "approved" | "rejected"

interface NoteRow {
  id: string
  date: string
  memberName: string
  memberInitials: string
  authorName: string
  authorInitials: string
  content: string
  tags: string[]
  status: NoteStatus
}

// ─── Status config ─────────────────────────────────────────────────

const statusConfig: Record<NoteStatus, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  approved: { label: "Aprovada", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  rejected: { label: "Rejeitada", className: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockNotes: NoteRow[] = [
  { id: "n1", date: "Apr 6, 2026", memberName: "James Wilson", memberInitials: "JW", authorName: "Sarah Johnson", authorInitials: "SJ", content: "Weekly wellness check completed. Vitals stable, mood positive, engaged well in group.", tags: ["Weekly Review", "Wellbeing"], status: "approved" },
  { id: "n2", date: "Apr 5, 2026", memberName: "Maria Garcia", memberInitials: "MG", authorName: "Mike Chen", authorInitials: "MC", content: "Medication review scheduled for next week. Current dosage appears effective.", tags: ["Medication", "Follow-up"], status: "pending" },
  { id: "n3", date: "Apr 5, 2026", memberName: "Robert Brown", memberInitials: "RB", authorName: "Emily Davis", authorInitials: "ED", content: "Participated in morning art therapy session. Showed improved fine motor skills.", tags: ["Activity", "Therapy"], status: "draft" },
  { id: "n4", date: "Apr 4, 2026", memberName: "Anna Lee", memberInitials: "AL", authorName: "David Kim", authorInitials: "DK", content: "Comprehensive care plan reassessment completed. Goals updated for Q2 cycle.", tags: ["Assessment", "Care Plan"], status: "approved" },
  { id: "n5", date: "Apr 4, 2026", memberName: "John Taylor", memberInitials: "JT", authorName: "Lisa Park", authorInitials: "LP", content: "Minor incident during transfer. No injury. Family notified per protocol.", tags: ["Incident", "Safety"], status: "rejected" },
  { id: "n6", date: "Apr 3, 2026", memberName: "Emily Chen", memberInitials: "EC", authorName: "Sarah Johnson", authorInitials: "SJ", content: "Daily log: Appetite good, socialized during lunch, rested in afternoon.", tags: ["Daily Log"], status: "approved" },
  { id: "n7", date: "Apr 3, 2026", memberName: "Michael Davis", memberInitials: "MD", authorName: "Tom Wright", authorInitials: "TW", content: "Physical therapy progress note. Range of motion improved by 15 degrees.", tags: ["Therapy", "Progress"], status: "pending" },
  { id: "n8", date: "Apr 2, 2026", memberName: "Sophie Martin", memberInitials: "SM", authorName: "Mike Chen", authorInitials: "MC", content: "Medication adjustment reviewed with pharmacy. New regimen starts Monday.", tags: ["Medication Review"], status: "approved" },
  { id: "n9", date: "Apr 2, 2026", memberName: "David Kim", memberInitials: "DK", authorName: "Emily Davis", authorInitials: "ED", content: "Family meeting summary. Discussed long-term care options and preferences.", tags: ["Family", "Care Plan"], status: "approved" },
  { id: "n10", date: "Apr 1, 2026", memberName: "Lisa Park", memberInitials: "LP", authorName: "Tom Wright", authorInitials: "TW", content: "Behavioral observation during evening shift. Sleep pattern improving.", tags: ["Behavioral", "Observation"], status: "pending" },
]

// ─── Columns ───────────────────────────────────────────────────────

const columns: ColumnDef<NoteRow, unknown>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "memberName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-teal-50 text-teal-700 text-[10px] font-semibold dark:bg-teal-950/40 dark:text-teal-400">
            {row.original.memberInitials}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground text-sm">{row.original.memberName}</span>
      </div>
    ),
  },
  {
    accessorKey: "authorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Autor" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-semibold dark:bg-slate-800/40 dark:text-slate-400">
            {row.original.authorInitials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{row.original.authorName}</span>
      </div>
    ),
  },
  {
    accessorKey: "content",
    header: "Prévia",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground max-w-[280px] truncate" title={row.original.content}>
        {row.original.content.length > 60 ? row.original.content.slice(0, 60) + "..." : row.original.content}
      </p>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    ),
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
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={14} />
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem><Eye size={14} className="mr-2" />Ver</DropdownMenuItem>
          <DropdownMenuItem><Edit size={14} className="mr-2" />Editar</DropdownMenuItem>
          {row.original.status === "pending" && (
            <DropdownMenuItem><CheckCircle size={14} className="mr-2" />Aprovar</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 size={14} className="mr-2" />Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Page ──────────────────────────────────────────────────────────

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [memberFilter, setMemberFilter] = useState("all")
  const [staffFilter, setStaffFilter] = useState("all")

  const members = [...new Set(mockNotes.map((n) => n.memberName))]
  const staff = [...new Set(mockNotes.map((n) => n.authorName))]

  const filtered = mockNotes.filter((n) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match = n.memberName.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
      if (!match) return false
    }
    if (statusFilter !== "all" && n.status !== statusFilter) return false
    if (memberFilter !== "all" && n.memberName !== memberFilter) return false
    if (staffFilter !== "all" && n.authorName !== staffFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notas de Atendimento"
        description="Documente e acompanhe os atendimentos"
        action={
          <Button>
            <Plus size={16} className="mr-1.5" />
            Nova Nota
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total de Notas" value="2.847" icon={FileText} trend={{ value: 5.1, direction: "up" }} description="total" />
        <StatCard label="Esta Semana" value={47} icon={ClipboardList} trend={{ value: 12, direction: "up" }} description="vs semana passada" />
        <StatCard label="Aguardando Revisão" value={12} icon={Clock} description="Aguardando aprovação" />
        <StatCard label="Aprovadas Hoje" value={8} icon={ThumbsUp} trend={{ value: 3, direction: "up" }} description="vs ontem" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar notas, atendidos, tags..."
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
          <option value="draft">Rascunho</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovada</option>
          <option value="rejected">Rejeitada</option>
        </select>
        <select
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos Atendidos</option>
          {members.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos Responsáveis</option>
          {staff.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="memberName"
        searchPlaceholder="Buscar notas..."
        showSearch={false}
      />
    </div>
  )
}
