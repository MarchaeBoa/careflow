"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  FileText,
  CalendarCheck,
  Pill,
  Target,
  FolderOpen,
  AlertTriangle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// ─── Mock Data ─────────────────────────────────────────────────────

const member = {
  id: "m1",
  name: "James Wilson",
  initials: "JW",
  status: "active" as const,
  dob: "March 15, 1958",
  age: 68,
  gender: "Male",
  phone: "(555) 200-1001",
  email: "james.wilson@email.com",
  address: "123 Oak Street, Springfield, IL 62701",
  nhsNumber: "NHS-9283-7461",
  keyWorker: "Sarah Johnson",
  tags: ["Diabetes", "Mobility Support", "Weekly Review"],
}

const emergencyContacts = [
  { name: "Mary Wilson", relationship: "Spouse", phone: "(555) 100-2001", email: "mary.w@email.com", primary: true },
  { name: "Tom Wilson", relationship: "Son", phone: "(555) 100-2002", email: "tom.w@email.com", primary: false },
]

const diagnoses = [
  { code: "E11.9", description: "Type 2 Diabetes Mellitus", diagnosedAt: "Jan 2015", diagnosedBy: "Dr. Patel" },
  { code: "M54.5", description: "Low Back Pain", diagnosedAt: "Mar 2020", diagnosedBy: "Dr. Smith" },
  { code: "I10", description: "Essential Hypertension", diagnosedAt: "Jun 2018", diagnosedBy: "Dr. Patel" },
]

const recentNotes = [
  { id: "n1", date: "Apr 5, 2026", author: "Sarah Johnson", content: "Weekly review completed. James is responding well to the new exercise program. Blood sugar levels have been stable.", status: "approved" },
  { id: "n2", date: "Apr 2, 2026", author: "Mike Chen", content: "Medication review scheduled with Dr. Patel for next week. Current medications are well tolerated.", status: "approved" },
  { id: "n3", date: "Mar 28, 2026", author: "Emily Davis", content: "Social activity participation: James attended the community garden session and expressed interest in continued participation.", status: "pending" },
]

const attendanceData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.random() > 0.15 ? 1 : 0,
}))

// ─── Page ──────────────────────────────────────────────────────────

export default function MemberDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const noteStatusColor: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400",
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/members">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={16} data-icon="inline-start" />
          Back to Members
        </Button>
      </Link>

      {/* Member Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar size="lg" className="!size-16">
          <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                member.status === "active"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400"
              }`}
            >
              {member.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            DOB: {member.dob} (Age {member.age}) &bull; {member.gender} &bull; Key Worker: {member.keyWorker}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {member.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText size={14} data-icon="inline-start" />
            Add Note
          </Button>
          <Button size="sm">Edit Profile</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="life-plan">Life Plan</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={16} className="text-teal-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span>{member.address}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NHS Number</span>
                  <span className="font-medium">{member.nhsNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium">{member.gender}</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-orange-500" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((contact, i) => (
                  <div key={i} className="rounded-lg border border-border/60 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{contact.name}</span>
                      {contact.primary && (
                        <span className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 rounded-full px-2 py-0.5 font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone size={10} />{contact.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={10} />{contact.email}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {diagnoses.map((dx, i) => (
                  <div key={i} className="flex items-start justify-between rounded-lg border border-border/60 p-3">
                    <div>
                      <p className="text-sm font-medium">{dx.description}</p>
                      <p className="text-xs text-muted-foreground">Code: {dx.code} &bull; {dx.diagnosedBy}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{dx.diagnosedAt}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={16} className="text-teal-600" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentNotes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-border/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{note.date} &bull; {note.author}</span>
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${noteStatusColor[note.status] || ""}`}>
                        {note.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{note.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-teal-600" />
                  Attendance - Last 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => (v === 1 ? "P" : "A")} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <RechartsTooltip
                        formatter={(value) => [Number(value) === 1 ? "Present" : "Absent", "Status"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" fill="#14b8a6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p>Full notes history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <CalendarCheck size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p>Full attendance records will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Pill size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p>Medication management will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Life Plan Tab */}
        <TabsContent value="life-plan">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Target size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p>Life plan goals and milestones will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FolderOpen size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p>Documents and uploads will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
