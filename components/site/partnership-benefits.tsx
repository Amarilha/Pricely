import { Card, CardContent } from "../ui/card"
import { BadgePercent, Gift, Users, Award, Zap, Globe } from "lucide-react"
import React from "react"

const benefits = [
  {
    icon: BadgePercent,
    title: "Comissões Atrativas",
    description: "Ganhe até 30% de comissão recorrente por cada cliente indicado que assinar um plano pago.",
  },
  {
    icon: Gift,
    title: "Recursos Exclusivos",
    description: "Acesso a recursos exclusivos da plataforma e prioridade para novas funcionalidades.",
  },
  {
    icon: Users,
    title: "Comunidade de Parceiros",
    description: "Faça parte de uma comunidade exclusiva de parceiros para networking e oportunidades.",
  },
  {
    icon: Award,
    title: "Certificação Oficial",
    description: "Torne-se um parceiro certificado Nexprice e destaque-se no mercado.",
  },
  {
    icon: Zap,
    title: "Suporte Dedicado",
    description: "Conte com um gerente de conta dedicado para ajudar você e seus clientes.",
  },
  {
    icon: Globe,
    title: "Visibilidade",
    description: "Destaque no nosso site e materiais de marketing para aumentar sua visibilidade.",
  },
]

export function PartnershipBenefits() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-background dark:bg-background/20 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
