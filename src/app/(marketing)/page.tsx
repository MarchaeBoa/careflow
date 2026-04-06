import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Star,
  Play,
  Check,
  Shield,
  ShieldCheck,
  Lock,
  FileCheck,
  Eye,
  KeyRound,
  Database,
  Brain,
  Pill,
  CalendarDays,
  ListTodo,
  Heart,
  Sparkles,
  Activity,
  Users,
  ClipboardCheck,
  TrendingUp,
  Zap,
} from "lucide-react"

/* ═══════════════════════════ IMAGE CONSTANTS ═══════════════════════════ */

const IMG = {
  // Seção Problema/Solução: enfermeira cuidando de paciente idosa (cuidado real)
  caregiving: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80",
  // Seção Dashboard: pessoa usando software de analytics em laptop
  dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  // Seção Segurança: equipe médica reunida discutindo com prancheta
  security: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  // Seção Como Funciona: profissional de saúde com tablet, tecnologia no cuidado
  howItWorks: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
  // Hero background: equipe de saúde colaborando (overlay da água)
  heroTeam: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80",
  // Bento grid accent: idoso feliz com cuidador
  bentoAccent: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?w=600&q=80",
  // Avatares: rostos profissionais diversos e realistas
  avatar1: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80",  // mulher profissional
  avatar2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",  // homem profissional
  avatar3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",  // mulher sorrindo
  avatar4: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",  // homem sorrindo
  avatar5: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",  // mulher retrato
  avatar6: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",  // homem retrato
  // Extra: medicações / pills para seção de features
  medications: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
  // Extra: pessoa idosa feliz sendo atendida
  elderlyHappy: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&q=80",
}

/* ═══════════════════════════ DATA ═══════════════════════════ */

const LOGOS = [
  "Sunrise Care",
  "BrightPath",
  "Harmony",
  "CrestCare",
  "NewLeaf",
  "Vitality",
  "Aster Health",
  "Lumos Care",
]

const STATS = [
  { value: "500+", label: "Organizacoes" },
  { value: "50.000+", label: "Vidas impactadas" },
  { value: "2M+", label: "Notas processadas" },
  { value: "99,9%", label: "Disponibilidade" },
]

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: "Criptografia AES-256",
    desc: "Todos os dados sao criptografados em repouso e em transito com criptografia de nivel militar.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade LGPD",
    desc: "Totalmente conforme com a Lei Geral de Protecao de Dados e regulamentacoes brasileiras.",
  },
  {
    icon: Database,
    title: "Backups diarios automaticos",
    desc: "Backups incrementais automaticos com retencao de 90 dias e recuperacao em um clique.",
  },
  {
    icon: KeyRound,
    title: "RBAC avancado",
    desc: "Controle de acesso baseado em funcoes com permissoes granulares por modulo e unidade.",
  },
  {
    icon: Eye,
    title: "Logs de auditoria",
    desc: "Registro completo de toda acao no sistema com trilha de auditoria imutavel.",
  },
  {
    icon: FileCheck,
    title: "SOC 2 Type II",
    desc: "Auditoria independente que atesta nossos controles de seguranca, disponibilidade e confidencialidade.",
  },
]

const PLANS = [
  {
    name: "Inicial",
    price: "R$149",
    period: "/mes",
    desc: "Perfeito para pequenas organizacoes comecando a jornada digital.",
    features: [
      "Ate 25 atendidos",
      "3 contas de colaboradores",
      "Cadastro e perfis completos",
      "Notas de atendimento basicas",
      "Controle de presenca",
      "Suporte por e-mail",
    ],
    cta: "Teste Gratis",
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$399",
    period: "/mes",
    desc: "Para organizacoes em crescimento que precisam de ferramentas poderosas.",
    features: [
      "Ate 150 atendidos",
      "Colaboradores ilimitados",
      "Documentacao assistida por IA",
      "Gestao de medicacoes",
      "Painel de compliance",
      "Planos de vida e metas",
      "Gestao de tarefas",
      "Suporte prioritario",
    ],
    cta: "Teste Gratis",
    popular: true,
  },
  {
    name: "Empresarial",
    price: "Sob consulta",
    period: "",
    desc: "Para grandes operacoes com necessidades avancadas de seguranca e integracao.",
    features: [
      "Atendidos ilimitados",
      "Colaboradores ilimitados",
      "Todos os recursos Pro",
      "Gestao multi-unidades",
      "Integracoes e API",
      "Relatorios avancados com IA",
      "Gerente de conta dedicado",
      "SLA e conformidade LGPD",
    ],
    cta: "Fale Conosco",
    popular: false,
  },
]

