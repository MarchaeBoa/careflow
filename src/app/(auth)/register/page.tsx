"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    organizationName: z.string().min(1, "Nome da organização é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("Digite um e-mail válido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Por favor, confirme sua senha"),
    agreeTerms: z.literal(true, {
      message: "Você deve aceitar os Termos de Serviço",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: "Fraca", color: "bg-red-500", width: "w-1/3" }
  if (score <= 2) return { label: "Média", color: "bg-amber-500", width: "w-2/3" }
  return { label: "Forte", color: "bg-emerald-500", width: "w-full" }
}

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "Pelo menos 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Uma letra maiúscula" },
  { test: (p: string) => /[0-9]/.test(p), label: "Um número" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "Um caractere especial" },
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false as unknown as true,
    },
  })

  const passwordValue = watch("password")
  const strength = useMemo(() => getPasswordStrength(passwordValue || ""), [passwordValue])

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          organization_name: data.organizationName,
        },
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    router.push("/login?registered=true")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center lg:justify-start">
        <Logo size="lg" />
      </div>

      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Crie sua conta</h2>
        <p className="text-sm text-muted-foreground">
          Comece a gerenciar o cuidado com o CareFlow
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <Label htmlFor="organizationName">Nome da Organização</Label>
          <Input
            id="organizationName"
            placeholder="Acme Healthcare"
            aria-invalid={!!errors.organizationName}
            {...register("organizationName")}
          />
          {errors.organizationName && (
            <p className="text-xs text-destructive">{errors.organizationName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha forte"
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
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {/* Strength indicator */}
          {passwordValue && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {strength.label}
                </span>
              </div>
              <ul className="grid gap-1">
                {passwordRules.map((rule) => {
                  const pass = rule.test(passwordValue)
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        pass ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      }`}
                    >
                      {pass ? <Check className="size-3" /> : <X className="size-3" />}
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              className="pr-9"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={watch("agreeTerms") === true}
            onCheckedChange={(checked) =>
              setValue("agreeTerms", checked === true ? true : (false as unknown as true), {
                shouldValidate: true,
              })
            }
            className="mt-0.5"
          />
          <span className="text-muted-foreground">
            Eu concordo com os{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Termos de Serviço
            </Link>{" "}
            e a{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </Link>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="-mt-2 text-xs text-destructive">{errors.agreeTerms.message}</p>
        )}

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Criar Conta
        </Button>
      </form>

      {/* Sign-in link */}
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
