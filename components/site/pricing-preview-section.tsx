import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Gratuito",
    description: "Para freelancers iniciantes",
    price: "R$ 0",
    period: "para sempre",
    features: [
      "Dashboard básico",
      "Calculadora de precificação",
      "Até 3 projetos ativos",
      "Relatórios básicos",
      "Suporte por email",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Profissional",
    description: "Para freelancers em crescimento",
    price: "R$ 49",
    period: "por mês",
    features: [
      "Dashboard completo",
      "Calculadora avançada",
      "Projetos ilimitados",
      "Relatórios detalhados",
      "Consultor IA básico",
      "Suporte prioritário",
    ],
    cta: "Assinar Agora",
    popular: true,
  },
  {
    name: "Empresarial",
    description: "Para agências e equipes",
    price: "R$ 99",
    period: "por mês",
    features: [
      "Tudo do Profissional",
      "Múltiplos usuários",
      "Consultor IA avançado",
      "API de integração",
      "Gerenciamento de equipe",
      "Suporte VIP",
    ],
    cta: "Fale com Vendas",
    popular: false,
  },
]

export function PricingPreviewSection() {
  return (
    <div className="container py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Planos para Todos os Tamanhos de Negócio</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para o seu negócio e comece a gerenciar seus projetos de forma eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
            {plan.popular && (
              <div className="bg-primary text-white text-center py-1 text-sm font-medium">Mais Popular</div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/planos" className="w-full">
                <Button
                  className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/80" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/planos">
          <Button variant="link" className="text-purple-600">
            Ver todos os detalhes dos planos
          </Button>
        </Link>
      </div>
    </div>
  )
}
