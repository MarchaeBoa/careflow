"use client"

import { useState } from "react"
import {
  Users,
  CalendarCheck,
  FileText,
  ShieldCheck,
  UserPlus,
  FilePlus,
  LogIn,
  ListTodo,
  CalendarPlus,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pill,
  X,
  ArrowUpRight,
  Activity,
  ChevronRight,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { useAuthContext } from "@/components/auth/auth-provider"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// ─── Helpers ──────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

function formatToday(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ─── Chart Tooltip Styles ─────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}

// ─── Mock Data ────────────────────────────────────────────────────

const attendanceTrend = [
  { day: "Mar 24", value: 82 },
  { day: "Mar 25", value: 86 },
  { day: "Mar 26", value: 91 },
  { day: "Mar 27", value: 88 },
  { day: "Mar 28", value: 93 },
  { day: "Mar 29", value: 79 },
  { day: "Mar 30", value: 84 },
  { day: "Mar 31", value: 87 },
  { day: "Apr 1", value: 90 },
  { day: "Apr 2", value: 92 },
  { day: "Apr 3", value: 85 },
  { day: "Apr 4", value: 94 },
  { day: "Apr 5", value: 88 },
  { day: "Apr 6", value: 89 },
]

const notesOverview = [
  { day: "Seg", completed: 12, pending: 5, draft: 3 },
  { day: "Ter", completed: 15, pending: 4, draft: 2 },
  { day: "Qua", completed: 10, pending: 7, draft: 4 },
  { day: "Qui", completed: 18, pending: 3, draft: 1 },
  { day: "Sex", completed: 14, pending: 6, draft: 5 },
  { day: "Sáb", completed: 8, pending: 2, draft: 1 },
  { day: "Dom", completed: 6, pending: 3, draft: 2 },
]

const recentNotes = [
  {
    id: 1,
    author: "Sarah Johnson",
    authorInitials: "SJ",
    member: "James Wilson",
    excerpt: "Verificação diária de bem-estar concluída. Atendido relatou melhora na mobilidade após sessão de fisioterapia...",
    status: "approved",
    timeAgo: "12 min atrás",
  },
  {
    id: 2,
    author: "Mike Chen",
    authorInitials: "MC",
    member: "Maria Garcia",
    excerpt: "Revisão de medicação realizada com Dr. Patel. Dosagem ajustada para medicação de pressão arterial...",
    status: "pending",
    timeAgo: "34 min atrás",
  },
  {
    id: 3,
    author: "Emily Davis",
    authorInitials: "ED",
    member: "Robert Brown",
    excerpt: "Nota de observação comportamental: Atendido participou positivamente das atividades em grupo esta manhã...",
    status: "approved",
    timeAgo: "1 hora atrás",
  },
  {
    id: 4,
    author: "David Kim",
    authorInitials: "DK",
    member: "Anna Lee",
    excerpt: "Revisão de progresso do plano de vida. Atendida expressou interesse em programa de voluntariado...",
    status: "draft",
    timeAgo: "2 horas atrás",
  },
  {
    id: 5,
    author: "Lisa Park",
    authorInitials: "LP",
    member: "John Taylor",
    excerpt: "Nota de coordenação de transporte: Veículo acessível agendado para consulta em 9 de abril...",
    status: "pending",
    timeAgo: "3 horas atrás",
  },
  {
    id: 6,
    author: "Tom Wright",
    authorInitials: "TW",
    member: "Patricia Moore",
    excerpt: "Atualização de avaliação nutricional. Nutricionista recomendou aumento de proteína e atualizou plano alimentar...",
    status: "approved",
    timeAgo: "4 horas atrás",
  },
]

const medicationAlerts = [
  { id: 1, member: "James Wilson", medication: "Lisinopril 10mg", time: "08:00", status: "administered" },
  { id: 2, member: "Maria Garcia", medication: "Metformin 500mg", time: "09:00", status: "due" },
  { id: 3, member: "Robert Brown", medication: "Sertraline 50mg", time: "09:00", status: "due" },
  { id: 4, member: "Anna Lee", medication: "Omeprazole 20mg", time: "08:30", status: "refused" },
]

const todayAttendance = [
  { id: 1, member: "James Wilson", initials: "JW", time: "07:45 AM", status: "present", staff: "Mike Chen" },
  { id: 2, member: "Maria Garcia", initials: "MG", time: "08:02 AM", status: "present", staff: "Sarah Johnson" },
  { id: 3, member: "Robert Brown", initials: "RB", time: "08:15 AM", status: "late", staff: "Emily Davis" },
  { id: 4, member: "Anna Lee", initials: "AL", time: "07:55 AM", status: "present", staff: "David Kim" },
  { id: 5, member: "John Taylor", initials: "JT", time: "--:--", status: "absent", staff: "--" },
  { id: 6, member: "Patricia Moore", initials: "PM", time: "08:00 AM", status: "present", staff: "Lisa Park" },
  { id: 7, member: "David Harris", initials: "DH", time: "08:22 AM", status: "late", staff: "Tom Wright" },
  { id: 8, member: "Susan Clark", initials: "SC", time: "07:50 AM", status: "present", staff: "Mike Chen" },
]

const upcomingSchedule = [
  { id: 1, member: "James Wilson", type: "Médico", date: "Abr 7", time: "09:00" },
  { id: 2, member: "Maria Garcia", type: "Terapia", date: "Abr 7", time: "10:30" },
  { id: 3, member: "Robert Brown", type: "Social", date: "Abr 8", time: "14:00" },
  { id: 4, member: "Anna Lee", type: "Transporte", date: "Abr 9", time: "08:30" },
  { id: 5, member: "John Taylor", type: "Médico", date: "Abr 9", time: "11:00" },
]

const quickActions = [
  {
    label: "Novo Atendido",
    description: "Cadastrar novo atendido",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    border: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  {
    label: "Nova Nota",
    description: "Criar nota de atendimento",
    icon: FilePlus,
    color: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    border: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    label: "Registrar Presença",
    description: "Marcar presença",
    icon: LogIn,
    color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    border: "hover:border-green-300 dark:hover:border-green-700",
  },
  {
    label: "Nova Tarefa",
    description: "Atribuir tarefa à equipe",
    icon: ListTodo,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    border: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  {
    label: "Agendar",
    description: "Reservar horário",
    icon: CalendarPlus,
    color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    border: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  {
    label: "Gerar Relatório",
    description: "Exportar dados e insights",
    icon: BarChart3,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    border: "hover:border-rose-300 dark:hover:border-rose-700",
  },
]

const teamActivity = [
  { id: 1, user: "Sarah Johnson", initials: "SJ", action: "criou uma nota de atendimento para James Wilson", time: "12 min atrás", type: "note" },
  { id: 2, user: "Mike Chen", initials: "MC", action: "registrou presença de Maria Garcia no Centro Principal", time: "28 min atrás", type: "checkin" },
  { id: 3, user: "Emily Davis", initials: "ED", action: "administrou medicação para Robert Brown", time: "45 min atrás", type: "medication" },
  { id: 4, user: "David Kim", initials: "DK", action: "concluiu tarefa: Atualizar treinamento de segurança contra incêndio", time: "1 hora atrás", type: "task" },
  { id: 5, user: "Lisa Park", initials: "LP", action: "gerou relatório mensal de compliance", time: "1,5 hora atrás", type: "report" },
  { id: 6, user: "Tom Wright", initials: "TW", action: "criou uma nota de atendimento para Patricia Moore", time: "2 horas atrás", type: "note" },
  { id: 7, user: "Sarah Johnson", initials: "SJ", action: "registrou presença de John Taylor no Programa Diurno", time: "2,5 horas atrás", type: "checkin" },
  { id: 8, user: "Mike Chen", initials: "MC", action: "administrou medicação para 4 atendidos", time: "3 horas atrás", type: "medication" },
  { id: 9, user: "Emily Davis", initials: "ED", action: "concluiu tarefa: Revisar planos de cuidado Q1", time: "4 horas atrás", type: "task" },
  { id: 10, user: "David Kim", initials: "DK", action: "gerou relatório resumo de incidentes", time: "5 horas atrás", type: "report" },
]

// ─── Color Maps ───────────────────────────────────────────────────

const noteStatusBadge: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  draft: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950/40 dark:text-slate-400 dark:border-slate-700",
  rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
}

const medStatusColor: Record<string, string> = {
  due: "text-amber-600 dark:text-amber-400",
  administered: "text-emerald-600 dark:text-emerald-400",
  refused: "text-red-600 dark:text-red-400",
}

const medStatusDot: Record<string, string> = {
  due: "bg-amber-500",
  administered: "bg-emerald-500",
  refused: "bg-red-500",
}

const attendanceStatusDot: Record<string, string> = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-amber-500",
}

const typeBadge: Record<string, string> = {
  "Médico": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  "Terapia": "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Social: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "Transporte": "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
}

const activityIcon: Record<string, string> = {
  note: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  checkin: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  medication: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  task: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  report: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
}

// ─── Page ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [showComplianceAlert, setShowComplianceAlert] = useState(true)
  const { profile } = useAuthContext()
  const firstName = profile?.full_name?.split(" ")[0] ?? "Usuário"

  return (
    <div className="space-y-6">
      {/* ── 1. Welcome Header ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatToday()}</p>
        </div>
        <Button className="bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
          <BarChart3 className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      {/* ── 2. KPI Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Atendidos"
          value="1.247"
          icon={Users}
          trend={{ value: 12, direction: "up" }}
          description="vs mês passado"
        />
        <StatCard
          label="Presença Hoje"
          value="89%"
          icon={CalendarCheck}
          trend={{ value: 3, direction: "up" }}
          description="vs ontem"
        />
        <StatCard
          label="Notas Pendentes"
          value="23"
          icon={FileText}
          trend={{ value: 8, direction: "down" }}
          description="vs semana passada"
        />
        <StatCard
          label="Score de Compliance"
          value="94%"
          icon={ShieldCheck}
          trend={{ value: 2, direction: "up" }}
          description="vs mês passado"
        />
      </div>

      {/* ── 3. Compliance Alert Banner ─────────────────────────── */}
      {showComplianceAlert && (
        <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  3 itens de compliance precisam de atenção
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  2 certificações de treinamento vencidas e 1 relatório de incidente pendente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
              >
                Revisar
              </Button>
              <button
                onClick={() => setShowComplianceAlert(false)}
                className="rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 4. Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Attendance Trend */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Tendência de Presença</CardTitle>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
              Últimos 14 dias
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[70, 100]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, "Presença"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    fill="url(#attendanceGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#14b8a6", strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Notes Overview - Stacked Bar */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Visão Geral de Notas</CardTitle>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
              Esta semana
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notesOverview} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs capitalize text-muted-foreground">{value}</span>
                    )}
                  />
                  <Bar dataKey="completed" stackId="notes" fill="#14b8a6" radius={[0, 0, 0, 0]} name="Concluídas" />
                  <Bar dataKey="pending" stackId="notes" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Pendentes" />
                  <Bar dataKey="draft" stackId="notes" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Rascunho" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 5. Middle Row: Recent Notes + Medication Alerts ───── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Notes */}
        <Card className="lg:col-span-2 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Notas Recentes</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Ver Tudo <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                    {note.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{note.author}</span>
                    <span className="text-xs text-muted-foreground">para</span>
                    <span className="text-sm font-medium text-foreground">{note.member}</span>
                    <Badge
                      variant="outline"
                      className={`ml-auto shrink-0 text-[10px] capitalize ${noteStatusBadge[note.status] || ""}`}
                    >
                      {note.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{note.excerpt}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                    <Clock className="h-3 w-3" />
                    {note.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medication Alerts */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Pill className="h-4 w-4 text-teal-500" />
              Alertas de Medicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {/* Summary */}
            <div className="space-y-2 rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">3 medicações pendentes agora</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">1 medicação recusada hoje</span>
              </div>
            </div>

            {/* Med List */}
            <div className="space-y-3">
              {medicationAlerts.map((med) => (
                <div key={med.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{med.member}</p>
                    <p className="text-xs text-muted-foreground">{med.medication}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-xs text-muted-foreground">{med.time}</span>
                    <div className={`h-2 w-2 rounded-full ${medStatusDot[med.status]}`} />
                    <span className={`text-xs font-medium capitalize ${medStatusColor[med.status]}`}>
                      {med.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" className="w-full text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/30">
              Ver Todas Medicações <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── 6. Bottom Row: Attendance + Schedule ───────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Today's Attendance */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Presença de Hoje</CardTitle>
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800">
              {todayAttendance.filter((a) => a.status === "present").length}/{todayAttendance.length} presentes
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {todayAttendance.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/40"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">{att.initials}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm font-medium text-foreground">{att.member}</span>
                  <span className="text-xs text-muted-foreground">{att.time}</span>
                  <div className={`h-2.5 w-2.5 rounded-full ${attendanceStatusDot[att.status]}`} />
                  <span className="w-16 text-right text-xs text-muted-foreground">{att.staff}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Próximos Agendamentos</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Ver Calendário <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {upcomingSchedule.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-muted/60 text-center">
                    <span className="text-[10px] font-medium uppercase text-muted-foreground leading-none">
                      {appt.date.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold text-foreground leading-tight">
                      {appt.date.split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{appt.member}</p>
                    <p className="text-xs text-muted-foreground">{appt.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-[10px] font-medium ${typeBadge[appt.type] || ""}`}
                  >
                    {appt.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 7. Quick Actions Grid ──────────────────────────────── */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`group flex items-center gap-4 rounded-xl border border-border/60 p-4 text-left transition-all hover:shadow-sm hover:-translate-y-0.5 ${action.border}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── 8. Team Activity Feed ──────────────────────────────── */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="h-4 w-4 text-teal-500" />
            Atividade da Equipe
          </CardTitle>
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
            Hoje
          </Badge>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-0.5">
            {teamActivity.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/40 ${
                  idx % 2 === 0 ? "bg-muted/20" : ""
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={`text-xs ${activityIcon[item.type] || ""}`}
                  >
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground/70">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
