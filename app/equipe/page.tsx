import type { Metadata } from "next"
import { TeamMembers } from "@/components/site/team-members"
import { CompanyValues } from "@/components/site/company-values"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Equipe | Valluo",
  description: "Conheça a equipe por trás da plataforma Valluo",
}

export default function EquipePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Nossa Equipe</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça as pessoas que trabalham para tornar a Valluo a melhor plataforma de gestão de projetos
            </p>
          </div>

          <TeamMembers />
          <CompanyValues />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
