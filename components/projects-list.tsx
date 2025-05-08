"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: "PRJ001",
    name: "Website Corporativo",
    client: "Empresa ABC",
    startDate: "2023-01-15",
    endDate: "2023-03-20",
    value: 12500,
    status: "concluído",
  },
  {
    id: "PRJ002",
    name: "App Mobile",
    client: "Startup XYZ",
    startDate: "2023-02-10",
    endDate: "2023-06-30",
    value: 28000,
    status: "em andamento",
  },
  {
    id: "PRJ003",
    name: "E-commerce",
    client: "Loja Virtual",
    startDate: "2023-03-05",
    endDate: "2023-07-15",
    value: 18500,
    status: "em andamento",
  },
  {
    id: "PRJ004",
    name: "Sistema de Gestão",
    client: "Consultoria 123",
    startDate: "2023-04-20",
    endDate: "2023-08-10",
    value: 32000,
    status: "atrasado",
  },
  {
    id: "PRJ005",
    name: "Redesign de Marca",
    client: "Empresa DEF",
    startDate: "2023-05-12",
    endDate: "2023-06-15",
    value: 8500,
    status: "concluído",
  },
  {
    id: "PRJ006",
    name: "Campanha de Marketing",
    client: "Produto XYZ",
    startDate: "2023-06-01",
    endDate: "2023-08-30",
    value: 15000,
    status: "em andamento",
  },
  {
    id: "PRJ007",
    name: "Integração de API",
    client: "Plataforma ABC",
    startDate: "2023-06-15",
    endDate: "2023-07-30",
    value: 9500,
    status: "em andamento",
  },
  {
    id: "PRJ008",
    name: "Consultoria UX",
    client: "Startup 123",
    startDate: "2023-07-01",
    endDate: "2023-08-15",
    value: 7500,
    status: "em andamento",
  },
]

export function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Novo Projeto</Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.id}</div>
                  </TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString("pt-BR")} -
                      {project.status === "concluído" ? new Date(project.endDate).toLocaleDateString("pt-BR") : "Atual"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(project.value)}
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar projeto</DropdownMenuItem>
                        <DropdownMenuItem>Gerar relatório</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