const TESTIMONIALS = [
  {
    quote:
      "O CareFlow transformou completamente nossa documentacao. O que levava 2 horas agora leva 30 minutos. As sugestoes da IA sao incrivelmente precisas e nossa equipe nunca mais voltaria atras.",
    name: "Mariana Costa",
    role: "Diretora de Servicos",
    org: "Sunrise Senior Living",
    img: IMG.avatar1,
    featured: false,
  },
  {
    quote:
      "So o painel de compliance ja vale todo o investimento. Passamos de temer auditorias para estarmos sempre prontos. Uma transformacao real.",
    name: "Carlos Henrique",
    role: "Oficial de Compliance",
    org: "BrightPath Care",
    img: IMG.avatar2,
    featured: true,
  },
  {
    quote:
      "Avaliamos seis plataformas antes de escolher o CareFlow. O onboarding foi impecavel, a interface e linda e nossa equipe realmente gosta de usar.",
    name: "Fernanda Lima",
    role: "Gerente de Operacoes",
    org: "Harmony Living",
    img: IMG.avatar3,
    featured: false,
  },
  {
    quote:
      "A gestao de medicacoes eliminou erros que antes nos preocupavam diariamente. As notificacoes automaticas sao um salva-vidas literal.",
    name: "Dr. Rafael Souza",
    role: "Diretor Medico",
    org: "CrestCare",
    img: IMG.avatar4,
    featured: false,
  },
  {
    quote:
      "Implementamos o CareFlow em 3 unidades em menos de duas semanas. O suporte foi extraordinario e a migracao dos dados foi perfeita. Recomendo sem hesitar.",
    name: "Ana Paula Ribeiro",
    role: "CEO",
    org: "NewLeaf Services",
    img: IMG.avatar5,
    featured: true,
  },
  {
    quote:
      "Os relatorios com IA nos ajudaram a identificar padroes que nunca teriamos visto. Ja evitamos tres situacoes criticas gracas aos alertas automaticos.",
    name: "Thiago Mendes",
    role: "Coordenador de Qualidade",
    org: "Vitality Group",
    img: IMG.avatar6,
    featured: false,
  },
  {
    quote:
      "A interface e tao intuitiva que ate os colaboradores menos familiarizados com tecnologia se adaptaram em dias, nao semanas. Isso nunca tinha acontecido antes.",
    name: "Luciana Martins",
    role: "Supervisora de Enfermagem",
    org: "Aster Health",
    img: IMG.avatar1,
    featured: false,
  },
  {
    quote:
      "O controle de presenca com geolocalizacao resolveu um problema que enfrentavamos ha anos. Agora temos visibilidade total de toda a operacao em tempo real.",
    name: "Pedro Almeida",
    role: "Diretor Administrativo",
    org: "Lumos Care",
    img: IMG.avatar2,
    featured: false,
  },
]

/* ═══════════════════════════ PAGE ═══════════════════════════ */

