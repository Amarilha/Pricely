import { ReportsView } from "@/components/reports-view"
import { PageHeader } from "@/components/page-header"
import { AdsBanner } from "@/components/ads-banner"

export default function RelatoriosPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Overlay de manutenção */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="text-[80px] font-bold text-gray-400 opacity-50 rotate-[-30deg]">
          EM MANUTENÇÃO
        </div>
      </div>
      {/* 
      {userPlan === "free" && <AdsBanner />}
      */}
      <PageHeader title="Relatórios" description="Relatórios detalhados sobre faturamento e desempenho dos projetos." />
      <ReportsView />
    </div>
  )
}
