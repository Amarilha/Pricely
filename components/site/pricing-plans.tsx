import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Gratuito",
    description: "Para freelancers iniciantes",
    price: "R$ 0",
    period: "para sempre",
    features: [
      { name: "Dashboard básico", included: true },
      { name: "Calculadora de precificação", included: true },
      { name: "Até 3 projetos ativos", included: true },
      { name: "Relatórios básicos", included: true },
      { name: "Consultor IA", included: false },
      { name: "Múltiplos usuários", included: false },
      { name: "API de integração", included: false },
      { name: "Suporte prioritário", included: false },
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
      { name: "Dashboard completo", included: true },
      { name: "Calculadora avançada", included: true },
      { name: "Projetos ilimitados", included: true },
      { name: "Relatórios detalhados", included: true },
      { name: "Consultor IA básico", included: true },
      { name: "Múltiplos usuários", included: false },
      { name: "API de integração", included: false },
      { name: "Suporte prioritário", included: true },
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
      { name: "Dashboard completo", included: true },
      { name: "Calculadora avançada", included: true },
      { name: "Projetos ilimitados", included: true },
      { name: "Relatórios detalhados", included: true },
      { name: "Consultor IA avançado", included: true },
      { name: "Múltiplos usuários", included: true },
      { name: "API de integração", included: true },
      { name: "Suporte VIP", included: true },
    ],
    cta: "Fale com Vendas",
    popular: false,
  },
]

export function PricingPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan, index) => (
        <Card key={index} className={cn("flex flex-col", plan.popular && "border-purple-600 shadow-lg")}>
          {plan.popular && (
            <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium">Mais Popular</div>
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
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={cn(!feature.included && "text-muted-foreground")}>{feature.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={cn("w-full", plan.popular && "bg-purple-600 hover:bg-purple-700")}
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
