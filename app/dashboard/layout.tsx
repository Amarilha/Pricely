import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/sidebar-provider"
import { Sidebar } from "@/components/sidebar"
import Script from 'next/script'

// No seu layout ou componente principal
<Script 
  strategy="lazyOnload"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3875072008507470"
  crossOrigin="anonymous"
/>

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
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
