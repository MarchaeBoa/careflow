"use client"

import { useState } from "react"
import {
  Brain,
  Sparkles,
  Download,
  Eye,
  Edit,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  BarChart3,
  Timer,
  CalendarDays,
  ThumbsUp,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// ─── Types ────────────────────────────────────────────────────────

interface Report {
  id: string
  title: string
  member: string
  type: string
  period: string
  createdDate: string
  status: "generated" | "reviewed" | "final"
  wordCount: number
}

// ─── Mock Data ────────────────────────────────────────────────────

const members = [
  { value: "james-wilson", label: "James Wilson" },
  { value: "maria-garcia", label: "Maria Garcia" },
  { value: "robert-brown", label: "Robert Brown" },
  { value: "anna-lee", label: "Anna Lee" },
  { value: "john-taylor", label: "John Taylor" },
  { value: "emily-chen", label: "Emily Chen" },
]

const reportTypes = [
  { value: "weekly", label: "Resumo Semanal" },
  { value: "monthly", label: "Revisão Mensal" },
  { value: "progress", label: "Relatório de Progresso" },
  { value: "compliance", label: "Relatório de Compliance" },
]

const dateRanges = [
  { value: "7d", label: "Últimos 7 Dias" },
  { value: "30d", label: "Últimos 30 Dias" },
  { value: "custom", label: "Personalizado" },
]

const mockReports: Report[] = [
  {
    id: "rpt-001",
    title: "Weekly Summary - James Wilson",
    member: "James Wilson",
    type: "Weekly Summary",
    period: "Mar 31 - Apr 6, 2026",
    createdDate: "Apr 6, 2026",
    status: "generated",
    wordCount: 1842,
  },
  {
    id: "rpt-002",
    title: "Monthly Review - Maria Garcia",
    member: "Maria Garcia",
    type: "Monthly Review",
    period: "March 2026",
    createdDate: "Apr 4, 2026",
    status: "reviewed",
    wordCount: 3256,
  },
  {
    id: "rpt-003",
    title: "Progress Report - Robert Brown",
    member: "Robert Brown",
    type: "Progress Report",
    period: "Q1 2026",
    createdDate: "Apr 3, 2026",
    status: "final",
    wordCount: 4510,
  },
  {
    id: "rpt-004",
    title: "Compliance Report - Anna Lee",
    member: "Anna Lee",
    type: "Compliance Report",
    period: "Mar 31 - Apr 6, 2026",
    createdDate: "Apr 2, 2026",
    status: "reviewed",
    wordCount: 2104,
  },
  {
    id: "rpt-005",
    title: "Weekly Summary - John Taylor",
    member: "John Taylor",
    type: "Weekly Summary",
    period: "Mar 24 - Mar 30, 2026",
    createdDate: "Mar 31, 2026",
    status: "final",
    wordCount: 1678,
  },
  {
    id: "rpt-006",
    title: "Monthly Review - Emily Chen",
    member: "Emily Chen",
    type: "Monthly Review",
    period: "March 2026",
    createdDate: "Mar 30, 2026",
    status: "generated",
    wordCount: 2890,
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  generated: {
    label: "Gerado",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40",
  },
  reviewed: {
    label: "Revisado",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
  },
  final: {
    label: "Final",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
  },
}

// ─── Page ─────────────────────────────────────────────────────────

export default function AIReportsPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>("")
  const [selectedType, setSelectedType] = useState<string | null>("")
  const [selectedRange, setSelectedRange] = useState<string | null>("7d")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 3000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios com IA"
        description="Gere relatórios inteligentes com análise de IA"
        action={
          <Button>
            <Brain size={16} />
            <Sparkles size={14} className="text-yellow-400" />
            Gerar Relatório
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Relatórios Gerados"
          value={156}
          icon={FileText}
          trend={{ value: 12, direction: "up" }}
          description="total"
        />
        <StatCard
          label="Tempo Médio"
          value="12s"
          icon={Timer}
          trend={{ value: 8, direction: "down" }}
          description="mais rápido este mês"
        />
        <StatCard
          label="Este Mês"
          value={23}
          icon={CalendarDays}
          trend={{ value: 15, direction: "up" }}
          description="vs mês anterior"
        />
        <StatCard
          label="Revisados"
          value="89%"
          icon={ThumbsUp}
          trend={{ value: 5, direction: "up" }}
          description="taxa de revisão"
        />
      </div>

      {/* Report Generator */}
      <Card className="border-teal-200/50 bg-gradient-to-br from-teal-50/30 via-background to-background dark:border-teal-900/30 dark:from-teal-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-sm">
              <Brain size={18} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-1.5">
                Gerador de Relatórios
                <Sparkles size={14} className="text-yellow-500" />
              </CardTitle>
              <CardDescription>
                A IA analisará notas, presença e metas para criar um relatório abrangente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Selecione o Atendido
              </Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha o atendido..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Tipo de Relatório
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Período
              </Label>
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o período..." />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedMember || !selectedType}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm hover:from-teal-700 hover:to-teal-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Brain size={16} />
                    Gerar com IA
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Relatórios Gerados</h2>
          <span className="text-sm text-muted-foreground">{mockReports.length} relatórios</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {mockReports.map((report) => {
            const statusInfo = statusConfig[report.status]
            return (
              <Card key={report.id} className="group transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                          <FileText size={20} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold leading-tight text-foreground">
                            {report.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{report.member}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] ${statusInfo.className}`}
                      >
                        {report.status === "final" && <CheckCircle2 size={10} />}
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {report.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {report.createdDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        {report.wordCount.toLocaleString()} palavras
                      </span>
                    </div>

                    {/* AI Badge + Actions */}
                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <Badge
                        variant="outline"
                        className="border-purple-200/60 bg-purple-50/50 text-[10px] text-purple-600 dark:border-purple-800/40 dark:bg-purple-950/30 dark:text-purple-400"
                      >
                        <Sparkles size={10} />
                        Gerado por IA
                      </Badge>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                          <Eye size={12} />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                          <Download size={12} />
                          Baixar PDF
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                          <Edit size={12} />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
