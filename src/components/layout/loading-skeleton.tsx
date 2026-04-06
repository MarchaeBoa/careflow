import { Skeleton } from "@/components/ui/skeleton"

/**
 * Full-screen dashboard loading skeleton.
 * Mimics the sidebar + topbar + content layout with animated shimmer.
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Sidebar skeleton */}
      <div className="hidden w-[260px] flex-col border-r border-border/60 bg-card md:flex">
        {/* Logo area */}
        <div className="flex items-center gap-3 border-b border-border/40 px-4 py-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 opacity-60" />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-1 flex-col gap-1.5 px-3 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Skeleton
                className="h-5 w-5 shrink-0 rounded"
                style={{ animationDelay: `${i * 80}ms` }}
              />
              <Skeleton
                className="h-4 rounded"
                style={{
                  width: `${60 + ((i * 17) % 40)}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            </div>
          ))}

          {/* Separator */}
          <div className="my-3 h-px bg-border/40" />

          {/* Admin section */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`admin-${i}`} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Skeleton
                className="h-5 w-5 shrink-0 rounded"
                style={{ animationDelay: `${(i + 8) * 80}ms` }}
              />
              <Skeleton
                className="h-4 rounded"
                style={{
                  width: `${50 + ((i * 13) % 30)}%`,
                  animationDelay: `${(i + 8) * 80}ms`,
                }}
              />
            </div>
          ))}
        </div>

        {/* User section */}
        <div className="border-t border-border/40 p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32 opacity-60" />
            </div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-4 lg:px-6">
          <Skeleton className="h-4 w-20" />
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Greeting */}
          <div className="mb-6 flex flex-col gap-1.5">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48 opacity-60" />
          </div>

          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" style={{ animationDelay: `${i * 100}ms` }} />
                  <Skeleton className="h-8 w-8 rounded-lg" style={{ animationDelay: `${i * 100}ms` }} />
                </div>
                <Skeleton className="mt-3 h-8 w-16" style={{ animationDelay: `${i * 100}ms` }} />
                <Skeleton className="mt-2 h-3 w-24 opacity-60" style={{ animationDelay: `${i * 100}ms` }} />
              </div>
            ))}
          </div>

          {/* Chart placeholders */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card p-5">
                <Skeleton className="mb-4 h-5 w-32" />
                <Skeleton className="h-48 rounded-lg opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
