import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/sidebar-provider"
import { Sidebar } from "@/components/sidebar"
import Script from 'next/script'
import { cn } from "@/lib/utils"
import {AdSense} from "@/components/AdSense"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard de Faturamento",
  description: "Dashboard para visualização de faturamentos de projetos",
  icons:{
    icon:'nexprice.jpeg',
  },
}

export const viewport: Viewport = {
  themeColor: "dark",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <AdSense pId="6983643349322034" />
        
        <div className="flex">
          {/* Sidebar fixo */}
          <Sidebar />
          
          {/* Conteúdo principal com margem ajustável */}
          <main className={cn(
            "flex-1 p-8 min-h-screen transition-margin duration-300",
            "ml-20", // Margem padrão quando sidebar recolhido
            "lg:ml-64" // Margem quando sidebar expandido (ajuste conforme necessário)
          )}>
            {children}
          </main>
        </div>

      </div>
    </SidebarProvider>
  )
};