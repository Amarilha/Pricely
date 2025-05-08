"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdsBannerProps {
  position?: "top" | "bottom" | "sidebar"
  className?: string
}

export function AdsBanner({ position = "top", className }: AdsBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div
      className={cn(
        "relative bg-muted p-4 text-center text-sm",
        position === "top" && "w-full border-b",
        position === "bottom" && "w-full border-t",
        position === "sidebar" && "rounded-lg border mb-4",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 opacity-70 hover:opacity-100"
        onClick={() => setDismissed(true)}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Fechar</span>
      </Button>
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="font-medium">Você está usando o plano gratuito</p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Anúncio</span>
          <span>•</span>
          <a href="/planos" className="underline underline-offset-4 hover:text-foreground">
            Fazer upgrade para remover anúncios
          </a>
        </div>
        <div className="mt-2 w-full max-w-md rounded bg-background p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xs">AD</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium">Aumente sua produtividade com Valluo Pro</p>
              <p className="text-xs text-muted-foreground">Acesso a recursos premium por apenas R$49/mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
