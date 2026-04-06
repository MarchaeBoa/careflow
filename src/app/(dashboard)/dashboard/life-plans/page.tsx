"use client"

import { useState } from "react"
import {
  Target,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Plus,
  CalendarDays,
  User,
  Star,
  FileCheck,
  Clock,
  TrendingUp,
  Paperclip,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// ─── Types ────────────────────────────────────────────────────────

interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
  status: "completed" | "in-progress" | "pending"
}

interface Goal {
  id: string
  title: string
  category: string
  description: string
  progress: number
  evidenceCount: number
  milestones: Milestone[]
}

interface Review {
  id: string
  reviewer: string
  date: string
  summary: string
  nextReviewDate: string
}

// ─── Mock Data ────────────────────────────────────────────────────

const members = [
  { value: "james-wilson", label: "James Wilson" },
  { value: "maria-garcia", label: "Maria Garcia" },
  { value: "robert-brown", label: "Robert Brown" },
  { value: "anna-lee", label: "Anna Lee" },
]

const activePlan = {
  title: "Personal Development & Independence 2026",
  member: "James Wilson",
  startDate: "Jan 15, 2026",
  targetDate: "Dec 31, 2026",
  overallProgress: 68,
  status: "active" as const,
}

const goals: Goal[] = [
  {
    id: "g1",
    title: "Habilidades de Vida Diária",
    category: "Independência",
    description:
      "Develop greater independence in daily tasks including cooking, cleaning, laundry management, and personal budgeting to support eventual semi-independent living.",
    progress: 75,
    evidenceCount: 12,
    milestones: [
      { id: "m1", title: "Complete cooking safety assessment", date: "Feb 10, 2026", completed: true, status: "completed" },
      { id: "m2", title: "Prepare a simple meal independently", date: "Mar 1, 2026", completed: true, status: "completed" },
      { id: "m3", title: "Manage weekly laundry routine", date: "Apr 15, 2026", completed: true, status: "completed" },
      { id: "m4", title: "Create and follow a personal budget for 1 month", date: "Jun 1, 2026", completed: false, status: "in-progress" },
    ],
  },
  {
    id: "g2",
    title: "Integração Social",
    category: "Comunidade",
    description:
      "Build meaningful social connections through community activities, volunteer work, and structured social events to reduce isolation and build confidence.",
    progress: 45,
    evidenceCount: 7,
    milestones: [
      { id: "m5", title: "Attend community centre open day", date: "Feb 20, 2026", completed: true, status: "completed" },
      { id: "m6", title: "Join weekly art therapy group", date: "Mar 15, 2026", completed: true, status: "completed" },
      { id: "m7", title: "Volunteer at local charity shop (4 sessions)", date: "May 30, 2026", completed: false, status: "in-progress" },
      { id: "m8", title: "Initiate a social outing independently", date: "Aug 1, 2026", completed: false, status: "pending" },
    ],
  },
  {
    id: "g3",
    title: "Saúde e Bem-Estar",
    category: "Saúde",
    description:
      "Maintain physical fitness, healthy eating habits, and emotional well-being through structured exercise, nutrition plans, and mindfulness sessions.",
    progress: 90,
    evidenceCount: 18,
    milestones: [
      { id: "m9", title: "Complete health screening", date: "Jan 30, 2026", completed: true, status: "completed" },
      { id: "m10", title: "Attend gym sessions 3x per week for 1 month", date: "Mar 1, 2026", completed: true, status: "completed" },
      { id: "m11", title: "Follow nutrition plan consistently for 60 days", date: "Apr 1, 2026", completed: true, status: "completed" },
      { id: "m12", title: "Achieve target BMI range", date: "Jul 1, 2026", completed: false, status: "in-progress" },
    ],
  },
  {
    id: "g4",
    title: "Habilidades de Comunicação",
    category: "Crescimento Pessoal",
    description:
      "Improve verbal and written communication including expressing needs clearly, engaging in group conversations, and using assistive technology when needed.",
    progress: 60,
    evidenceCount: 9,
    milestones: [
      { id: "m13", title: "Initial speech & language assessment", date: "Feb 5, 2026", completed: true, status: "completed" },
      { id: "m14", title: "Complete 8 sessions with speech therapist", date: "Apr 10, 2026", completed: true, status: "completed" },
      { id: "m15", title: "Participate in group discussion confidently", date: "Jun 15, 2026", completed: false, status: "in-progress" },
      { id: "m16", title: "Lead a short presentation to peers", date: "Sep 1, 2026", completed: false, status: "pending" },
    ],
  },
]

