import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: "PRJ001",
    name: "Website Corporativo",
    client: "Empresa ABC",
    value: 12500,
    status: "concluído",
  },
  {
    id: "PRJ002",
    name: "App Mobile",
    client: "Startup XYZ",
    value: 28000,
    status: "em andamento",
  },
  {
    id: "PRJ003",
    name: "E-commerce",
    client: "Loja Virtual",
    value: 18500,
    status: "em andamento",
  },
  {
    id: "PRJ004",
    name: "Sistema de Gestão",
    client: "Consultoria 123",
    value: 32000,
    status: "atrasado",
  },
  {
    id: "PRJ005",
    name: "Redesign de Marca",
    client: "Empresa DEF",
    value: 8500,
    status: "concluído",
  },
]

export function ProjectsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projetos Recentes</CardTitle>
        <CardDescription>Últimos 5 projetos e seus status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium">Projeto</th>
                <th className="text-left py-3 px-2 text-sm font-medium">Cliente</th>
                <th className="text-right py-3 px-2 text-sm font-medium">Valor</th>
                <th className="text-right py-3 px-2 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border">
                  <td className="py-3 px-2">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.id}</div>
                  </td>
                  <td className="py-3 px-2">{project.client}</td>
                  <td className="py-3 px-2 text-right">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(project.value)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Badge
                      className={cn(
                        "text-xs",
                        project.status === "concluído" && "bg-green-500/10 text-green-500 hover:bg-green-500/20",
                        project.status === "em andamento" && "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
                        project.status === "atrasado" && "bg-red-500/10 text-red-500 hover:bg-red-500/20",
                      )}
                    >
                      {project.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
