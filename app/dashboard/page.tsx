import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCards } from "@/components/dashboard-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { ProjectsTable } from "@/components/projects-table"
import { AdsBanner } from "@/components/ads-banner"

export default function DashboardPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col gap-6 p-6">
      {userPlan === "free" && <AdsBanner />}
      <DashboardHeader />
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ProjectsTable />
      </div>
      {userPlan === "free" && <AdsBanner position="bottom" />}
    </div>
  )
}
