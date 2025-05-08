import type { Metadata } from "next"
import { PartnersShowcase } from "@/components/site/partners-showcase"
import { PartnershipForm } from "@/components/site/partnership-form"
import { PartnershipBenefits } from "@/components/site/partnership-benefits"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Parceiros | Valluo",
  description: "Conheça nossos parceiros e saiba como se tornar um parceiro Valluo",
}

export default function ParceirosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Parceiros</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça nossos parceiros e saiba como fazer parte do nosso ecossistema
            </p>
          </div>

          <PartnersShowcase />

          <div className="my-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Torne-se um Parceiro</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Junte-se ao nosso programa de parceiros e cresça seu negócio com a Valluo
              </p>
            </div>

            <PartnershipBenefits />
            <PartnershipForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
