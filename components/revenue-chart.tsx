"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", total: 18000 },
  { name: "Fev", total: 22000 },
  { name: "Mar", total: 25000 },
  { name: "Abr", total: 19000 },
  { name: "Mai", total: 32000 },
  { name: "Jun", total: 28000 },
  { name: "Jul", total: 35000 },
  { name: "Ago", total: 40000 },
  { name: "Set", total: 42000 },
  { name: "Out", total: 45000 },
  { name: "Nov", total: 48000 },
  { name: "Dez", total: 52000 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturamento</CardTitle>
        <CardDescription>Visualize o faturamento mensal dos seus projetos</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="anual">
          <TabsList className="mb-4">
            <TabsTrigger value="anual">Anual</TabsTrigger>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
          </TabsList>
          <TabsContent value="anual" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${new Intl.NumberFormat("pt-BR").format(value)}`} />
                <Tooltip formatter={(value) => [`R$ ${new Intl.NumberFormat("pt-BR").format(value)}`, "Faturamento"]} />
                <Bar dataKey="total" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="mensal" className="h-[300px]">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Dados mensais em breve</p>
            </div>
          </TabsContent>
          <TabsContent value="semanal" className="h-[300px]">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Dados semanais em breve</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
