"use client"

import { useState } from "react"
import {
  Building2,
  Users,
  CreditCard,
  Settings2,
  Shield,
  Upload,
  Plus,
  MoreHorizontal,
  Trash2,
  Sparkles,
  Globe,
  Clock,
  Bell,
  BellRing,
  MessageSquare,
  Mail,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Laptop,
  RotateCcw,
  CalendarClock,
  Check,
} from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// ─── Mock Data ─────────────────────────────────────────────────────

const teamMembers = [
  { name: "Sarah Johnson", email: "sarah@careflow.com", role: "Admin", initials: "SJ", status: "active", lastActive: "2 horas atrás" },
  { name: "Mike Chen", email: "mike@careflow.com", role: "Manager", initials: "MC", status: "active", lastActive: "30 min atrás" },
  { name: "Emily Davis", email: "emily@careflow.com", role: "Staff", initials: "ED", status: "active", lastActive: "1 hora atrás" },
  { name: "David Kim", email: "david@careflow.com", role: "Manager", initials: "DK", status: "active", lastActive: "5 horas atrás" },
  { name: "Lisa Park", email: "lisa@careflow.com", role: "Staff", initials: "LP", status: "active", lastActive: "3 horas atrás" },
  { name: "Tom Wright", email: "tom@careflow.com", role: "Staff", initials: "TW", status: "invited", lastActive: "Pendente" },
]

const roleLabels: Record<string, string> = {
  Admin: "Administrador",
  Manager: "Gerente",
  Staff: "Equipe",
}

const roleStyles: Record<string, string> = {
  Admin: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  Manager: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Staff: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
}

const activeSessions = [
  { browser: "Chrome no Windows", location: "Springfield, IL", lastActive: "Sessão atual", icon: Laptop, current: true },
  { browser: "Safari no iPhone 15", location: "Springfield, IL", lastActive: "2 horas atrás", icon: Smartphone, current: false },
  { browser: "Firefox no MacBook", location: "Chicago, IL", lastActive: "1 dia atrás", icon: Laptop, current: false },
]

const planFeatures = [
  "Até 2.000 atendidos",
  "25 contas de equipe",
  "10 GB de armazenamento",
  "Suporte prioritário por e-mail",
  "Relatórios avançados",
  "Planos de cuidado personalizados",
]

