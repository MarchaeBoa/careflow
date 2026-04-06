"use client"

import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
  }
  description?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  className,
}: StatCardProps) {
  const isPositive = trend?.direction === "up"

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all duration-300",
        "hover:border-teal-200 hover:shadow-md hover:shadow-teal-500/5 dark:hover:border-teal-800/50 dark:hover:shadow-teal-500/5",
        className
      )}
    >
      {/* Gradient border accent on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
          <Icon size={20} />
        </div>
      </div>

      {(trend || description) && (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
