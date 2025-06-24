"use client"

import { Bell, ChevronDown, Home, LineChart, Package, Settings, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center h-16 px-6 bg-white border-b">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link href="#" className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <Home className="w-4 h-4" />
            Início
          </Link>
          <Link href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <LineChart className="w-4 h-4" />
            Análises
          </Link>
          <Link href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Users className="w-4 h-4" />
            Usuários
          </Link>
          <Link href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt="Avatar"
                />
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Visão Geral</h2>
            <p className="text-gray-600 mt-2">Acompanhe suas métricas e performance</p>
          </div>

          {/* Dashboard Content with Center Divider */}
          <div className="grid lg:grid-cols-2 gap-8 relative">
            {/* Left Side */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total de Vendas</CardDescription>
                    <CardTitle className="text-2xl">R$ 45.231</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-600">+20.1% em relação ao mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Novos Clientes</CardDescription>
                    <CardTitle className="text-2xl">+2.350</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-600">+180.1% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações realizadas no sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova venda registrada</p>
                      <p className="text-xs text-gray-500">há 2 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cliente cadastrado</p>
                      <p className="text-xs text-gray-500">há 15 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Produto atualizado</p>
                      <p className="text-xs text-gray-500">há 1 hora</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Métricas de desempenho do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memória</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Armazenamento</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center Divider Line */}
            <div className="absolute left-1/2 top-0 bottom-0 hidden lg:block">
              <Separator
                orientation="vertical"
                className="h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"
              />
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Pedidos Pendentes</CardDescription>
                    <CardTitle className="text-2xl">12</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-orange-600">3 precisam de atenção</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Taxa de Conversão</CardDescription>
                    <CardTitle className="text-2xl">3.2%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-red-600">-0.5% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Produtos</CardTitle>
                  <CardDescription>Produtos mais vendidos este mês</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Produto A</p>
                        <p className="text-xs text-gray-500">234 vendas</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">R$ 12.450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Produto B</p>
                        <p className="text-xs text-gray-500">189 vendas</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">R$ 9.870</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Produto C</p>
                        <p className="text-xs text-gray-500">156 vendas</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">R$ 7.320</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Rápidas</CardTitle>
                  <CardDescription>Resumo das principais métricas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">1.2k</p>
                      <p className="text-xs text-gray-600">Visitantes Hoje</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-xs text-gray-600">Satisfação</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">24</p>
                      <p className="text-xs text-gray-600">Tickets Abertos</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">5.7s</p>
                      <p className="text-xs text-gray-600">Tempo Médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
