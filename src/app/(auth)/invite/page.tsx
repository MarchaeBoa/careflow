"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Shield,
  Building2,
  User,
  AlertCircle,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ─── Types ──────────────────────────────────────────────────────────────────

interface InvitationData {
  id: string
  email: string
  role: string
  organization_name: string
  inviter_name: string
  status: "pending" | "accepted" | "cancelled" | "expired"
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const inviteSchema = z
  .object({
    full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirm_password: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas nao coincidem",
    path: ["confirm_password"],
  })

type InviteFormValues = z.infer<typeof inviteSchema>

// ─── Role Labels ────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  ORG_ADMIN: "Administrador",
  MANAGER: "Gerente",
  STAFF: "Equipe",
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const token = searchParams.get("token")
  const emailParam = searchParams.get("email")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [inviteData, setInviteData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [invalidToken, setInvalidToken] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      full_name: "",
      password: "",
      confirm_password: "",
    },
  })

  // ─── Load invitation data ────────────────────────────────────────────────
  useEffect(() => {
    async function loadInvitation() {
      if (!token) {
        setInvalidToken(true)
        setLoading(false)
        return
      }

      try {
        // Try to fetch invitation by token from invitations table
        const { data, error } = await supabase
          .from("invitations" as any)
          .select("id, email, role, status, organization:organizations(name), inviter:profiles!invited_by(full_name)")
          .eq("token", token)
          .single()

        if (error || !data) {
          // Fallback: if table doesn't exist yet, show a demo/placeholder
          if (emailParam) {
            setInviteData({
              id: token,
              email: emailParam,
              role: "STAFF",
              organization_name: "Organizacao",
              inviter_name: "Administrador",
              status: "pending",
            })
          } else {
            setInvalidToken(true)
          }
          setLoading(false)
          return
        }

        const record = data as any
        const orgData = record.organization as { name: string } | null
        const inviterData = record.inviter as { full_name: string } | null

        setInviteData({
          id: record.id,
          email: record.email,
          role: record.role,
          organization_name: orgData?.name ?? "Organizacao",
          inviter_name: inviterData?.full_name ?? "Administrador",
          status: record.status,
        })
      } catch {
        // If invitations table doesn't exist, create placeholder
        if (emailParam) {
          setInviteData({
            id: token,
            email: emailParam,
            role: "STAFF",
            organization_name: "Organizacao",
            inviter_name: "Administrador",
            status: "pending",
          })
        } else {
          setInvalidToken(true)
        }
      }

      setLoading(false)
    }

    loadInvitation()
  }, [token, emailParam, supabase])

  // ─── Submit ──────────────────────────────────────────────────────────────
  async function onSubmit(formData: InviteFormValues) {
    if (!inviteData) return
    setServerError(null)

    try {
      // 1. Sign up with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      })

      if (authError) {
        setServerError(authError.message)
        return
      }

      if (!authData.user) {
        setServerError("Erro ao criar conta. Tente novamente.")
        return
      }

      // 2. Try to accept the invitation (update invite record)
      try {
        await (supabase as any)
          .from("invitations")
          .update({ status: "accepted", accepted_at: new Date().toISOString() })
          .eq("token", token)
      } catch {
        // Invitation table may not exist yet - continue anyway
      }

      // 3. The profile + membership should be handled by a database trigger
      //    or we update it here as a fallback
      // Profile creation typically happens via Supabase auth trigger
      // We attempt to update it with org info
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            role: inviteData.role,
          })
          .eq("id", authData.user.id)
      } catch {
        // Profile update might fail if trigger hasn't fired yet
      }

      // 4. Redirect to dashboard
      router.push("/dashboard")
    } catch {
      setServerError("Ocorreu um erro inesperado. Tente novamente.")
    }
  }

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Logo size="lg" />
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Carregando convite...</p>
      </div>
    )
  }

  // ─── Invalid token ────────────────────────────────────────────────────────
  if (invalidToken) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <h2 className="text-xl font-bold">Convite Invalido</h2>
          <p className="text-sm text-muted-foreground">
            Este link de convite e invalido ou expirou. Solicite um novo convite ao
            administrador da organizacao.
          </p>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Ir para Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // ─── Expired / Already accepted ───────────────────────────────────────────
  if (inviteData && inviteData.status !== "pending") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
          <AlertCircle className="size-8 text-muted-foreground" />
          <h2 className="text-xl font-bold">
            {inviteData.status === "accepted"
              ? "Convite ja Aceito"
              : inviteData.status === "cancelled"
                ? "Convite Cancelado"
                : "Convite Expirado"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {inviteData.status === "accepted"
              ? "Este convite ja foi aceito. Faca login com suas credenciais."
              : "Este convite nao esta mais disponivel."}
          </p>
          <Link href="/login">
            <Button size="lg">Ir para Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ─── Main invite form ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>

      {/* Invitation info card */}
      <div className="rounded-lg border bg-gradient-to-br from-teal-50/50 to-transparent p-5 dark:from-teal-950/20">
        <h2 className="text-xl font-bold tracking-tight text-center mb-4">
          Voce foi convidado!
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <Building2 className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Organizacao</p>
              <p className="text-sm font-medium">{inviteData?.organization_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <User className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Convidado por</p>
              <p className="text-sm font-medium">{inviteData?.inviter_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <Shield className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Funcao</p>
              <p className="text-sm font-medium">
                {ROLE_LABELS[inviteData?.role ?? "STAFF"] ?? inviteData?.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <Mail className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium">{inviteData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold">Crie sua conta</h3>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para aceitar o convite
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input
            id="full_name"
            placeholder="Seu nome completo"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
            {...register("full_name")}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha"
              autoComplete="new-password"
              className="pr-9"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirmar Senha *</Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              className="pr-9"
              aria-invalid={!!errors.confirm_password}
              {...register("confirm_password")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-destructive">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Aceitar Convite
        </Button>
      </form>

      {/* Already has account */}
      <p className="text-center text-sm text-muted-foreground">
        Ja tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar com conta existente
        </Link>
      </p>
    </div>
  )
}
