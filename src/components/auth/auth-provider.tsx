"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"
import { useAuth, type UseAuthReturn } from "@/lib/hooks/use-auth"
import { DashboardLoadingSkeleton } from "@/components/layout/loading-skeleton"

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<UseAuthReturn | null>(null)

// ─── Provider ───────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Wraps the application (or a subtree) to provide authentication state
 * to all descendants via `useAuthContext()`.
 *
 * Place it in the root layout:
 * ```tsx
 * <AuthProvider>{children}</AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {auth.isLoading ? <DashboardLoadingSkeleton /> : children}
    </AuthContext.Provider>
  )
}

// ─── Consumer Hook ──────────────────────────────────────────────────────────

/**
 * Access the auth context from any client component inside `<AuthProvider>`.
 * Throws if used outside the provider.
 */
export function useAuthContext(): UseAuthReturn {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      "useAuthContext deve ser usado dentro de <AuthProvider>. " +
        "Certifique-se de que o AuthProvider envolve este componente."
    )
  }

  return ctx
}

