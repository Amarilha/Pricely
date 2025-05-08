import { ProjectsList } from "@/components/projects-list"
import { PageHeader } from "@/components/page-header"
import { AdsBanner } from "@/components/ads-banner"

export default function ProjetosPage() {
  // Simulando um usuário do plano gratuito
  const userPlan = "free"

  return (
    <div className="flex flex-col gap-6 p-6">
      {userPlan === "free" && <AdsBanner />}
      <PageHeader title="Projetos" description="Visualize e gerencie todos os seus projetos." />
      <ProjectsList />
    </div>
  )
}
