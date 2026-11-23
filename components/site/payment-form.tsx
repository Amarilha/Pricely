import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentFormProps {
  plan?: string
}

// Não coletamos dados de cartão no site: o pagamento deve ir para o checkout do AbacatePay quando for integrado.
export function PaymentForm({ plan }: PaymentFormProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4 text-center">
        {plan && (
          <p className="text-lg font-medium">
            Plano selecionado: {plan}
          </p>
        )}
        <p className="text-muted-foreground">
          O pagamento online ainda não está disponível. Em breve você poderá assinar por aqui com segurança.
        </p>
        <Button asChild className="w-full bg-primary hover:bg-primary/80">
          <Link href="/planos">Voltar para os planos</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
