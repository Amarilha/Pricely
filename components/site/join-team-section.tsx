import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const openPositions = [
  {
    title: "Desenvolvedor Full Stack",
    department: "Tecnologia",
    location: "Remoto",
    type: "Integral",
    description:
      "Estamos procurando um desenvolvedor full stack experiente para ajudar a construir novos recursos e melhorar a plataforma Valluo.",
  },
  {
    title: "Designer de Produto",
    department: "Design",
    location: "Remoto",
    type: "Integral",
    description:
      "Procuramos um designer de produto para criar experiências intuitivas e atraentes para nossos usuários.",
  },
  {
    title: "Especialista em Marketing de Conteúdo",
    department: "Marketing",
    location: "Remoto",
    type: "Integral",
    description:
      "Buscamos um especialista em marketing de conteúdo para criar e gerenciar conteúdo relevante para nossa audiência.",
  },
]

export function JoinTeamSection() {
  return (
    <div className="my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Junte-se à Nossa Equipe</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Estamos sempre em busca de talentos apaixonados para nos ajudar a construir o futuro da gestão de projetos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {openPositions.map((position, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>{position.department}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {position.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{position.description}</p>
              <p className="text-sm font-medium">📍 {position.location}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">Não encontrou uma vaga que corresponda ao seu perfil?</p>
        <Link href="#">
          <Button className="bg-purple-600 hover:bg-purple-700">Enviar Candidatura Espontânea</Button>
        </Link>
      </div>
    </div>
  )
}
