"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateProjectModal } from "./modals/create-project-modal"

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visualize o faturamento dos seus projetos</p>
      </div>
      <Button 
        className="bg-purple-600 hover:bg-purple-700"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Projeto
      </Button>

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
