//layout.tsx

import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Valluo - Gestão de Projetos e Precificação",
  description: "Plataforma completa para gestão de projetos e precificação para freelancers e agências",
  icons:{
    icon:'shared.png',
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="valluo-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
