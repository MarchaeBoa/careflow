"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  LogIn,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Search,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─── Types ─────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late"

interface AttendanceRow {
  id: string
  member: string
  initials: string
  checkIn: string
  checkOut: string
  duration: string
  staff: string
  location: string
  status: AttendanceStatus
}

interface ChartDay {
  day: string
  present: number
  absent: number
  late: number
}

// ─── Chart Data ────────────────────────────────────────────────────

const chartData: ChartDay[] = [
  { day: "Seg", present: 42, absent: 3, late: 5 },
  { day: "Ter", present: 45, absent: 2, late: 3 },
  { day: "Qua", present: 40, absent: 5, late: 5 },
  { day: "Qui", present: 44, absent: 3, late: 3 },
  { day: "Sex", present: 38, absent: 6, late: 6 },
  { day: "Sáb", present: 20, absent: 2, late: 1 },
  { day: "Dom", present: 46, absent: 2, late: 4 },
]

// ─── Mock Data ─────────────────────────────────────────────────────

const mockAttendance: AttendanceRow[] = [
  { id: "a1", member: "James Wilson", initials: "JW", checkIn: "08:45 AM", checkOut: "04:30 PM", duration: "7h 45m", staff: "Sarah Johnson", status: "present", location: "Main Center" },
  { id: "a2", member: "Maria Garcia", initials: "MG", checkIn: "09:15 AM", checkOut: "03:00 PM", duration: "5h 45m", staff: "Mike Chen", status: "late", location: "East Wing" },
  { id: "a3", member: "Robert Brown", initials: "RB", checkIn: "08:30 AM", checkOut: "04:00 PM", duration: "7h 30m", staff: "Emily Davis", status: "present", location: "Main Center" },
  { id: "a4", member: "Anna Lee", initials: "AL", checkIn: "--:--", checkOut: "--:--", duration: "--", staff: "--", status: "absent", location: "West Campus" },
  { id: "a5", member: "John Taylor", initials: "JT", checkIn: "08:50 AM", checkOut: "02:30 PM", duration: "5h 40m", staff: "Lisa Park", status: "present", location: "Main Center" },
  { id: "a6", member: "Emily Chen", initials: "EC", checkIn: "09:30 AM", checkOut: "04:15 PM", duration: "6h 45m", staff: "Tom Wright", status: "late", location: "East Wing" },
  { id: "a7", member: "Michael Davis", initials: "MD", checkIn: "08:35 AM", checkOut: "04:00 PM", duration: "7h 25m", staff: "Sarah Johnson", status: "present", location: "West Campus" },
  { id: "a8", member: "Sophie Martin", initials: "SM", checkIn: "--:--", checkOut: "--:--", duration: "--", staff: "--", status: "absent", location: "Main Center" },
  { id: "a9", member: "David Kim", initials: "DK", checkIn: "08:40 AM", checkOut: "03:45 PM", duration: "7h 05m", staff: "Mike Chen", status: "present", location: "East Wing" },
  { id: "a10", member: "Lisa Park", initials: "LP", checkIn: "08:55 AM", checkOut: "04:30 PM", duration: "7h 35m", staff: "Emily Davis", status: "present", location: "West Campus" },
  { id: "a11", member: "Thomas Wright", initials: "TW", checkIn: "09:05 AM", checkOut: "03:30 PM", duration: "6h 25m", staff: "Sarah Johnson", status: "late", location: "Main Center" },
  { id: "a12", member: "Patricia Nguyen", initials: "PN", checkIn: "08:32 AM", checkOut: "04:10 PM", duration: "7h 38m", staff: "Tom Wright", status: "present", location: "East Wing" },
]

// ─── Status display ────────────────────────────────────────────────

const statusDot: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-amber-500",
}

const statusLabel: Record<AttendanceStatus, string> = {
  present: "Presente",
  absent: "Ausente",
  late: "Atrasado",
}

// ─── Columns ───────────────────────────────────────────────────────

const columns: ColumnDef<AttendanceRow, unknown>[] = [
  {
    accessorKey: "member",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Atendido" />,
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.member}</span>,
  },
  {
    accessorKey: "checkIn",
    header: "Entrada",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">{row.original.checkIn}</span>
    ),
  },
  {
    accessorKey: "checkOut",
    header: "Saída",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">{row.original.checkOut}</span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">{row.original.duration}</span>
    ),
  },
  {
    accessorKey: "staff",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsável" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.staff}</span>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unidade" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status
      return (
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDot[s]}`} />
          <span className="text-sm font-medium">{statusLabel[s]}</span>
        </div>
      )
    },
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
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem><Eye size={14} className="mr-2" />Ver</DropdownMenuItem>
          <DropdownMenuItem><Edit size={14} className="mr-2" />Editar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ─── Page ──────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().split("T")[0])
  const [locationFilter, setLocationFilter] = useState("all")
  const [staffFilter, setStaffFilter] = useState("all")

  const todayStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const present = mockAttendance.filter((a) => a.status === "present").length
  const absent = mockAttendance.filter((a) => a.status === "absent").length
  const late = mockAttendance.filter((a) => a.status === "late").length
  const total = mockAttendance.length
  const rate = Math.round(((present + late) / total) * 100)

  const staffList = [...new Set(mockAttendance.map((a) => a.staff).filter((s) => s !== "--"))]

  const filtered = mockAttendance.filter((a) => {
    if (locationFilter !== "all" && a.location !== locationFilter) return false
    if (staffFilter !== "all" && a.staff !== staffFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Presença"
        description={todayStr}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download size={16} className="mr-1.5" />
              Exportar
            </Button>
            <Button>
              <LogIn size={16} className="mr-1.5" />
              Registrar Entrada
            </Button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Presentes" value={present} icon={CheckCircle2} trend={{ value: 4, direction: "up" }} description="vs ontem" />
        <StatCard label="Ausentes" value={absent} icon={XCircle} trend={{ value: 2, direction: "down" }} description="vs ontem" />
        <StatCard label="Atrasados" value={late} icon={Clock} description="Chegadas após 09:00" />
        <StatCard label="Taxa de Presença" value={`${rate}%`} icon={TrendingUp} trend={{ value: 1.5, direction: "up" }} description="vs semana passada" />
      </div>

      {/* Chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Últimos 7 Dias</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Presentes" />
            <Bar dataKey="late" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Atrasados" />
            <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Ausentes" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
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
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos Responsáveis</option>
          {staffList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="member"
        searchPlaceholder="Buscar presença..."
      />
    </div>
  )
}
