"use client"

import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar()

  return (
    <main
      className={cn(
        "flex-1 p-4 sm:p-8 min-h-screen transition-all duration-300",
        expanded ? "lg:ml-64" : "lg:ml-20"
      )}
    >
      {children}
    </main>
  )
}
