"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Mail, CheckCircle2, UserPlus } from "lucide-react"

import { inviteUser } from "@/lib/services/invitations"
import type { Role } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ─── Schema ─────────────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().min(1, "E-mail e obrigatorio").email("Digite um e-mail valido"),
  role: z.enum(["MANAGER", "STAFF"], {
    error: "Selecione uma funcao",
  }),
  message: z.string().optional(),
})

type InviteFormValues = z.infer<typeof inviteSchema>

// ─── Props ──────────────────────────────────────────────────────────────────

interface InviteDialogProps {
  organizationId: string
  invitedBy: string
  /** If true, also shows ORG_ADMIN role option (only for super_admin) */
  showAdminRole?: boolean
  /** Callback after successful invitation */
  onInviteSent?: () => void
}

// ─── Role Options ───────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  {
    value: "MANAGER",
    label: "Gerente",
    description: "Pode gerenciar membros, notas e equipe",
  },
  {
    value: "STAFF",
    label: "Equipe",
    description: "Pode criar notas e gerenciar membros atribuidos",
  },
]

const ADMIN_ROLE_OPTION = {
  value: "ORG_ADMIN" as Role,
  label: "Administrador",
  description: "Acesso total a organizacao",
}

// ─── Component ──────────────────────────────────────────────────────────────

export function InviteDialog({
  organizationId,
  invitedBy,
  showAdminRole = false,
  onInviteSent,
}: InviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const roles = showAdminRole ? [ADMIN_ROLE_OPTION, ...ROLE_OPTIONS] : ROLE_OPTIONS

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "STAFF" as "MANAGER" | "STAFF",
      message: "",
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      // Reset state when closing
      setTimeout(() => {
        reset()
        setServerError(null)
        setSuccess(false)
        setSentEmail("")
      }, 200)
    }
  }

  async function onSubmit(data: InviteFormValues) {
    setServerError(null)

    const result = await inviteUser({
      email: data.email,
      role: data.role as Role,
      organizationId,
      invitedBy,
      message: data.message,
    })

    if (result.error) {
      setServerError(result.error)
      return
    }

    setSentEmail(data.email)
    setSuccess(true)
    onInviteSent?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <UserPlus className="size-4" />
            Convidar Membro
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        {success ? (
          /* ─── Success State ─── */
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <CheckCircle2 className="size-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-semibold">Convite Enviado!</h3>
              <p className="text-sm text-muted-foreground">
                Convite enviado para{" "}
                <span className="font-medium text-foreground">{sentEmail}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                O usuario recebera um link para aceitar o convite e criar sua conta.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="mt-2"
            >
              Fechar
            </Button>
          </div>
        ) : (
          /* ─── Invite Form ─── */
          <>
            <DialogHeader>
              <DialogTitle>Convidar Membro</DialogTitle>
              <DialogDescription>
                Envie um convite por e-mail para adicionar um novo membro a sua equipe.
              </DialogDescription>
            </DialogHeader>

            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="invite-email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colaborador@exemplo.com"
                    className="pl-9"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label>Funcao *</Label>
                <Select
                  value={watch("role")}
                  onValueChange={(val) => setValue("role", val as "MANAGER" | "STAFF")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma funcao" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Role description */}
                {watch("role") && (
                  <p className="text-xs text-muted-foreground">
                    {roles.find((r) => r.value === watch("role"))?.description}
                  </p>
                )}
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="invite-message">Mensagem (opcional)</Label>
                <Textarea
                  id="invite-message"
                  placeholder="Adicione uma mensagem pessoal ao convite..."
                  rows={3}
                  {...register("message")}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Enviar Convite
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
