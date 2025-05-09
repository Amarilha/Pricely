import { Card, CardContent } from "@/components/ui/card"
import { Heart, Lightbulb, Users, Target, Zap, Shield } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Paixão pelo Cliente",
    description:
      "Colocamos nossos clientes no centro de tudo o que fazemos, buscando sempre superar suas expectativas.",
  },
  {
    icon: Lightbulb,
    title: "Inovação Constante",
    description: "Buscamos constantemente novas formas de melhorar nossa plataforma e oferecer soluções inovadoras.",
  },
  {
    icon: Users,
    title: "Colaboração",
    description: "Acreditamos que as melhores soluções surgem da colaboração entre equipes diversas e complementares.",
  },
  {
    icon: Target,
    title: "Excelência",
    description: "Buscamos a excelência em tudo o que fazemos, desde o código até o atendimento ao cliente.",
  },
  {
    icon: Zap,
    title: "Agilidade",
    description: "Adaptamo-nos rapidamente às mudanças do mercado e às necessidades dos nossos clientes.",
  },
  {
    icon: Shield,
    title: "Integridade",
    description: "Agimos com transparência, honestidade e ética em todas as nossas relações.",
  },
]

export function CompanyValues() {
  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Nossos Valores</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Os princípios que guiam nossas decisões e definem nossa cultura
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary dark:bg-primary/20 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
