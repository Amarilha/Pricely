import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/sidebar-provider"
import { Sidebar } from "@/components/sidebar"
import Script from 'next/script'
import { cn } from "@/lib/utils"
import {AdSense} from "@/components/AdSense"
import { DashboardMain } from "@/components/dashboard-main"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexprice - Gestão de Projetos e Precificação",
  description: "Plataforma completa para gestão de projetos e precificação para freelancers e agências",
  icons:{
 icon:'/nexprice-logo-branco-sem-texto.png',
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
        
        <div className="flex">
          {/* Sidebar fixo */}
          <Sidebar />
          
          {/* Conteúdo principal com margem ajustável */}
          <DashboardMain>
            {children}
          </DashboardMain>
        </div>

      </div>
    </SidebarProvider>
  )
};