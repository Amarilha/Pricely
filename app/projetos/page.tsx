import { ProjectsList } from "@/components/projects-list"
import { PageHeader } from "@/components/page-header"

export default function ProjetosPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Projetos" description="Visualize e gerencie todos os seus projetos." />
      <ProjectsList />
    </div>
  )
}
