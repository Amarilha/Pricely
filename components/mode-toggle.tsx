"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação usando useEffect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para aplicar o tema escuro em toda a página
  const applyDarkTheme = () => {
    setTheme("dark")
    // Forçar a aplicação do tema escuro
    document.documentElement.classList.add("dark")
    document.documentElement.style.colorScheme = "dark"
  }

  // Função para aplicar o tema claro em toda a página
  const applyLightTheme = () => {
    setTheme("light")
    // Forçar a aplicação do tema claro
    document.documentElement.classList.remove("dark")
    document.documentElement.style.colorScheme = "light"
  }

  // Função para aplicar o tema do sistema
  const applySystemTheme = () => {
    setTheme("system")
    // O next-themes vai gerenciar automaticamente com base na preferência do sistema
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={applyLightTheme} className={theme === "light" ? "bg-accent" : ""}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={applyDarkTheme} className={theme === "dark" ? "bg-accent" : ""}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={applySystemTheme} className={theme === "system" ? "bg-accent" : ""}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
