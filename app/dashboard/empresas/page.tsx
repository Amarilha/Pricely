'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([]) // Tipo será definido baseado na estrutura do JSON
  const [cnpj, setCnpj] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          setEmpresas([...empresas, jsonData])
        } catch (error) {
          console.error('Erro ao processar arquivo JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas Cadastradas</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Cadastrar Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">CNPJ</label>
                <Input 
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="Digite o CNPJ"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Arquivo JSON</label>
                <Input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {empresas.map((empresa, index) => (
          <div key={index} className="border p-4 rounded-lg">
            {/* Renderize os dados da empresa aqui baseado na estrutura do seu JSON */}
            <pre>{JSON.stringify(empresa, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}