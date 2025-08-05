import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PaymentForm } from "@/components/site/payment-form"

const plans = [
  { slug: "gratuito", name: "Gratuito", price: "R$ 0", period: "para sempre" },
  { slug: "profissional", name: "Profissional", price: "R$ 49", period: "por mês" },
  { slug: "empresarial", name: "Empresarial", price: "R$ 99", period: "por mês" },
]

export async function generateMetadata({ params }: { params: { plan: string } }): Promise<Metadata> {
  const plan = plans.find((p) => p.slug === params.plan)
  return {
    title: plan ? `Pagamento - ${plan.name}` : "Pagamento",
    description: "Finalize seu pagamento e tenha acesso ao plano escolhido",
  }
}

export default function PagamentoPlanPage({ params }: { params: { plan: string } }) {
  const plan = plans.find((p) => p.slug === params.plan)

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl">Plano não encontrado.</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Finalizar Assinatura: {plan.name}</h1>
            <p className="text-muted-foreground">Preencha os dados abaixo para concluir sua assinatura.</p>
          </div>
          <div className="mb-6 text-center">
            <p className="text-xl font-semibold">
              {plan.price} <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
            </p>
          </div>
          <PaymentForm plan={plan.name} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
