"use client"

import { useState } from "react"
import {
  Upload,
  FileText,
  Video,
  File,
  Presentation,
  Link2,
  Users,
  MoreHorizontal,
  Eye,
  Download,
  UserPlus,
  Trash2,
  Calendar,
  FolderOpen,
  Search,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// ─── Types ─────────────────────────────────────────────────────────

type ContentType = "pdf" | "video" | "document" | "slide" | "link"

interface ContentItem {
  id: string
  title: string
  type: ContentType
  category: string
  description: string
  date: string
  assignedCount: number
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockContent: ContentItem[] = [
  {
    id: "c1",
    title: "Fire Safety Training 2026",
    type: "pdf",
    category: "Treinamento",
    description: "Comprehensive fire safety guidelines and emergency evacuation procedures for all care facility staff members.",
    date: "Apr 1, 2026",
    assignedCount: 24,
  },
  {
    id: "c2",
    title: "Medication Administration Policy",
    type: "pdf",
    category: "Políticas",
    description: "Updated policy document covering medication dispensing protocols, storage requirements, and record keeping.",
    date: "Mar 28, 2026",
    assignedCount: 18,
  },
  {
    id: "c3",
    title: "New Staff Onboarding Guide",
    type: "document",
    category: "Treinamento",
    description: "Step-by-step onboarding checklist and orientation guide for new team members joining the care facility.",
    date: "Mar 22, 2026",
    assignedCount: 5,
  },
  {
    id: "c4",
    title: "Moving & Handling Techniques",
    type: "video",
    category: "Treinamento",
    description: "Video training on safe moving and handling techniques to prevent injury during assisted transfers.",
    date: "Mar 15, 2026",
    assignedCount: 15,
  },
  {
    id: "c5",
    title: "Incident Report Template",
    type: "document",
    category: "Formulários",
    description: "Standardized incident reporting form for documenting workplace events, near misses, and safety concerns.",
    date: "Mar 10, 2026",
    assignedCount: 18,
  },
  {
    id: "c6",
    title: "Safeguarding Awareness Workshop",
    type: "slide",
    category: "Treinamento",
    description: "Presentation slides covering safeguarding responsibilities, recognizing signs of abuse, and reporting procedures.",
    date: "Mar 5, 2026",
    assignedCount: 22,
  },
  {
    id: "c7",
    title: "Data Protection & GDPR Guidelines",
    type: "pdf",
    category: "Políticas",
    description: "Essential guide to data protection regulations, member confidentiality, and information handling best practices.",
    date: "Feb 20, 2026",
    assignedCount: 18,
  },
  {
    id: "c8",
    title: "First Aid Refresher Course",
    type: "video",
    category: "Treinamento",
    description: "Annual refresher video for first aid techniques including CPR, wound care, and emergency response protocols.",
    date: "Feb 15, 2026",
    assignedCount: 10,
  },
  {
    id: "c9",
    title: "CQC Compliance Checklist",
    type: "link",
    category: "Diretrizes",
    description: "External link to the Care Quality Commission standards and self-assessment toolkit for regulatory compliance.",
    date: "Jan 30, 2026",
    assignedCount: 8,
  },
]

const categories = ["Todos", "Treinamento", "Políticas", "Formulários", "Diretrizes", "Segurança"]

// ─── Type Config ──────────────────────────────────────────────────

const typeConfig: Record<ContentType, {
  icon: typeof FileText
  color: string
  bgColor: string
  label: string
}> = {
  pdf: {
    icon: FileText,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    label: "PDF",
  },
  video: {
    icon: Video,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    label: "Vídeo",
  },
  document: {
    icon: File,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    label: "Documento",
  },
  slide: {
    icon: Presentation,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    label: "Apresentação",
  },
  link: {
    icon: Link2,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    label: "Link",
  },
}

// ─── Content Card ─────────────────────────────────────────────────

function ContentCard({ item }: { item: ContentItem }) {
  const config = typeConfig[item.type]
  const Icon = config.icon

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex flex-1 flex-col p-0">
        {/* Type Icon Area */}
        <div className={`flex h-36 items-center justify-center ${config.bgColor}`}>
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 shadow-sm dark:bg-black/20 ${config.color}`}>
            <Icon size={28} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title + Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
              {item.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal size={14} />
                </Button>
              } />
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye size={14} />Ver</DropdownMenuItem>
                <DropdownMenuItem><Download size={14} />Baixar</DropdownMenuItem>
                <DropdownMenuItem><UserPlus size={14} />Atribuir</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><Trash2 size={14} />Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category Badge */}
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {item.category}
            </Badge>
            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar size={11} />
              {item.date}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users size={11} />
              {item.assignedCount} atribuídos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ──────────────────────────────────────────────────────────

export default function ContentPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [search, setSearch] = useState("")

  const filtered = mockContent.filter((c) => {
    const matchCategory = activeCategory === "Todos" || c.category === activeCategory
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const totalResources = 48
  const videoCount = mockContent.filter((c) => c.type === "video").length
  const documentCount = mockContent.filter((c) => c.type === "document" || c.type === "pdf").length
  const thisMonthCount = 8

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biblioteca de Conteúdos"
        description="Gerencie materiais de treinamento, políticas, formulários e recursos compartilhados"
        action={
          <Button>
            <Upload size={16} data-icon="inline-start" />
            Enviar Conteúdo
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de Recursos"
          value={totalResources}
          icon={FolderOpen}
          trend={{ value: 14, direction: "up" }}
          description="vs mês anterior"
        />
        <StatCard
          label="Vídeos"
          value={videoCount + 10}
          icon={Video}
          description="vídeos de treinamento"
        />
        <StatCard
          label="Documentos"
          value={documentCount + 18}
          icon={FileText}
          description="políticas e formulários"
        />
        <StatCard
          label="Este Mês"
          value={thisMonthCount}
          icon={Upload}
          trend={{ value: 22, direction: "up" }}
          description="novos envios"
        />
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar recursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filter Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all
                ${activeCategory === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Content Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FolderOpen size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">Nenhum recurso encontrado</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Tente ajustar sua busca ou filtros para encontrar o que você precisa.
          </p>
        </div>
      )}
    </div>
  )
}
