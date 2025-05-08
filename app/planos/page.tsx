import type { Metadata } from "next"
import { PricingPlans } from "@/components/site/pricing-plans"
import { PricingFAQ } from "@/components/site/pricing-faq"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Planos | Valluo",
  description: "Conheça os planos disponíveis para a plataforma Valluo",
}

export default function PlanosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Planos e Preços</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio e comece a gerenciar seus projetos de forma eficiente
            </p>
          </div>
          <PricingPlans />
          <PricingFAQ />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
