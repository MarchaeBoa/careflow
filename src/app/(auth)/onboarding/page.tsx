"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Building2, MapPin, LayoutGrid, Check } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/shared/logo"
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

// ─── Schemas ────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minusculas, numeros e hifens"
    ),
  description: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("URL invalida").optional().or(z.literal("")),
})

const step2Schema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  timezone: z.string().min(1, "Selecione um fuso horario"),
  language: z.string().min(1, "Selecione um idioma"),
})

const step3Schema = z.object({
  unit_name: z.string().min(2, "Nome da unidade deve ter pelo menos 2 caracteres"),
  unit_address: z.string().optional(),
  unit_phone: z.string().optional(),
  morning_start: z.string().optional(),
  morning_end: z.string().optional(),
  afternoon_start: z.string().optional(),
  afternoon_end: z.string().optional(),
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>
type Step3Values = z.infer<typeof step3Schema>

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasilia (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Belem", label: "Belem (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "Recife (GMT-3)" },
  { value: "America/Cuiaba", label: "Cuiaba (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
  { value: "America/Chicago", label: "Chicago (GMT-6)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
  { value: "Europe/London", label: "Londres (GMT+0)" },
  { value: "Europe/Lisbon", label: "Lisboa (GMT+0)" },
]

const LANGUAGES = [
  { value: "pt-BR", label: "Portugues (Brasil)" },
  { value: "en", label: "English" },
]

// ─── Step Indicator ─────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Organizacao", icon: Building2 },
  { number: 2, label: "Endereco", icon: MapPin },
  { number: 3, label: "Unidade", icon: LayoutGrid },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number
        const isActive = currentStep === step.number
        const Icon = step.icon

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isCompleted
                    ? "border-teal-500 bg-teal-500 text-white"
                    : isActive
                      ? "border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-950"
                      : "border-muted-foreground/30 bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-6 h-0.5 w-12 transition-colors duration-300 ${
                  currentStep > step.number ? "bg-teal-500" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Step 1 form
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      phone: "",
      website: "",
    },
  })

  // Step 2 form
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      timezone: "America/Sao_Paulo",
      language: "pt-BR",
    },
  })

  // Step 3 form
  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      unit_name: "Unidade Principal",
      unit_address: "",
      unit_phone: "",
      morning_start: "08:00",
      morning_end: "12:00",
      afternoon_start: "13:00",
      afternoon_end: "17:00",
    },
  })

  // Auto-generate slug from name
  function handleNameChange(value: string) {
    step1Form.setValue("name", value)
    if (!step1Form.getValues("slug") || step1Form.getValues("slug") === slugify(step1Form.getValues("name"))) {
      step1Form.setValue("slug", slugify(value))
    }
  }

  async function handleStep1Next() {
    const valid = await step1Form.trigger()
    if (valid) setCurrentStep(2)
  }

  async function handleStep2Next() {
    const valid = await step2Form.trigger()
    if (valid) setCurrentStep(3)
  }

  async function handleFinish() {
    const valid = await step3Form.trigger()
    if (!valid) return

    setServerError(null)
    setIsCreating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setServerError("Sessao expirada. Faca login novamente.")
        setIsCreating(false)
        return
      }

      const s1 = step1Form.getValues()
      const s2 = step2Form.getValues()
      const s3 = step3Form.getValues()

      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: s1.name,
          slug: s1.slug,
          owner_id: user.id,
          settings: {
            timezone: s2.timezone,
            date_format: "dd/MM/yyyy",
            default_locale: s2.language,
            description: s1.description || null,
            phone: s1.phone || null,
            website: s1.website || null,
            address: {
              street: s2.street || null,
              city: s2.city || null,
              state: s2.state || null,
              zip: s2.zip || null,
            },
            features: {
              medications_enabled: true,
              life_plans_enabled: true,
              attendance_enabled: true,
              resources_enabled: true,
              appointments_enabled: true,
            },
            branding: {
              primary_color: "#14b8a6",
              accent_color: "#0d9488",
            },
          },
        })
        .select()
        .single()

      if (orgError) {
        setServerError(orgError.message)
        setIsCreating(false)
        return
      }

      // 2. Update user profile with organization_id and role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          organization_id: org.id,
          role: "ORG_ADMIN",
        })
        .eq("id", user.id)

      if (profileError) {
        setServerError(profileError.message)
        setIsCreating(false)
        return
      }

      // 3. Create first organization unit (attendance_locations)
      const { error: unitError } = await supabase
        .from("attendance_locations")
        .insert({
          organization_id: org.id,
          name: s3.unit_name,
          address: s3.unit_address || null,
          is_active: true,
        })

      if (unitError) {
        setServerError(unitError.message)
        setIsCreating(false)
        return
      }

      // 4. Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setServerError("Ocorreu um erro inesperado. Tente novamente.")
      setIsCreating(false)
    }
  }

  const progressValue =
    currentStep === 1 ? 0 : currentStep === 2 ? 33 : currentStep === 3 ? 66 : 100

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Step 1 - Sobre sua Organizacao */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Sobre sua Organizacao
            </h2>
            <p className="text-sm text-muted-foreground">
              Conte-nos sobre sua organizacao para configurar seu espaco de trabalho
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleStep1Next()
            }}
            className="flex flex-col gap-4"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Organizacao *</Label>
              <Input
                id="name"
                placeholder="Ex: Casa de Cuidado Esperanca"
                {...step1Form.register("name", {
                  onChange: (e) => handleNameChange(e.target.value),
                })}
                aria-invalid={!!step1Form.formState.errors.name}
              />
              {step1Form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Identificador (slug) *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">careflow.app/</span>
                <Input
                  id="slug"
                  placeholder="minha-organizacao"
                  className="flex-1"
                  {...step1Form.register("slug")}
                  aria-invalid={!!step1Form.formState.errors.slug}
                />
              </div>
              {step1Form.formState.errors.slug && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.slug.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descricao</Label>
              <Textarea
                id="description"
                placeholder="Breve descricao da organizacao..."
                rows={3}
                {...step1Form.register("description")}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                {...step1Form.register("phone")}
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://www.exemplo.com.br"
                {...step1Form.register("website")}
              />
              {step1Form.formState.errors.website && (
                <p className="text-xs text-destructive">
                  {step1Form.formState.errors.website.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
              Proximo
            </Button>
          </form>
        </div>
      )}

      {/* Step 2 - Endereco e Configuracoes */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Endereco e Configuracoes
            </h2>
            <p className="text-sm text-muted-foreground">
              Defina o endereco e preferencias da sua organizacao
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleStep2Next()
            }}
            className="flex flex-col gap-4"
          >
            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="street">Rua / Logradouro</Label>
              <Input
                id="street"
                placeholder="Rua das Flores, 123"
                {...step2Form.register("street")}
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Sao Paulo"
                  {...step2Form.register("city")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  {...step2Form.register("state")}
                />
              </div>
            </div>

            {/* ZIP */}
            <div className="space-y-2">
              <Label htmlFor="zip">CEP</Label>
              <Input
                id="zip"
                placeholder="01000-000"
                {...step2Form.register("zip")}
              />
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label>Fuso Horario *</Label>
              <Select
                value={step2Form.watch("timezone")}
                onValueChange={(val) => val && step2Form.setValue("timezone", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o fuso horario" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {step2Form.formState.errors.timezone && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.timezone.message}
                </p>
              )}
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Idioma *</Label>
              <Select
                value={step2Form.watch("language")}
                onValueChange={(val) => val && step2Form.setValue("language", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {step2Form.formState.errors.language && (
                <p className="text-xs text-destructive">
                  {step2Form.formState.errors.language.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setCurrentStep(1)}
              >
                Voltar
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Proximo
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3 - Primeira Unidade */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Primeira Unidade
            </h2>
            <p className="text-sm text-muted-foreground">
              Crie sua primeira unidade de atendimento para comecar
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleFinish()
            }}
            className="flex flex-col gap-4"
          >
            {/* Unit Name */}
            <div className="space-y-2">
              <Label htmlFor="unit_name">Nome da Unidade *</Label>
              <Input
                id="unit_name"
                placeholder="Ex: Unidade Principal"
                {...step3Form.register("unit_name")}
                aria-invalid={!!step3Form.formState.errors.unit_name}
              />
              {step3Form.formState.errors.unit_name && (
                <p className="text-xs text-destructive">
                  {step3Form.formState.errors.unit_name.message}
                </p>
              )}
            </div>

            {/* Unit Address */}
            <div className="space-y-2">
              <Label htmlFor="unit_address">Endereco da Unidade</Label>
              <Input
                id="unit_address"
                placeholder="Rua, numero, bairro"
                {...step3Form.register("unit_address")}
              />
            </div>

            {/* Unit Phone */}
            <div className="space-y-2">
              <Label htmlFor="unit_phone">Telefone da Unidade</Label>
              <Input
                id="unit_phone"
                placeholder="(11) 3333-4444"
                {...step3Form.register("unit_phone")}
              />
            </div>

            {/* Operating Hours */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Horario de Funcionamento</Label>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                {/* Morning */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Manha
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="morning_start" className="text-xs">
                        Inicio
                      </Label>
                      <Input
                        id="morning_start"
                        type="time"
                        {...step3Form.register("morning_start")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="morning_end" className="text-xs">
                        Fim
                      </Label>
                      <Input
                        id="morning_end"
                        type="time"
                        {...step3Form.register("morning_end")}
                      />
                    </div>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tarde
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="afternoon_start" className="text-xs">
                        Inicio
                      </Label>
                      <Input
                        id="afternoon_start"
                        type="time"
                        {...step3Form.register("afternoon_start")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="afternoon_end" className="text-xs">
                        Fim
                      </Label>
                      <Input
                        id="afternoon_end"
                        type="time"
                        {...step3Form.register("afternoon_end")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setCurrentStep(2)}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isCreating}
              >
                {isCreating && <Loader2 className="size-4 animate-spin" />}
                Concluir
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
