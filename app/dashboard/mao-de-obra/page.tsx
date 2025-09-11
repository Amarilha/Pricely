import { PageHeader } from "@/components/page-header"
import { MaoDeObra } from "@/components/mao-de-obra"

export default function MaoDeObraPage() {
  return (
    <div>
      <PageHeader
        title="Mão de Obra"
        description="Calcule o valor da sua hora de trabalho."
      />
      <div className="p-8">
        <MaoDeObra />
      </div>
    </div>
  )
}
