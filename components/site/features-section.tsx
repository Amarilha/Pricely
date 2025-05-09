import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, BarChart3, MessageSquare, Clock, DollarSign, Users } from "lucide-react"

const features = [
  {
    icon: Calculator,
    title: "Calculadora de Precificação",
    description: "Calcule o valor ideal para seus projetos com base nos seus custos e tempo estimado.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Visualize o desempenho dos seus projetos com gráficos e relatórios personalizados.",
  },
  {
    icon: MessageSquare,
    title: "Consultor IA",
    description: "Receba insights e recomendações personalizadas para otimizar seus projetos.",
  },
  {
    icon: Clock,
    title: "Gestão de Tempo",
    description: "Acompanhe o tempo dedicado a cada projeto e melhore sua produtividade.",
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description: "Gerencie receitas, despesas e lucros de forma simples e eficiente.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Organize informações de clientes e histórico de projetos em um só lugar.",
  },
]

export function FeaturesSection() {
  return (
    <div id="features" className="container py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Recursos Completos para seu Negócio</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tudo o que você precisa para gerenciar projetos, calcular preços justos e aumentar sua lucratividade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary dark:bg-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
