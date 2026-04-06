"use client"

import {
  FileText,
  CalendarCheck,
  Pill,
  AlertTriangle,
  ShieldCheck,
  AlertCircle,
  Info,
  XCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ─── Mock Data ─────────────────────────────────────────────────────

const complianceTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  notes: 88 + Math.floor(Math.random() * 10),
  attendance: 85 + Math.floor(Math.random() * 12),
  medications: 92 + Math.floor(Math.random() * 7),
}))

const alerts = [
  {
    id: "al1",
    severity: "critical",
    message: "3 notas de serviço atrasadas para James Wilson (mais de 48 horas)",
    action: "Revisar Agora",
  },
  {
    id: "al2",
    severity: "critical",
    message: "Administração de medicação perdida para Anna Lee - Sertralina 50mg",
    action: "Resolver",
  },
  {
    id: "al3",
    severity: "warning",
    message: "5 membros da equipe não concluíram o treinamento obrigatório no prazo",
    action: "Ver Detalhes",
  },
  {
    id: "al4",
    severity: "warning",
    message: "Taxa de presença caiu abaixo de 85% na Ala Leste esta semana",
    action: "Investigar",
  },
  {
    id: "al5",
    severity: "info",
    message: "Auditoria trimestral de compliance agendada para 15 de abril de 2026",
    action: "Preparar",
  },
]

const severityStyles: Record<string, { bg: string; icon: typeof AlertCircle; iconColor: string }> = {
  critical: { bg: "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20", icon: XCircle, iconColor: "text-red-500" },
  warning: { bg: "border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20", icon: AlertTriangle, iconColor: "text-yellow-500" },
  info: { bg: "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20", icon: Info, iconColor: "text-blue-500" },
}

const teamPerformance = [
  { name: "Sarah Johnson", role: "Care Manager", notesCompleted: 42, attendanceLogged: 38, tasksDone: 15, compliance: 96 },
  { name: "Mike Chen", role: "Care Worker", notesCompleted: 35, attendanceLogged: 40, tasksDone: 12, compliance: 94 },
  { name: "Emily Davis", role: "Care Worker", notesCompleted: 38, attendanceLogged: 36, tasksDone: 18, compliance: 92 },
  { name: "David Kim", role: "Support Worker", notesCompleted: 28, attendanceLogged: 30, tasksDone: 10, compliance: 88 },
  { name: "Lisa Park", role: "Therapist", notesCompleted: 30, attendanceLogged: 34, tasksDone: 14, compliance: 91 },
  { name: "Tom Wright", role: "Care Worker", notesCompleted: 25, attendanceLogged: 32, tasksDone: 8, compliance: 85 },
]

// ─── Page ──────────────────────────────────────────────────────────

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel de Compliance"
        description="Monitore conformidade regulatória e métricas de qualidade"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Taxa de Notas Concluídas"
          value="94%"
          icon={FileText}
          trend={{ value: 2, direction: "up" }}
          description="vs mês anterior"
        />
        <StatCard
          label="Taxa de Presença"
          value="89%"
          icon={CalendarCheck}
          trend={{ value: 1, direction: "up" }}
          description="vs mês anterior"
        />
        <StatCard
          label="Adesão Medicamentosa"
          value="97%"
          icon={Pill}
          trend={{ value: 3, direction: "up" }}
          description="vs mês anterior"
        />
        <StatCard
          label="Tarefas Atrasadas"
          value="3"
          icon={AlertTriangle}
          trend={{ value: 5, direction: "down" }}
          description="vs semana anterior"
        />
      </div>

      {/* Compliance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-600" />
            Tendências de Compliance - Últimos 30 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrend}>
                <defs>
                  <linearGradient id="notesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis domain={[75, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="notes" stroke="#14b8a6" strokeWidth={2} fill="url(#notesGrad)" name="Notas" />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} fill="url(#attGrad)" name="Presença" />
                <Area type="monotone" dataKey="medications" stroke="#a855f7" strokeWidth={2} fill="url(#medGrad)" name="Medicações" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
              <span className="text-xs text-muted-foreground">Notas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Presença</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-muted-foreground">Medicações</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-500" />
            Alertas de Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => {
            const style = severityStyles[alert.severity]
            const Icon = style.icon
            return (
              <div
                key={alert.id}
                className={`flex items-center gap-3 rounded-lg p-3 ${style.bg}`}
              >
                <Icon size={18} className={`shrink-0 ${style.iconColor}`} />
                <p className="flex-1 text-sm text-foreground">{alert.message}</p>
                <Button variant="outline" size="sm" className="shrink-0">
                  {alert.action}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho da Equipe</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Membro da Equipe</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Notas Concluídas</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Presença Registrada</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Tarefas Feitas</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Compliance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamPerformance.map((staff) => (
                <TableRow key={staff.name}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{staff.notesCompleted}</TableCell>
                  <TableCell className="text-muted-foreground">{staff.attendanceLogged}</TableCell>
                  <TableCell className="text-muted-foreground">{staff.tasksDone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            staff.compliance >= 90
                              ? "bg-emerald-500"
                              : staff.compliance >= 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${staff.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{staff.compliance}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
