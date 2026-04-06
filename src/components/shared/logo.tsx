"use client"

import { Activity, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type LogoSize = "sm" | "default" | "lg"

interface LogoProps {
  size?: LogoSize
  showText?: boolean
  className?: string
}

const sizeConfig: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 18, text: "text-base", gap: "gap-1.5" },
  default: { icon: 22, text: "text-lg", gap: "gap-2" },
  lg: { icon: 28, text: "text-2xl", gap: "gap-2.5" },
}

export function Logo({ size = "default", showText = true, className }: LogoProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn("flex items-center", config.gap, className)}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 opacity-20 blur-sm" />
        <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 p-1.5 shadow-md shadow-teal-500/20">
          <Heart
            size={config.icon * 0.6}
            className="absolute text-white opacity-60"
            fill="currentColor"
          />
          <Activity
            size={config.icon}
            className="relative text-white"
            strokeWidth={2.5}
          />
        </div>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            config.text
          )}
        >
          <span className="text-teal-600 dark:text-teal-400">Care</span>
          <span className="text-foreground">Flow</span>
        </span>
      )}
    </div>
  )
}
