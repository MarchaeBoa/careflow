"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const forgotSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("Digite um e-mail válido"),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: ForgotFormValues) {
    setServerError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    setSuccess(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center lg:justify-start">
        <Logo size="lg" />
      </div>

      {success ? (
        /* Success state */
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Verifique seu e-mail</h2>
            <p className="text-sm text-muted-foreground">
              Enviamos um link de redefinição de senha para o seu e-mail. Por favor, verifique
              sua caixa de entrada e siga as instruções.
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline" size="lg" className="mt-2">
              <ArrowLeft className="size-4" />
              Voltar ao login
            </Button>
          </Link>
        </div>
      ) : (
        /* Form state */
        <>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Redefinir sua senha</h2>
            <p className="text-sm text-muted-foreground">
              Digite o e-mail associado à sua conta e enviaremos um link para redefinir
              sua senha.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Enviar Link de Redefinição
            </Button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Voltar ao login
          </Link>
        </>
      )}
    </div>
  )
}
