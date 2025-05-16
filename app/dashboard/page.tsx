import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCards } from "@/components/dashboard-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { ProjectsTable } from "@/components/projects-table"
import { AdsBanner } from "@/components/ads-banner"

export default function DashboardPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="relative flex flex-col gap-6 p-6">
      {/* Overlay de manutenção */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="text-[80px] font-bold text-gray-400 opacity-50 rotate-[-30deg]">
          EM MANUTENÇÃO
        </div>
      </div>

      
      {userPlan === "free" && <AdsBanner />}
      
      <DashboardHeader />
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ProjectsTable />
      </div>
    </div>
  )
}