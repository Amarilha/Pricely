import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visualize o faturamento dos seus projetos</p>
      </div>
      <Button className="bg-purple-600 hover:bg-purple-700">
        <Plus className="mr-2 h-4 w-4" />
        Novo Projeto
      </Button>
    </div>
  )
}
