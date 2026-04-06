"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  List,
  LayoutGrid,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Tag,
  Calendar,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ─────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high" | "urgent"
type Status = "todo" | "in_progress" | "review" | "done"

interface TaskRow {
  id: string
  title: string
  assignee: string
  assigneeInitials: string
  priority: Priority
  dueDate: string
  status: Status
  tags: string[]
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockTasks: TaskRow[] = [
  { id: "t1", title: "Update fire safety training materials", assignee: "Sarah Johnson", assigneeInitials: "SJ", priority: "high", dueDate: "Apr 8, 2026", status: "in_progress", tags: ["Safety", "Training"] },
  { id: "t2", title: "Monthly medication audit for Wing B", assignee: "Mike Chen", assigneeInitials: "MC", priority: "urgent", dueDate: "Apr 7, 2026", status: "todo", tags: ["Compliance"] },
  { id: "t3", title: "Review Q1 individual care plans", assignee: "Emily Davis", assigneeInitials: "ED", priority: "medium", dueDate: "Apr 10, 2026", status: "in_progress", tags: ["Care Plans"] },
  { id: "t4", title: "Prepare staff meeting agenda and minutes", assignee: "David Kim", assigneeInitials: "DK", priority: "low", dueDate: "Apr 11, 2026", status: "todo", tags: ["Admin"] },
  { id: "t5", title: "Update incident report forms to new template", assignee: "Lisa Park", assigneeInitials: "LP", priority: "high", dueDate: "Apr 9, 2026", status: "review", tags: ["Compliance", "Forms"] },
  { id: "t6", title: "Organize staff wellness event for April", assignee: "Tom Wright", assigneeInitials: "TW", priority: "low", dueDate: "Apr 15, 2026", status: "todo", tags: ["Wellbeing"] },
  { id: "t7", title: "Complete annual compliance training module", assignee: "Sarah Johnson", assigneeInitials: "SJ", priority: "medium", dueDate: "Apr 12, 2026", status: "done", tags: ["Compliance", "Training"] },
  { id: "t8", title: "Update emergency evacuation procedures", assignee: "Mike Chen", assigneeInitials: "MC", priority: "high", dueDate: "Apr 8, 2026", status: "in_progress", tags: ["Safety"] },
  { id: "t9", title: "Schedule quarterly performance reviews", assignee: "Emily Davis", assigneeInitials: "ED", priority: "medium", dueDate: "Apr 14, 2026", status: "todo", tags: ["HR"] },
  { id: "t10", title: "Order medical supplies for next month", assignee: "David Kim", assigneeInitials: "DK", priority: "urgent", dueDate: "Apr 7, 2026", status: "review", tags: ["Supplies"] },
  { id: "t11", title: "Prepare quarterly budget proposal", assignee: "Lisa Park", assigneeInitials: "LP", priority: "medium", dueDate: "Apr 16, 2026", status: "done", tags: ["Finance"] },
  { id: "t12", title: "Migrate member records to new database", assignee: "Tom Wright", assigneeInitials: "TW", priority: "high", dueDate: "Apr 10, 2026", status: "in_progress", tags: ["IT", "Data"] },
]

// ─── Style Maps ───────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  low: {
    label: "Baixa",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  medium: {
    label: "Média",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  high: {
    label: "Alta",
    className: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  urgent: {
    label: "Urgente",
    className: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-500",
  },
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  todo: { label: "A Fazer", className: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  in_progress: { label: "Em Andamento", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  review: { label: "Revisão", className: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
  done: { label: "Concluído", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
}

const kanbanColumns = [
  { key: "todo" as Status, label: "A Fazer", accent: "border-t-slate-400" },
  { key: "in_progress" as Status, label: "Em Andamento", accent: "border-t-blue-500" },
  { key: "review" as Status, label: "Revisão", accent: "border-t-purple-500" },
  { key: "done" as Status, label: "Concluído", accent: "border-t-emerald-500" },
]

// ─── List Columns ──────────────────────────────────────────────────

const columns: ColumnDef<TaskRow, unknown>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsável" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>{row.original.assigneeInitials}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{row.original.assignee}</span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prioridade" />,
    cell: ({ row }) => {
      const p = row.original.priority
      const cfg = priorityConfig[p]
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prazo" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar size={13} className="shrink-0" />
        {row.original.dueDate}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status
      const cfg = statusConfig[s]
      return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon-xs">
            <MoreHorizontal size={14} />
          </Button>
        } />
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Eye size={14} />Ver Detalhes</DropdownMenuItem>
          <DropdownMenuItem><Edit size={14} />Editar Tarefa</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 size={14} />Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Filter Bar ────────────────────────────────────────────────────

function TaskFilters({
  search,
  onSearchChange,
  assigneeFilter,
  onAssigneeChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
}: {
  search: string
  onSearchChange: (v: string) => void
  assigneeFilter: string
  onAssigneeChange: (v: string | null) => void
  priorityFilter: string
  onPriorityChange: (v: string | null) => void
  statusFilter: string
  onStatusChange: (v: string | null) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <Select value={assigneeFilter} onValueChange={onAssigneeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Responsáveis</SelectItem>
            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
            <SelectItem value="Mike Chen">Mike Chen</SelectItem>
            <SelectItem value="Emily Davis">Emily Davis</SelectItem>
            <SelectItem value="David Kim">David Kim</SelectItem>
            <SelectItem value="Lisa Park">Lisa Park</SelectItem>
            <SelectItem value="Tom Wright">Tom Wright</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Prioridades</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="todo">A Fazer</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="review">Revisão</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ─── Kanban Card ───────────────────────────────────────────────────

function KanbanCard({ task }: { task: TaskRow }) {
  const pCfg = priorityConfig[task.priority]
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="space-y-3 p-3.5">
        <p className="text-sm font-medium leading-snug text-foreground">
          {task.title}
        </p>

        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              <Tag size={8} />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${pCfg.dot}`} />
            <span className="text-[10px] font-medium text-muted-foreground capitalize">
              {task.priority}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar size={9} />
            {task.dueDate}
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border/40 pt-2.5">
          <Avatar size="sm" className="!size-5">
            <AvatarFallback className="text-[8px]">{task.assigneeInitials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ──────────────────────────────────────────────────────────

export default function TasksPage() {
  const [view, setView] = useState("list")
  const [search, setSearch] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockTasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    if (assigneeFilter !== "all" && t.assignee !== assigneeFilter) return false
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    return true
  })

  const todoCount = mockTasks.filter((t) => t.status === "todo").length
  const inProgressCount = mockTasks.filter((t) => t.status === "in_progress").length
  const doneToday = mockTasks.filter((t) => t.status === "done").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tarefas"
        description="Gerencie e acompanhe as tarefas da equipe"
        action={
          <Button>
            <Plus size={16} data-icon="inline-start" />
            Nova Tarefa
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Tarefas"
          value={45}
          icon={ListChecks}
          trend={{ value: 12, direction: "up" }}
          description="vs mês passado"
        />
        <StatCard
          label="A Fazer"
          value={todoCount}
          icon={Clock}
          description="aguardando início"
        />
        <StatCard
          label="Em Andamento"
          value={inProgressCount}
          icon={AlertTriangle}
          trend={{ value: 5, direction: "up" }}
          description="tarefas ativas"
        />
        <StatCard
          label="Concluídas Hoje"
          value={doneToday}
          icon={CheckCircle2}
          trend={{ value: 18, direction: "up" }}
          description="tarefas finalizadas"
        />
      </div>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="list">
            <List size={14} />
            Lista
          </TabsTrigger>
          <TabsTrigger value="board">
            <LayoutGrid size={14} />
            Quadro
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            assigneeFilter={assigneeFilter}
            onAssigneeChange={(v) => setAssigneeFilter(v ?? "all")}
            priorityFilter={priorityFilter}
            onPriorityChange={(v) => setPriorityFilter(v ?? "all")}
            statusFilter={statusFilter}
            onStatusChange={(v) => setStatusFilter(v ?? "all")}
          />
          <DataTable
            columns={columns}
            data={filtered}
            searchKey="title"
            searchPlaceholder="Buscar tarefas..."
          />
        </TabsContent>

        {/* Board / Kanban View */}
        <TabsContent value="board" className="space-y-4">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            assigneeFilter={assigneeFilter}
            onAssigneeChange={(v) => setAssigneeFilter(v ?? "all")}
            priorityFilter={priorityFilter}
            onPriorityChange={(v) => setPriorityFilter(v ?? "all")}
            statusFilter={statusFilter}
            onStatusChange={(v) => setStatusFilter(v ?? "all")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kanbanColumns.map((col) => {
              const tasks = filtered.filter((t) => t.status === col.key)
              return (
                <div key={col.key} className="flex flex-col gap-3">
                  {/* Column Header */}
                  <div
                    className={`rounded-lg border border-border/60 border-t-2 ${col.accent} bg-muted/20 p-3`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {col.label}
                      </h3>
                      <Badge variant="secondary" className="h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[10px]">
                        {tasks.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="flex flex-col gap-2.5">
                    {tasks.length === 0 ? (
                      <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 py-8 text-xs text-muted-foreground">
                        Sem tarefas
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <KanbanCard key={task.id} task={task} />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
