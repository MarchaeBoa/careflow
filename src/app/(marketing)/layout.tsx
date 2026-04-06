"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Activity, Menu, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,

} from "@/components/ui/sheet"

/* ───────────────────── nav links ───────────────────── */

const NAV = [
  { label: "Recursos", href: "#recursos" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Precos", href: "#precos" },
  { label: "Clientes", href: "#clientes" },
]

const FOOTER_LINKS = {
  Plataforma: [
    { label: "Documentacao Inteligente", href: "#" },
    { label: "Compliance em Tempo Real", href: "#" },
    { label: "Relatorios com IA", href: "#" },
    { label: "Gestao de Tarefas", href: "#" },
    { label: "Controle de Presenca", href: "#" },
    { label: "Planos de Vida", href: "#" },
  ],
  Empresa: [
    { label: "Sobre nos", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
    { label: "Parceiros", href: "#" },
  ],
  Recursos: [
    { label: "Central de Ajuda", href: "#" },
    { label: "Documentacao API", href: "#" },
    { label: "Guias de Integracao", href: "#" },
    { label: "Status do Sistema", href: "#" },
    { label: "Webinars", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "/privacy" },
    { label: "Termos de Uso", href: "/terms" },
    { label: "Politica de Cookies", href: "#" },
    { label: "LGPD", href: "#" },
    { label: "Seguranca", href: "#" },
  ],
}

const SOCIALS = [
  { label: "X", initial: "X" },
  { label: "LinkedIn", initial: "Li" },
  { label: "Instagram", initial: "Ig" },
]

/* ───────────────────── component ───────────────────── */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          "border-b border-transparent backdrop-blur-xl",
          scrolled
            ? "border-border/40 bg-background/80 shadow-sm"
            : "bg-background/40"
        )}
      >
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-500 shadow-md shadow-primary/20 transition-shadow group-hover:shadow-lg group-hover:shadow-primary/30">
              <Activity className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">CareFlow</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-sm font-medium"
              )}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
              )}
            >
              Comecar Gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger render={
                <div
                  role="button"
                  tabIndex={0}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-background/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </div>
              } />
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-8">
                  {/* Mobile logo */}
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-500">
                      <Activity className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                      CareFlow
                    </span>
                  </div>

                  {/* Mobile links */}
                  <nav className="flex flex-col gap-1">
                    {NAV.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile CTA */}
                  <div className="flex flex-col gap-2 border-t pt-4">
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center"
                      )}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-teal-500 text-sm font-semibold text-white shadow-lg shadow-primary/25"
                    >
                      Comecar Gratis
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ═══════════════ MAIN ═══════════════ */}
      <main className="flex-1">{children}</main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-slate-950 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-500">
                  <Activity className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  CareFlow
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                Gestao inteligente de cuidados para equipes modernas. Mais
                eficiencia, mais humanidade.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <div
                    key={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white/80 cursor-pointer"
                    title={s.label}
                  >
                    {s.initial}
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-sm font-semibold text-white/80">
                  {heading}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/40 transition-colors duration-200 hover:text-white/70"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            <p className="text-sm text-white/30">
              &copy; 2026 CareFlow Inc. Todos os direitos reservados.
            </p>

            {/* Compliance badges */}
            <div className="flex items-center gap-3">
              {["LGPD", "SOC 2", "ISO 27001"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40"
                >
                  {badge}
                </span>
              ))}
            </div>

            <p className="text-sm text-white/30">
              Feito com <span className="text-red-400">&#10084;</span> no Brasil
            </p>
          </div>

          {/* CNPJ */}
          <div className="mt-6 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-white/25">
              Truth Commerce LTDA — CNPJ: 45.811.834/0001-15
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
