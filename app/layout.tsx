//layout.tsx

import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import {AdSense} from "@/components/AdSense"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexprice - Gestão de Projetos e Precificação",
  description: "Plataforma completa para gestão de projetos e precificação para freelancers e agências",
  icons:{
    icon:'nexprice.jpeg',
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <AdSense pId="6983643349322034" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="Nexprice-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
