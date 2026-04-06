"use client"

import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  List,
  CalendarDays,
  Car,
  Check,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Stethoscope,
  Brain,
  Users,
  Bus,
  ClipboardCheck,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// ─── Types ─────────────────────────────────────────────────────────

type AppointmentType = "Médico" | "Terapia" | "Social" | "Transporte" | "Avaliação"
type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled"

interface AppointmentRow {
  id: string
  member: string
  memberInitials: string
  type: AppointmentType
  title: string
  date: string
  day: number
  time: string
  location: string
  staff: string
  transport: boolean
  status: AppointmentStatus
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockAppointments: AppointmentRow[] = [
  { id: "ap1", member: "James Wilson", memberInitials: "JW", type: "Médico", title: "GP Follow-up Visit", date: "Apr 6, 2026", day: 6, time: "09:00 AM", location: "City Hospital", staff: "Dr. Smith", transport: true, status: "confirmed" },
  { id: "ap2", member: "Maria Garcia", memberInitials: "MG", type: "Terapia", title: "Physiotherapy Session", date: "Apr 6, 2026", day: 6, time: "10:30 AM", location: "Main Care Center", staff: "Lisa Park", transport: false, status: "confirmed" },
  { id: "ap3", member: "Robert Brown", memberInitials: "RB", type: "Social", title: "Community Group Activity", date: "Apr 7, 2026", day: 7, time: "02:00 PM", location: "Community Hall", staff: "Emily Davis", transport: false, status: "scheduled" },
  { id: "ap4", member: "Anna Lee", memberInitials: "AL", type: "Médico", title: "Blood Test & Lab Work", date: "Apr 8, 2026", day: 8, time: "11:00 AM", location: "Health Clinic", staff: "Dr. Patel", transport: true, status: "scheduled" },
  { id: "ap5", member: "John Taylor", memberInitials: "JT", type: "Transporte", title: "Home to Clinic Transfer", date: "Apr 8, 2026", day: 8, time: "08:30 AM", location: "Home Pickup", staff: "Tom Wright", transport: true, status: "scheduled" },
  { id: "ap6", member: "Emily Chen", memberInitials: "EC", type: "Terapia", title: "Occupational Therapy", date: "Apr 9, 2026", day: 9, time: "03:00 PM", location: "Main Care Center", staff: "Lisa Park", transport: false, status: "scheduled" },
  { id: "ap7", member: "Michael Davis", memberInitials: "MD", type: "Avaliação", title: "Annual Care Assessment", date: "Apr 6, 2026", day: 6, time: "01:00 PM", location: "Main Care Center", staff: "Sarah Johnson", transport: false, status: "confirmed" },
  { id: "ap8", member: "Sophie Martin", memberInitials: "SM", type: "Médico", title: "Specialist Consultation", date: "Apr 10, 2026", day: 10, time: "09:30 AM", location: "City Hospital", staff: "Dr. Smith", transport: true, status: "scheduled" },
  { id: "ap9", member: "David Kim", memberInitials: "DK", type: "Social", title: "Art Therapy Workshop", date: "Apr 3, 2026", day: 3, time: "01:00 PM", location: "Community Hall", staff: "Emily Davis", transport: false, status: "completed" },
  { id: "ap10", member: "Grace Williams", memberInitials: "GW", type: "Transporte", title: "Return from Hospital", date: "Apr 2, 2026", day: 2, time: "04:00 PM", location: "City Hospital", staff: "Tom Wright", transport: true, status: "cancelled" },
]

// ─── Style Maps ───────────────────────────────────────────────────

const typeConfig: Record<AppointmentType, { icon: typeof Stethoscope; className: string }> = {
  "Médico": { icon: Stethoscope, className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  "Terapia": { icon: Brain, className: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
  Social: { icon: Users, className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  "Transporte": { icon: Bus, className: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  "Avaliação": { icon: ClipboardCheck, className: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400" },
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  scheduled: { label: "Agendado", className: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400" },
  confirmed: { label: "Confirmado", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  completed: { label: "Concluído", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  cancelled: { label: "Cancelado", className: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
}

// ─── Calendar Component ───────────────────────────────────────────

function MonthlyCalendar({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: number | null
  onSelectDay: (day: number) => void
}) {
  const today = 6
  const daysInMonth = 30
  // Abril 2026 starts on Wednesday (index 3 in Sun-based week)
  const startOffset = 3
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const appointmentDaySet = useMemo(
    () => new Set(mockAppointments.map((a) => a.day)),
    []
  )

  return (
    <div className="space-y-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon-xs">
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-sm font-semibold text-foreground">Abril 2026</h3>
        <Button variant="ghost" size="icon-xs">
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((d) => (
          <div key={d} className="py-1.5 text-center text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}

        {/* Empty offset cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isToday = day === today
          const isSelected = day === selectedDay
          const hasAppointment = appointmentDaySet.has(day)

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all
                ${isToday && !isSelected ? "bg-teal-600 font-bold text-white" : ""}
                ${isSelected ? "bg-teal-100 font-semibold text-teal-800 ring-2 ring-teal-500 dark:bg-teal-950/60 dark:text-teal-300" : ""}
                ${!isToday && !isSelected ? "text-foreground hover:bg-muted" : ""}
              `}
            >
              {day}
              {hasAppointment && !isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-teal-500" />
              )}
              {hasAppointment && (isToday || isSelected) && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current opacity-60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Day Appointments Panel ───────────────────────────────────────

function DayAppointments({ day }: { day: number | null }) {
  const dayAppointments = day
    ? mockAppointments.filter((a) => a.day === day)
    : []

  if (!day) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-12 text-center">
        <CalendarDays size={32} className="text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">
          Selecione um dia para ver os agendamentos
        </p>
      </div>
    )
  }

  if (dayAppointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-12 text-center">
        <CalendarDays size={32} className="text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium text-foreground">April {day}, 2026</p>
        <p className="mt-1 text-xs text-muted-foreground">Nenhum agendamento marcado</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        April {day}, 2026
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? "s" : ""}
        </span>
      </h3>
      {dayAppointments.map((appt) => {
        const tCfg = typeConfig[appt.type]
        const TypeIcon = tCfg.icon
        const sCfg = statusConfig[appt.status]
        return (
          <Card key={appt.id} className="transition-all hover:shadow-sm">
            <CardContent className="flex items-start gap-4 p-4">
              {/* Time Block */}
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-bold text-foreground">{appt.time.split(" ")[0]}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{appt.time.split(" ")[1]}</p>
              </div>

              <div className="h-10 w-px shrink-0 bg-border/60" />

              {/* Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{appt.title}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${tCfg.className}`}>
                    <TypeIcon size={10} />
                    {appt.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User size={11} />
                    {appt.member}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {appt.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${sCfg.className}`}>
                    {sCfg.label}
                  </span>
                  {appt.transport && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                      <Car size={11} />
                      Transporte necessário
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Table Columns ────────────────────────────────────────────────

const columns: ColumnDef<AppointmentRow, unknown>[] = [
  {
    accessorKey: "member",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>{row.original.memberInitials}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">{row.original.member}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      const t = row.original.type
      const cfg = typeConfig[t]
      const Icon = cfg.icon
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
          <Icon size={11} />
          {t}
        </span>
      )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => (
      <span className="text-sm text-foreground">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "time",
    header: "Horário",
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock size={12} />
        {row.original.time}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Local" />,
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin size={12} />
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "staff",
    header: "Profissional",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.staff}</span>
    ),
  },
  {
    accessorKey: "transport",
    header: "Transporte",
    cell: ({ row }) =>
      row.original.transport ? (
        <Badge variant="secondary" className="bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
          <Car size={11} />
          Sim
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">Não</span>
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
          <DropdownMenuItem><Edit size={14} />Editar</DropdownMenuItem>
          <DropdownMenuItem><Check size={14} />Marcar Concluído</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 size={14} />Cancelar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Page ──────────────────────────────────────────────────────────

export default function AppointmentsPage() {
  const [view, setView] = useState("list")
  const [selectedDay, setSelectedDay] = useState<number | null>(6)

  const todayCount = mockAppointments.filter((a) => a.day === 6).length
  const weekCount = mockAppointments.filter((a) => a.day >= 6 && a.day <= 12).length
  const pendingCount = mockAppointments.filter((a) => a.status === "scheduled").length
  const transportCount = mockAppointments.filter((a) => a.transport).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agendamentos e Transportes"
        description="Agende e gerencie consultas, atendimentos e logística de transporte"
        action={
          <Button>
            <Plus size={16} data-icon="inline-start" />
            Novo Agendamento
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Hoje"
          value={todayCount}
          icon={CalendarDays}
          description="agendamentos hoje"
        />
        <StatCard
          label="Esta Semana"
          value={weekCount}
          icon={Clock}
          trend={{ value: 8, direction: "up" }}
          description="vs semana anterior"
        />
        <StatCard
          label="Aguardando Confirmação"
          value={pendingCount}
          icon={AlertCircle}
          description="precisam de confirmação"
        />
        <StatCard
          label="Transporte Necessário"
          value={transportCount}
          icon={Car}
          description="precisam de transporte"
        />
      </div>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="list">
            <List size={14} />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays size={14} />
            Calendário
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list">
          <DataTable
            columns={columns}
            data={mockAppointments}
            searchKey="member"
            searchPlaceholder="Buscar agendamentos..."
          />
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-4">
                <MonthlyCalendar
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              </CardContent>
            </Card>

            {/* Day Panel */}
            <div className="lg:col-span-2">
              <DayAppointments day={selectedDay} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
