"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdsBannerProps {
  position?: "top" | "bottom" | "sidebar"
  className?: string
  adSlot?: string
}

export function AdsBanner({ 
  position = "top", 
  className,
  adSlot = "1469366432" 
}: AdsBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const isLocalhost = () => 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1')

  useEffect(() => {
    if (typeof window === 'undefined' || isLocalhost()) {
      console.log('[DEV] AdsBanner carregado (modo de desenvolvimento)')
      setScriptLoaded(true)
      return
    }

    if ((window as any).adsbygoogle) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6983643349322034'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.onload = () => setScriptLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (scriptLoaded && !dismissed && !isLocalhost()) {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (e) {
        console.error("AdSense error:", e)
      }
    }
  }, [scriptLoaded, dismissed])

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
        {isLocalhost() ? (
          <div className="bg-yellow-100 border border-yellow-400 p-4 mb-4 w-full">
            <p className="text-yellow-700 text-sm">[Modo Desenvolvimento]</p>
            <div className="h-[90px] w-full bg-gray-200 flex items-center justify-center">
              Mock de Anúncio (300x250)
            </div>
          </div>
        ) : (
          <div className="mt-4 w-full min-h-[90px]">
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6983643349322034"
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        )}
        
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
            <div className="h-8 w-8 rounded bg-primary dark:bg-primary/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">AD</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium">Aumente sua produtividade com Nexprice Pro</p>
              <p className="text-xs text-muted-foreground">Acesso a recursos premium por apenas R$49/mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}