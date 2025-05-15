import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <div className="bg-primary text-white">
      <div className="container py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar a gestão dos seus projetos?</h2>
          <p className="text-xl mb-8 text-primary-foreground">
            Junte-se a milhares de profissionais que já estão economizando tempo e aumentando a lucratividade com a
            Nexprice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" variant="link" className="bg-white text-primary hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90">
                Começar Grátis
              </Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="link" className="bg-white text-primary hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90">
                Ver Planos
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-foreground">Não é necessário cartão de crédito. Plano gratuito disponível.</p>
        </div>
      </div>
    </div>
  )
}