export default function MarketingPage() {
  return (
    <>
      {/* ═══════════════ SECTION 1 — HERO ═══════════════ */}
      <section className="relative min-h-[90vh] overflow-hidden" id="recursos">
        {/* Water background image with slow movement */}
        <div className="pointer-events-none absolute inset-0 -z-20">
          <div
            className="absolute -inset-[20%] animate-water-flow"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Overlay gradient to blend water into page */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </div>

        {/* Mesh gradient overlay on top of water */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[120px]" />
          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
          {/* Announcement bar */}
          <div className="flex justify-center">
            <Link
              href="#"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Novidade — Relatorios com IA agora disponiveis
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Hero copy */}
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tighter leading-[1.05] sm:text-6xl lg:text-7xl">
              O futuro da gestao de{" "}
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                cuidado
              </span>{" "}
              comeca aqui
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Documentacao inteligente, compliance automatizado e relatorios com
              IA — tudo em uma plataforma que sua equipe vai amar usar.
            </p>
          </div>

          {/* CTA row */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-teal-500 px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
            >
              Comecar Gratuitamente
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 gap-2 rounded-xl px-8 text-sm font-semibold"
              )}
            >
              <Play className="h-4 w-4" />
              Agendar Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex -space-x-2">
              {[IMG.avatar1, IMG.avatar2, IMG.avatar3, IMG.avatar4, IMG.avatar5].map(
                (src, i) => (
                  <div
                    key={i}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Usado por{" "}
              <span className="font-semibold text-foreground">500+</span>{" "}
              organizacoes
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
            {/* Glow behind */}
            <div className="absolute -inset-4 -z-10 animate-pulse rounded-3xl bg-primary/10 blur-3xl" />

            {/* Browser chrome */}
            <div
              className="overflow-hidden rounded-xl border border-muted/80 bg-card shadow-2xl"
              style={{
                perspective: "2000px",
                transform: "rotateX(2deg)",
              }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="mx-auto flex h-7 w-64 items-center justify-center rounded-md bg-background/80 text-[11px] text-muted-foreground">
                  app.careflow.com.br/dashboard
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative aspect-[16/9]">
                <Image
                  src={IMG.dashboard}
                  alt="CareFlow Dashboard"
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2 — LOGOS BAR (marquee) ═══════════════ */}
      <section className="border-y bg-foreground py-14">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-background/70">
            Organizacoes que confiam no CareFlow
          </p>
        </div>
        {/* Marquee scroll */}
        <div className="relative mt-10 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-foreground to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-foreground to-transparent" />
          <div className="flex animate-marquee items-center gap-16">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-background/15 bg-background/10 text-xs font-bold text-background/80">
                  {name.split(" ").map(w => w[0]).join("")}
                </div>
                <span className="whitespace-nowrap text-base font-bold tracking-tight text-background/60">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3 — BENTO GRID ═══════════════ */}
      <section className="py-32" id="plataforma">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Plataforma
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Uma plataforma completa para cuidado excepcional
            </h2>
          </div>

          {/* Bento grid */}
          <div className="mt-16 grid auto-rows-[240px] grid-cols-1 gap-4 md:grid-cols-3">
            {/* Row 1 — Large: Documentacao Inteligente */}
            <div className="group relative col-span-1 overflow-hidden rounded-2xl border bg-card p-8 md:col-span-2">
              <div className="relative z-10 max-w-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  Documentacao Inteligente
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Notas assistidas por IA que sugerem conteudo, reduzem erros e
                  economizam horas todos os dias.
                </p>
              </div>
              {/* Decorative: typing animation placeholder */}
              <div className="absolute bottom-6 right-6 hidden w-64 space-y-2 rounded-xl border bg-muted/50 p-4 md:block">
                <div className="h-2.5 w-full rounded-full bg-primary/15" />
                <div className="h-2.5 w-3/4 rounded-full bg-primary/10" />
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-1/2 rounded-full bg-primary/10" />
                  <div className="h-4 w-px animate-pulse bg-primary" />
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                    Sugestao IA
                  </div>
                  <div className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                    Tab para aceitar
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1 — Tall: Compliance em Tempo Real */}
            <div className="group relative overflow-hidden rounded-2xl border bg-slate-950 p-8 text-white">
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Shield className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  Compliance em Tempo Real
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  KPIs ao vivo, trilhas de auditoria e scores de conformidade
                  automaticos.
                </p>
              </div>
              {/* Percentage circle */}
              <div className="absolute bottom-6 right-6 flex h-20 w-20 items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#tealGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${0.94 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                  />
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-lg font-bold text-white">
                  94%
                </span>
              </div>
            </div>

            {/* Row 2 — Three equal cards */}
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-bold">Controle de Presenca</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Check-in/out em tempo real com geolocalizacao e QR codes.
              </p>
              {/* Mini calendar dots */}
              <div className="absolute bottom-6 right-6 grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      i % 7 === 0 || i % 7 === 6
                        ? "bg-muted"
                        : i % 3 === 0
                          ? "bg-primary/60"
                          : "bg-primary/20"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-bold">Gestao de Medicacoes</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ciclo completo da prescricao a administracao com alertas.
              </p>
              {/* Status dots */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                {["Administrado", "Pendente", "Atrasado"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        i === 0
                          ? "bg-green-500"
                          : i === 1
                            ? "bg-amber-500"
                            : "bg-red-500"
                      )}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border p-0">
              <Image
                src={IMG.caregiving}
                alt="Cuidador auxiliando pessoa idosa"
                width={400}
                height={240}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">IA + Cuidado Humano</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">Relatorios com IA</h3>
                <p className="mt-1 text-sm text-white/70">
                  Tecnologia a servico do cuidado real
                </p>
              </div>
            </div>

            {/* Row 3 — Tall: Planos de Vida (photo card) */}
            <div className="group relative overflow-hidden rounded-2xl border p-0">
              <Image
                src={IMG.bentoAccent}
                alt="Idoso feliz com cuidador profissional"
                width={400}
                height={240}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">Planos de Vida</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">Cada pessoa tem sua historia</h3>
                <div className="mt-3 flex gap-2">
                  {[85, 62, 94].map((pct, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-teal-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3 — Large: Gestao de Tarefas */}
            <div className="group relative col-span-1 overflow-hidden rounded-2xl border bg-slate-950 p-8 text-white md:col-span-2">
              <div className="relative z-10 max-w-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <ListTodo className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Gestao de Tarefas</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Coordenacao da equipe com prioridades, prazos e
                  atualizacoes em tempo real.
                </p>
              </div>
              {/* Mini kanban */}
              <div className="absolute bottom-6 right-6 hidden gap-3 md:flex">
                {["A Fazer", "Em Progresso", "Concluido"].map((col, ci) => (
                  <div key={col} className="w-28">
                    <div className="mb-2 text-[10px] font-semibold text-white/50">
                      {col}
                    </div>
                    <div className="space-y-1.5">
                      {Array.from({
                        length: ci === 0 ? 3 : ci === 1 ? 2 : 4,
                      }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-5 rounded-md",
                            ci === 2
                              ? "bg-teal-500/20"
                              : ci === 1
                                ? "bg-amber-500/20"
                                : "bg-white/10"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4 — TESTIMONIALS ═══════════════ */}
      <section className="bg-muted/30 py-32" id="clientes">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Depoimentos
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Amado por equipes de cuidado em todo o Brasil
            </h2>
          </div>

          {/* Masonry grid */}
          <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "mb-4 break-inside-avoid rounded-2xl border p-6",
                  t.featured
                    ? "bg-gradient-to-br from-primary to-teal-600 text-white border-transparent"
                    : "bg-card"
                )}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={cn(
                        "h-4 w-4",
                        t.featured
                          ? "fill-white/90 text-white/90"
                          : "fill-amber-400 text-amber-400"
                      )}
                    />
                  ))}
                </div>
                {/* Quote */}
                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed",
                    t.featured ? "text-white/90" : "text-foreground"
                  )}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Divider */}
                <div
                  className={cn(
                    "my-4 h-px",
                    t.featured ? "bg-white/20" : "bg-border"
                  )}
                />
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={t.img}
                      alt={t.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        t.featured ? "text-white" : "text-foreground"
                      )}
                    >
                      {t.name}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        t.featured ? "text-white/60" : "text-muted-foreground"
                      )}
                    >
                      {t.role} · {t.org}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5 — NUMBERS ═══════════════ */}
      <section className="border-y py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl">
                  {s.value}
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PHOTO BANNER — full width immersive ═══════════ */}
      <section className="relative h-[400px] overflow-hidden sm:h-[500px]">
        <Image
          src={IMG.heroTeam}
          alt="Equipe de cuidado trabalhando juntos"
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-teal-600/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-lg font-medium text-white/80 sm:text-xl">
              Mais do que uma plataforma —
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Uma nova forma de cuidar de quem mais precisa
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/70">
              Combinamos tecnologia de ponta com o calor humano que faz a diferenca no dia a dia das organizacoes de cuidado.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6 — HOW IT WORKS ═══════════════ */}
      <section className="py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Comece agora
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Como funciona
            </h2>
          </div>

          <div className="relative mt-20">
            {/* Vertical connecting line — desktop */}
            <div className="absolute bottom-0 left-8 top-0 hidden w-px bg-gradient-to-b from-primary via-teal-500 to-primary/20 md:left-1/2 md:block" />

            {/* Steps */}
            <div className="space-y-20 md:space-y-24">
              {/* Step 1 */}
              <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col items-start md:items-end md:text-right">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-2xl font-extrabold text-white shadow-lg shadow-primary/25">
                    1
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">
                    Configure sua organizacao
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Crie seu espaco de trabalho em minutos. Configure locais,
                    departamentos, funcoes e permissoes de acordo com sua
                    estrutura.
                  </p>
                </div>
                {/* Real photo: person configuring on laptop */}
                <div className="overflow-hidden rounded-xl border shadow-lg">
                  <Image
                    src={IMG.howItWorks}
                    alt="Profissional configurando plataforma no tablet"
                    width={500}
                    height={300}
                    unoptimized
                    className="h-[220px] w-full object-cover"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <div className="order-2 md:order-1">
                  {/* Overlapping avatars */}
                  <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 shadow-sm">
                    <div className="flex -space-x-3">
                      {[IMG.avatar1, IMG.avatar2, IMG.avatar3, IMG.avatar4, IMG.avatar5, IMG.avatar6].map(
                        (src, i) => (
                          <div
                            key={i}
                            className="relative h-12 w-12 overflow-hidden rounded-full border-3 border-background"
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )
                      )}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-3 border-background bg-primary/10 text-xs font-bold text-primary">
                        +47
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Equipe completa integrada
                    </p>
                  </div>
                </div>
                <div className="order-1 flex flex-col items-start md:order-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-2xl font-extrabold text-white shadow-lg shadow-primary/25">
                    2
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">
                    Convide sua equipe
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Adicione colaboradores, importe cadastros e configure planos
                    de cuidado. Nosso onboarding guiado torna a migracao
                    simples.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col items-start md:items-end md:text-right">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-2xl font-extrabold text-white shadow-lg shadow-primary/25">
                    3
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">
                    Transforme o cuidado
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Sua equipe pode imediatamente documentar atendimentos,
                    controlar presenca, gerenciar medicacoes e gerar relatorios
                    inteligentes.
                  </p>
                </div>
                {/* Real photo: elderly person happy being cared for */}
                <div className="overflow-hidden rounded-xl border shadow-lg">
                  <Image
                    src={IMG.elderlyHappy}
                    alt="Pessoa idosa feliz recebendo cuidado"
                    width={500}
                    height={300}
                    unoptimized
                    className="h-[220px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7 — SECURITY ═══════════════ */}
      <section className="bg-slate-950 py-32 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Shield className="h-6 w-6 text-teal-400" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Seguranca de nivel empresarial
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/60">
              Construido com os mais altos padroes de seguranca e privacidade
              desde o primeiro dia.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: real photo */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={IMG.security}
                alt="Equipe medica discutindo dados de pacientes com seguranca"
                width={600}
                height={450}
                unoptimized
                className="h-[400px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                {["LGPD Conforme", "SOC 2 Type II", "ISO 27001"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
                  >
                    <ShieldCheck className="h-3 w-3 text-teal-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: features grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {SECURITY_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:bg-white/[0.08]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-teal-500/20">
                    <f.icon className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance badges — mobile only */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 lg:hidden">
            {["LGPD Conforme", "SOC 2 Type II", "ISO 27001"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8 — PRICING ═══════════════ */}
      <section className="py-32" id="precos">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Precos
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Investimento simples, retorno imenso
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 transition-shadow duration-300",
                  plan.popular
                    ? "scale-[1.02] border-primary ring-2 ring-primary shadow-xl shadow-primary/10 lg:scale-105"
                    : "hover:shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-teal-500 px-4 py-1 text-xs font-semibold text-white shadow-md">
                    MAIS POPULAR
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {plan.desc}
                  </p>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.popular ? "/register" : "#"}
                  className={cn(
                    "mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300",
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-teal-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
                      : "border bg-background hover:bg-accent"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            Precisa de um plano personalizado?{" "}
            <Link
              href="#"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Fale com nosso time
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════════ SECTION 9 — FINAL CTA ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-teal-600 py-32">
        {/* Decorative mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pronto para revolucionar sua gestao de cuidado?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Junte-se a centenas de organizacoes que ja transformaram a forma
            como entregam cuidado com o CareFlow.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-primary shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
            >
              Comecar Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Falar com Vendas
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/60">
            Sem cartao de credito &middot; Configuracao em 5 minutos &middot;
            Suporte dedicado
          </p>
        </div>
      </section>
    </>
  )
}
