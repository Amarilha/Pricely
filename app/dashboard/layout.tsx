import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/sidebar-provider"
import { Sidebar } from "@/components/sidebar"
import Script from 'next/script'
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard de Faturamento",
  description: "Dashboard para visualização de faturamentos de projetos",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6983643349322034"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <SidebarProvider>
        <div className="min-h-screen">
          <div className="flex">
            {/* Sidebar fixo */}
            <Sidebar />
            
            {/* Conteúdo principal com margem ajustável */}
            <main className={cn(
              "flex-1 p-8 min-h-screen transition-margin duration-300",
              "ml-20", // Margem padrão quando sidebar recolhido
              "lg:ml-64" // Margem quando sidebar expandido
            )}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}