// ─── Page ──────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization")
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [notifDigest, setNotifDigest] = useState(true)
  const [theme, setTheme] = useState("system")
  const [twoFactor, setTwoFactor] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie sua organização, equipe, faturamento e preferências"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="organization">
            <Building2 size={14} />
            Organização
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users size={14} />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard size={14} />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings2 size={14} />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield size={14} />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* ─── Organization Tab ─────────────────────────────────── */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Organização</CardTitle>
              <CardDescription>Atualize o perfil e informações de contato da organização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="orgName">Nome da Organização</Label>
                  <Input id="orgName" defaultValue="CareFlow Health Services" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="orgSlug">Slug</Label>
                  <Input id="orgSlug" defaultValue="careflow-health" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="orgDescription">Descrição</Label>
                <Textarea
                  id="orgDescription"
                  rows={3}
                  defaultValue="A modern care management platform providing high-quality support services for individuals and families across the region."
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-1.5">
                <Label>Logotipo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-teal-950/20">
                    <Upload size={24} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Clique para enviar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG até 2MB. Recomendado 256x256px.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Endereço</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="street">Endereço</Label>
                  <Input id="street" defaultValue="123 Care Street" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" defaultValue="Springfield" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" defaultValue="IL" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="62701" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Contato</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(217) 555-0142" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="info@careflow.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://careflow.com" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Team Tab ─────────────────────────────────────────── */}
        <TabsContent value="team">
          <div className="space-y-4">
            {/* Invite Form */}
            <Card>
              <CardHeader>
                <CardTitle>Convidar Membro da Equipe</CardTitle>
                <CardDescription>Envie um convite para ingressar na organização</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input placeholder="Endereço de e-mail" className="flex-1" />
                  <Select defaultValue="staff">
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Equipe</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="shrink-0">
                    <Plus size={16} data-icon="inline-start" />
                    Enviar Convite
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Table */}
            <Card>
              <CardHeader>
                <CardTitle>Equipe Atual</CardTitle>
                <CardDescription>{teamMembers.length} membros na organização</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Membro</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">E-mail</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Função</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Último Acesso</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.email}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{member.email}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[member.role] || ""}`}>
                            {roleLabels[member.role] || member.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            member.status === "active"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              member.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                            }`} />
                            {member.status === "active" ? "Ativo" : "Convidado"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{member.lastActive}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button variant="ghost" size="icon-xs">
                                <MoreHorizontal size={14} />
                              </Button>
                            } />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Shield size={14} />Alterar Função</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive"><Trash2 size={14} />Remover</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Billing Tab ──────────────────────────────────────── */}
        <TabsContent value="billing">
          <div className="space-y-4">
            {/* Current Plan */}
            <Card className="border-teal-200/50 dark:border-teal-900/30">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">Plano Profissional</h3>
                      <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                        Atual
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      $79<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <ul className="space-y-1.5">
                      {planFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check size={14} className="shrink-0 text-teal-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-xs text-muted-foreground">Próxima cobrança: 1 de maio, 2026</p>
                    <Button variant="outline" size="sm">Gerenciar Assinatura</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Uso</CardTitle>
                <CardDescription>Uso de recursos no período de faturamento atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Atendidos</span>
                    <span className="text-muted-foreground">1,247 / 2,000</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Usuários</span>
                    <span className="text-muted-foreground">12 / 25</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Armazenamento</span>
                    <span className="text-muted-foreground">4.2 GB / 10 GB</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            <Card className="bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-900/50 dark:to-teal-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      <h3 className="text-lg font-bold text-foreground">Upgrade para Enterprise</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Atendidos ilimitados, suporte prioritário, integrações personalizadas, SSO e gerente de conta dedicado.
                    </p>
                  </div>
                  <Button className="shrink-0 bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md hover:from-teal-700 hover:to-teal-600">
                    Upgrade para Enterprise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Preferences Tab ──────────────────────────────────── */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Personalize sua experiência e configurações de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Globe size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Idioma</p>
                    <p className="text-xs text-muted-foreground">Selecione seu idioma preferido</p>
                  </div>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Timezone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Clock size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Fuso Horário</p>
                    <p className="text-xs text-muted-foreground">Defina seu fuso horário local</p>
                  </div>
                </div>
                <Select defaultValue="America/New_York">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="America/Sao_Paulo">Sao Paulo (BRT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Date Format */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <CalendarClock size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Formato de Data</p>
                    <p className="text-xs text-muted-foreground">Escolha como as datas são exibidas</p>
                  </div>
                </div>
                <Select defaultValue="mm/dd/yyyy">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Notificações</h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Mail size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Notificações por E-mail</p>
                      <p className="text-xs text-muted-foreground">Receba atualizações por e-mail</p>
                    </div>
                  </div>
                  <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Bell size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Notificações Push</p>
                      <p className="text-xs text-muted-foreground">Receba notificações push no navegador</p>
                    </div>
                  </div>
                  <Switch checked={notifPush} onCheckedChange={setNotifPush} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MessageSquare size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Notificações por SMS</p>
                      <p className="text-xs text-muted-foreground">Receba alertas críticos por SMS</p>
                    </div>
                  </div>
                  <Switch checked={notifSms} onCheckedChange={setNotifSms} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <BellRing size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Resumo Semanal</p>
                      <p className="text-xs text-muted-foreground">Resumo de atividades toda segunda-feira</p>
                    </div>
                  </div>
                  <Switch checked={notifDigest} onCheckedChange={setNotifDigest} />
                </div>
              </div>

              <Separator />

              {/* Theme */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Tema</h3>
                <div className="flex gap-3">
                  {[
                    { value: "system", label: "Sistema", icon: Monitor },
                    { value: "light", label: "Claro", icon: Sun },
                    { value: "dark", label: "Escuro", icon: Moon },
                  ].map((opt) => {
                    const OptIcon = opt.icon
                    const isActive = theme === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all
                          ${isActive
                            ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400"
                            : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                          }
                        `}
                      >
                        <OptIcon size={16} />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button>Salvar Preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Security Tab ─────────────────────────────────────── */}
        <TabsContent value="security">
          <div className="space-y-4">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Atualize a senha da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" placeholder="Digite a senha atual" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" placeholder="Digite a nova senha" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
                  </div>
                </div>
                <div className="flex justify-start pt-1">
                  <Button>Atualizar Senha</Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor Auth */}
            <Card>
              <CardHeader>
                <CardTitle>Autenticação em Dois Fatores</CardTitle>
                <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Shield size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {twoFactor ? "Ativada" : "Desativada"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {twoFactor
                          ? "Sua conta está protegida com 2FA"
                          : "Ative o 2FA para maior segurança"
                        }
                      </p>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>Gerencie dispositivos onde você está conectado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeSessions.map((session, i) => {
                  const SessionIcon = session.icon
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <SessionIcon size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {session.browser}
                            {session.current && (
                              <span className="ml-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                Atual
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} &middot; {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20">
                          Revogar
                        </Button>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>Gerencie o acesso à API para integrações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border/60 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Key size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-foreground">
                          {showApiKey ? "cf_live_sk_a1b2c3d4e5f6g7h8i9j0" : "cf_live_sk_**********************"}
                        </p>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Criada em: 15 jan, 2026</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw size={14} />
                    Regenerar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
