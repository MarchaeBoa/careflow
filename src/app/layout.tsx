import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "CareFlow - Intelligent Care Management",
    template: "%s | CareFlow",
  },
  description:
    "CareFlow is a modern SaaS platform for intelligent care management. Streamline patient workflows, automate scheduling, and improve outcomes with real-time analytics and collaborative tools.",
  keywords: [
    "care management",
    "healthcare",
    "SaaS",
    "patient management",
    "scheduling",
    "analytics",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
