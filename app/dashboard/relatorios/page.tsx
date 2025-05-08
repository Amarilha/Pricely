import { ReportsView } from "@/components/reports-view"
import { PageHeader } from "@/components/page-header"
import { AdsBanner } from "@/components/ads-banner"

export default function RelatoriosPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col gap-6 p-6">
      {userPlan === "free" && <AdsBanner />}
      <PageHeader title="Relatórios" description="Relatórios detalhados sobre faturamento e desempenho dos projetos." />
      <ReportsView />
    </div>
  )
}
