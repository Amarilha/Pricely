import { Card, CardContent } from "@/components/ui/card"

const partners = [
  {
    name: "Empresa ABC",
    logo: "/placeholder.svg?height=60&width=180",
    description:
      "Empresa líder em soluções de marketing digital, utilizando a Nexprice para gerenciar projetos de clientes.",
  },
  {
    name: "Startup XYZ",
    logo: "/placeholder.svg?height=60&width=180",
    description:
      "Startup inovadora no setor de tecnologia, usando a Nexprice para precificação de serviços de desenvolvimento.",
  },
  {
    name: "Consultoria 123",
    logo: "/placeholder.svg?height=60&width=180",
    description: "Consultoria especializada em gestão de negócios, recomendando a Nexprice para seus clientes.",
  },
  {
    name: "Agência DEF",
    logo: "/placeholder.svg?height=60&width=180",
    description: "Agência de design premiada, utilizando a Nexprice para gerenciar projetos criativos e equipes.",
  },
  {
    name: "Tech Solutions",
    logo: "/placeholder.svg?height=60&width=180",
    description: "Empresa de soluções tecnológicas, integrando a Nexprice com seus sistemas internos.",
  },
  {
    name: "Design Studio",
    logo: "/placeholder.svg?height=60&width=180",
    description: "Estúdio de design especializado em UI/UX, usando a Nexprice para precificação de projetos.",
  },
]

export function PartnersShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners.map((partner, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 flex items-center mb-4">
                <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="max-h-full" />
              </div>
              <h3 className="text-lg font-medium mb-2">{partner.name}</h3>
              <p className="text-muted-foreground">{partner.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
