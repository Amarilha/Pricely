"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const revenueByClient = [
  { name: "Empresa ABC", value: 25000 },
  { name: "Startup XYZ", value: 35000 },
  { name: "Loja Virtual", value: 18500 },
  { name: "Consultoria 123", value: 32000 },
  { name: "Outros", value: 15000 },
]

const revenueByProjectType = [
  { name: "Websites", value: 45000 },
  { name: "Apps Mobile", value: 35000 },
  { name: "E-commerce", value: 25000 },
  { name: "Sistemas", value: 40000 },
  { name: "Design", value: 15000 },
]

const COLORS = ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"]

export function ReportsView() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select defaultValue="2023">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="todos">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os meses</SelectItem>
                <SelectItem value="q1">1º Trimestre</SelectItem>
                <SelectItem value="q2">2º Trimestre</SelectItem>
                <SelectItem value="q3">3º Trimestre</SelectItem>
                <SelectItem value="q4">4º Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        <Tabs defaultValue="faturamento">
          <TabsList className="mb-6">
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
          </TabsList>

          <TabsContent value="faturamento" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <h3 className="text-lg font-medium mb-4">Faturamento por Cliente</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByClient}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByClient.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`R$ ${new Intl.NumberFormat("pt-BR").format(value)}`, "Faturamento"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[400px]">
                <h3 className="text-lg font-medium mb-4">Faturamento por Tipo de Projeto</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByProjectType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByProjectType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`R$ ${new Intl.NumberFormat("pt-BR").format(value)}`, "Faturamento"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clientes">
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Relatório de clientes em breve</p>
            </div>
          </TabsContent>

          <TabsContent value="projetos">
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Relatório de projetos em breve</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
