"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  XCircle,
  Clock,
  Pill,
  Activity,
  CheckCircle2,
  Info,
  Sun,
  Sunset,
  Moon,
  CloudMoon,
  TrendingUp,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ─── Types ────────────────────────────────────────────────────────

interface MedicationRow {
  id: string
  member: string
  medication: string
  dosage: string
  frequency: string
  route: string
  prescriber: string
  status: "active" | "paused" | "discontinued"
  lastAdmin: string
}

interface ScheduleSlot {
  id: string
  time: string
  member: string
  medication: string
  dosage: string
  status: "due" | "given" | "upcoming"
}

interface LogEntry {
  id: string
  dateTime: string
  member: string
  medication: string
  administeredBy: string
  status: "given" | "refused" | "missed"
  notes: string
}

// ─── Mock Data ────────────────────────────────────────────────────

const mockMedications: MedicationRow[] = [
  { id: "med1", member: "James Wilson", medication: "Lisinopril", dosage: "10mg", frequency: "Once daily", route: "Oral", prescriber: "Dr. Sarah Mitchell", status: "active", lastAdmin: "Today 08:00" },
  { id: "med2", member: "James Wilson", medication: "Metformin", dosage: "500mg", frequency: "Twice daily", route: "Oral", prescriber: "Dr. Sarah Mitchell", status: "active", lastAdmin: "Today 08:00" },
  { id: "med3", member: "Maria Garcia", medication: "Omeprazole", dosage: "20mg", frequency: "Once daily", route: "Oral", prescriber: "Dr. James Patel", status: "active", lastAdmin: "Today 07:30" },
  { id: "med4", member: "Robert Brown", medication: "Amlodipine", dosage: "5mg", frequency: "Once daily", route: "Oral", prescriber: "Dr. Sarah Mitchell", status: "active", lastAdmin: "Today 09:00" },
  { id: "med5", member: "Robert Brown", medication: "Simvastatin", dosage: "40mg", frequency: "At bedtime", route: "Oral", prescriber: "Dr. James Patel", status: "active", lastAdmin: "Yesterday 22:00" },
  { id: "med6", member: "Anna Lee", medication: "Sertraline", dosage: "50mg", frequency: "Once daily", route: "Oral", prescriber: "Dr. Emily Ross", status: "paused", lastAdmin: "Apr 5, 08:30" },
  { id: "med7", member: "John Taylor", medication: "Ibuprofen", dosage: "400mg", frequency: "As needed", route: "Oral", prescriber: "Dr. James Patel", status: "discontinued", lastAdmin: "Apr 4, 14:00" },
  { id: "med8", member: "Emily Chen", medication: "Fluoxetine", dosage: "20mg", frequency: "Once daily", route: "Oral", prescriber: "Dr. Emily Ross", status: "active", lastAdmin: "Today 07:45" },
  { id: "med9", member: "Michael Davis", medication: "Paracetamol", dosage: "1g", frequency: "Four times daily", route: "Oral", prescriber: "Dr. Sarah Mitchell", status: "active", lastAdmin: "Today 12:00" },
  { id: "med10", member: "David Kim", medication: "Atorvastatin", dosage: "20mg", frequency: "At bedtime", route: "Oral", prescriber: "Dr. James Patel", status: "active", lastAdmin: "Yesterday 22:30" },
]

const morningSchedule: ScheduleSlot[] = [
  { id: "s1", time: "07:00", member: "Maria Garcia", medication: "Omeprazole 20mg", dosage: "20mg", status: "given" },
  { id: "s2", time: "08:00", member: "James Wilson", medication: "Lisinopril 10mg", dosage: "10mg", status: "given" },
  { id: "s3", time: "08:00", member: "James Wilson", medication: "Metformin 500mg", dosage: "500mg", status: "given" },
  { id: "s4", time: "08:00", member: "Emily Chen", medication: "Fluoxetine 20mg", dosage: "20mg", status: "given" },
  { id: "s5", time: "09:00", member: "Robert Brown", medication: "Amlodipine 5mg", dosage: "5mg", status: "given" },
]

const afternoonSchedule: ScheduleSlot[] = [
  { id: "s6", time: "12:00", member: "Michael Davis", medication: "Paracetamol 1g", dosage: "1g", status: "given" },
  { id: "s7", time: "14:00", member: "James Wilson", medication: "Metformin 500mg", dosage: "500mg", status: "due" },
  { id: "s8", time: "14:00", member: "Michael Davis", medication: "Paracetamol 1g", dosage: "1g", status: "due" },
]