const reviews: Review[] = [
  {
    id: "rev1",
    reviewer: "Sarah Thompson (Key Worker)",
    date: "Mar 15, 2026",
    summary:
      "James has shown excellent progress in daily living skills, particularly in meal preparation. Social integration goals are progressing well with consistent attendance at art therapy. Recommend increasing community volunteering sessions.",
    nextReviewDate: "Jun 15, 2026",
  },
  {
    id: "rev2",
    reviewer: "Dr. Michael Harris (Psychologist)",
    date: "Feb 20, 2026",
    summary:
      "Communication skills are developing steadily. James is more confident expressing his preferences during sessions. Health and wellness goals are on track with very high engagement in physical activities.",
    nextReviewDate: "May 20, 2026",
  },
  {
    id: "rev3",
    reviewer: "Lisa Patel (Service Manager)",
    date: "Jan 30, 2026",
    summary:
      "Initial plan review complete. All goals are appropriate and well-structured. James has engaged well with the planning process and shows motivation across all areas.",
    nextReviewDate: "Apr 30, 2026",
  },
]

const categoryConfig: Record<string, string> = {
  "Independência": "bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/40",
  "Comunidade": "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/40",
  "Saúde": "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40",
  "Crescimento Pessoal": "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
}

const milestoneStatusConfig: Record<string, string> = {
  completed: "text-emerald-600 dark:text-emerald-400",
  "in-progress": "text-blue-600 dark:text-blue-400",
  pending: "text-muted-foreground/40",
}

// ─── Page ─────────────────────────────────────────────────────────

export default function LifePlansPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>("james-wilson")
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(["g1"]))

  const toggleGoal = (goalId: string) => {
    setExpandedGoals((prev) => {
      const next = new Set(prev)
      next.has(goalId) ? next.delete(goalId) : next.add(goalId)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos de Vida e Metas"
        description="Acompanhe metas, marcos e desenvolvimento pessoal dos atendidos"
        action={
          <Button>
            <Plus size={16} />
            Novo Plano
          </Button>
        }
      />

      {/* Member Selector */}
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium text-muted-foreground">Atendido:</Label>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecione um atendido..." />
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

      {/* Active Plan Overview */}
      <Card className="border-teal-200/50 dark:border-teal-900/30">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                  <Star size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{activePlan.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User size={11} /> {activePlan.member}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  Início: {activePlan.startDate}
                </span>
                <span className="flex items-center gap-1">
                  <Target size={12} />
                  Meta: {activePlan.targetDate}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              Ativo
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={activePlan.overallProgress}>
              <ProgressLabel className="text-xs">Progresso Geral</ProgressLabel>
              <ProgressValue className="text-xs font-semibold text-teal-600 dark:text-teal-400" />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Metas</h2>

        {goals.map((goal) => {
          const isExpanded = expandedGoals.has(goal.id)
          const completedCount = goal.milestones.filter((m) => m.completed).length

          return (
            <Card key={goal.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Goal Header - clickable */}
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                    <Target size={18} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{goal.title}</h3>
                      <Badge variant="outline" className={`text-[10px] ${categoryConfig[goal.category] || ""}`}>
                        {goal.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-transparent bg-muted/50 text-[10px] text-muted-foreground"
                      >
                        <Paperclip size={9} />
                        {goal.evidenceCount} evidências
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {goal.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-teal-600 dark:text-teal-400">
                        {goal.progress}%
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {completedCount}/{goal.milestones.length} marcos
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </button>

                {/* Expanded Milestones */}
                {isExpanded && (
                  <div className="border-t border-border/40 bg-muted/10 px-5 py-4">
                    <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Marcos
                    </h4>
                    <div className="space-y-2">
                      {goal.milestones.map((ms) => (
                        <div
                          key={ms.id}
                          className="flex items-center gap-3 rounded-lg border border-border/40 bg-card px-3 py-2.5"
                        >
                          <Checkbox checked={ms.completed} disabled />
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-sm ${
                                ms.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {ms.title}
                            </span>
                          </div>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {ms.date}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] font-medium capitalize ${milestoneStatusConfig[ms.status]}`}
                          >
                            {ms.status === "in-progress" ? "Em Andamento" : ms.status === "completed" ? "Concluído" : "Pendente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Linha do Tempo</h2>
        <Card>
          <CardContent className="p-5">
            <div className="relative space-y-0">
              {goals
                .flatMap((g) =>
                  g.milestones
                    .filter((m) => m.completed)
                    .map((m) => ({ ...m, goalTitle: g.title }))
                )
                .map((item, i, arr) => (
                  <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Vertical line */}
                    {i < arr.length - 1 && (
                      <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                    )}
                    {/* Dot */}
                    <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {/* Content */}
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.goalTitle} &middot; {item.date}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Revisões do Plano</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <FileCheck size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{review.reviewer}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {review.summary}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Badge
                      variant="outline"
                      className="whitespace-nowrap border-blue-200/60 bg-blue-50/50 text-[10px] text-blue-600 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      <Clock size={10} />
                      Próxima: {review.nextReviewDate}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Helper Label Component (inline) ──────────────────────────────

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} {...props} />
}
