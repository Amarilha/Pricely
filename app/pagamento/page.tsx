import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PaymentForm } from "@/components/site/payment-form"

export const metadata: Metadata = {
  title: "Pagamento | Nexprice",
  description: "Finalize seu pagamento e tenha acesso ao plano escolhido",
}

export default function PagamentoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Informações de Pagamento</h1>
            <p className="text-muted-foreground">Preencha os dados abaixo para concluir sua assinatura.</p>
          </div>
          <PaymentForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
