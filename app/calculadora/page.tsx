import { CalculadoraForm } from "@/components/calculadora-form"
import { PageHeader } from "@/components/page-header"

export default function CalculadoraPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Calculadora de Precificação"
        description="Calcule o valor ideal para seus projetos com base nos seus custos e tempo estimado."
      />
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <CalculadoraForm />
        </div>
      </div>
    </div>
  )
}
