import { ReportsView } from "@/components/reports-view"
import { PageHeader } from "@/components/page-header"

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Relatórios" description="Relatórios detalhados sobre faturamento e desempenho dos projetos." />
      <ReportsView />
    </div>
  )
}