const eveningSchedule: ScheduleSlot[] = [
  { id: "s9", time: "18:00", member: "Michael Davis", medication: "Paracetamol 1g", dosage: "1g", status: "upcoming" },
]

const nightSchedule: ScheduleSlot[] = [
  { id: "s10", time: "22:00", member: "Robert Brown", medication: "Simvastatin 40mg", dosage: "40mg", status: "upcoming" },
  { id: "s11", time: "22:00", member: "David Kim", medication: "Atorvastatin 20mg", dosage: "20mg", status: "upcoming" },
  { id: "s12", time: "22:00", member: "Michael Davis", medication: "Paracetamol 1g", dosage: "1g", status: "upcoming" },
]

const logEntries: LogEntry[] = [
  { id: "l1", dateTime: "Apr 6, 12:00", member: "Michael Davis", medication: "Paracetamol 1g", administeredBy: "Nurse Sarah", status: "given", notes: "Taken with food" },
  { id: "l2", dateTime: "Apr 6, 09:00", member: "Robert Brown", medication: "Amlodipine 5mg", administeredBy: "Nurse Sarah", status: "given", notes: "" },
  { id: "l3", dateTime: "Apr 6, 08:30", member: "Anna Lee", medication: "Sertraline 50mg", administeredBy: "Nurse Tom", status: "refused", notes: "Member feeling nauseous, GP notified" },
  { id: "l4", dateTime: "Apr 6, 08:00", member: "James Wilson", medication: "Lisinopril 10mg", administeredBy: "Nurse Sarah", status: "given", notes: "BP checked before admin: 128/82" },
  { id: "l5", dateTime: "Apr 6, 08:00", member: "James Wilson", medication: "Metformin 500mg", administeredBy: "Nurse Sarah", status: "given", notes: "Taken with breakfast" },
  { id: "l6", dateTime: "Apr 6, 07:45", member: "Emily Chen", medication: "Fluoxetine 20mg", administeredBy: "Nurse Tom", status: "given", notes: "" },
  { id: "l7", dateTime: "Apr 6, 07:30", member: "Maria Garcia", medication: "Omeprazole 20mg", administeredBy: "Nurse Sarah", status: "given", notes: "30 min before breakfast" },
  { id: "l8", dateTime: "Apr 5, 22:30", member: "David Kim", medication: "Atorvastatin 20mg", administeredBy: "Nurse Tom", status: "given", notes: "" },
  { id: "l9", dateTime: "Apr 5, 22:00", member: "Robert Brown", medication: "Simvastatin 40mg", administeredBy: "Nurse Tom", status: "given", notes: "" },
  { id: "l10", dateTime: "Apr 5, 18:00", member: "Michael Davis", medication: "Paracetamol 1g", administeredBy: "Nurse Sarah", status: "missed", notes: "Member was at appointment, admin delayed to 19:00" },
]

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  paused: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  discontinued: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  active: "Ativa",
  paused: "Pausada",
  discontinued: "Descontinuada",
}

const logStatusStyles: Record<string, string> = {
  given: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  refused: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  missed: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
}

const logStatusLabels: Record<string, string> = {
  given: "Administrada",
  refused: "Recusada",
  missed: "Perdida",
}

const scheduleSlotStyles: Record<string, string> = {
  given: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20",
  due: "border-orange-200 bg-orange-50/50 dark:border-orange-900/40 dark:bg-orange-950/20",
  upcoming: "border-border/40 bg-card",
}

// ─── Active Tab Columns ───────────────────────────────────────────

const activeColumns: ColumnDef<MedicationRow, unknown>[] = [
  {
    accessorKey: "member",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => <span className="font-medium">{row.original.member}</span>,
  },
  {
    accessorKey: "medication",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medicação" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.medication}</span>
        <span className="ml-1.5 text-muted-foreground">{row.original.dosage}</span>
      </div>
    ),
  },
  {
    accessorKey: "frequency",
    header: "Frequência",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.frequency}</span>,
  },
  {
    accessorKey: "route",
    header: "Via",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.route}</span>,
  },
  {
    accessorKey: "prescriber",
    header: "Prescritor",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.prescriber}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status
      return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[s]}`}>
          {statusLabels[s] || s}
        </span>
      )
    },
  },
  {
    accessorKey: "lastAdmin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Última Admin." />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.lastAdmin}</span>,
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
          <DropdownMenuItem><Eye size={14} /> Ver Detalhes</DropdownMenuItem>
          <DropdownMenuItem><Edit size={14} /> Editar</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive"><Trash2 size={14} /> Remover</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Log Tab Columns ──────────────────────────────────────────────

const logColumns: ColumnDef<LogEntry, unknown>[] = [
  {
    accessorKey: "dateTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data e Hora" />,
    cell: ({ row }) => <span className="whitespace-nowrap font-medium">{row.original.dateTime}</span>,
  },
  {
    accessorKey: "member",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => <span className="font-medium">{row.original.member}</span>,
  },
  {
    accessorKey: "medication",
    header: "Medicação",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.medication}</span>,
  },
  {
    accessorKey: "administeredBy",
    header: "Administrado Por",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.administeredBy}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status
      return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${logStatusStyles[s]}`}>
          {logStatusLabels[s] || s}
        </span>
      )
    },
  },
  {
    accessorKey: "notes",
    header: "Observações",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-xs text-muted-foreground">
        {row.original.notes || "—"}
      </span>
    ),
  },
]

