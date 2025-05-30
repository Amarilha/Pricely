import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-background dark:from-primary/20 dark:to-background z-0" />

      <div className="container relative z-10 py-20 md:py-32 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-background">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-1"></span>
                Novo: Consultor IA para seus projetos
              </div>
            </div>
            <h1 className="text-4xl  text-primary-foreground md:text-5xl lg:text-6xl font-bold tracking-tight">
              Gerencie projetos e precifique com precisão
            </h1>
            <p className="text-xl text-primary-foreground">
              Nexprice é a plataforma completa para freelancers e agências gerenciarem projetos, calcularem preços justos
              e aumentarem a lucratividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastro">
                <Button size="lg" className="bg-primary hover:bg-primary/90 hover:text-primary-foreground">
                  Começar Grátis
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Ver Recursos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
          </div>

          <div className="relative">
            <div className="relative rounded-lg border bg-background p-2 shadow-lg">
              <div className="rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=600&width=800" alt="Dashboard Nexprice" className="w-full h-auto" />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-lg border bg-background p-4 shadow-lg hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">+</span>
                </div>
                <div>
                  <p className="font-medium">Aumento de produtividade</p>
                  <p className="text-green-600 font-bold">+35%</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 rounded-lg border bg-background p-4 shadow-lg hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">$</span>
                </div>
                <div>
                  <p className="font-medium">Aumento de faturamento</p>
                  <p className="text-blue-600 font-bold">+28%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