// ─── Schedule Slot Component ──────────────────────────────────────

function ScheduleTimeSlot({
  label,
  icon: Icon,
  slots,
}: {
  label: string
  icon: React.ElementType
  slots: ScheduleSlot[]
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        <Badge variant="outline" className="text-[10px]">
          {slots.length}
        </Badge>
      </div>
      <div className="space-y-1.5 pl-6">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${scheduleSlotStyles[slot.status]}`}
          >
            <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">
              {slot.time}
            </span>
            <span className="text-sm font-medium text-foreground">{slot.member}</span>
            <span className="text-sm text-muted-foreground">{slot.medication}</span>
            <span className="ml-auto">
              {slot.status === "given" && (
                <CheckCircle2 size={14} className="text-emerald-500" />
              )}
              {slot.status === "due" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                  <Clock size={10} /> Pendente
                </span>
              )}
              {slot.status === "upcoming" && (
                <span className="text-[11px] text-muted-foreground">Próxima</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicações"
        description="Gerencie medicações, cronogramas e registros de administração"
        action={
          <Button>
            <Plus size={16} />
            Nova Medicação
          </Button>
        }
      />

      {/* Alert Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-red-200/60 dark:border-red-900/40">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">3 medicações estão pendentes agora</p>
              <p className="text-xs text-muted-foreground">Ronda da tarde precisa de atenção</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Ver
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-200/60 dark:border-amber-900/40">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <XCircle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">1 medicação foi recusada hoje</p>
              <p className="text-xs text-muted-foreground">Anna Lee - Sertralina às 08:30</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Detalhes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200/60 dark:border-blue-900/40">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Info size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">2 medicações precisam de renovação</p>
              <p className="text-xs text-muted-foreground">Receitas vencendo em 7 dias</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Revisar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Medicações Ativas"
          value={89}
          icon={Pill}
          trend={{ value: 3, direction: "up" }}
          description="em todos os atendidos"
        />
        <StatCard
          label="Administradas Hoje"
          value={42}
          icon={Activity}
          trend={{ value: 8, direction: "up" }}
          description="desde meia-noite"
        />
        <StatCard
          label="Pendentes Agora"
          value={3}
          icon={Clock}
          description="ronda da tarde"
        />
        <StatCard
          label="Taxa de Adesão"
          value="97%"
          icon={TrendingUp}
          trend={{ value: 2, direction: "up" }}
          description="este mês"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
          <TabsTrigger value="log">Histórico</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        {/* Active Tab */}
        <TabsContent value="active">
          <DataTable
            columns={activeColumns}
            data={mockMedications.filter((m) => m.status === "active")}
            searchKey="member"
            searchPlaceholder="Buscar por atendido..."
          />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cronograma de Medicações de Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScheduleTimeSlot label="Manhã (06:00 - 12:00)" icon={Sun} slots={morningSchedule} />
              <ScheduleTimeSlot label="Tarde (12:00 - 18:00)" icon={Sunset} slots={afternoonSchedule} />
              <ScheduleTimeSlot label="Noite (18:00 - 22:00)" icon={Moon} slots={eveningSchedule} />
              <ScheduleTimeSlot label="Madrugada (22:00 - 06:00)" icon={CloudMoon} slots={nightSchedule} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Log Tab */}
        <TabsContent value="log">
          <DataTable
            columns={logColumns}
            data={logEntries}
            searchKey="member"
            searchPlaceholder="Buscar registros..."
          />
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all">
          <DataTable
            columns={activeColumns}
            data={mockMedications}
            searchKey="member"
            searchPlaceholder="Buscar todas as medicações..."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
