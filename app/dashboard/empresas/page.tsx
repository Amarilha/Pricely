'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type Atividade = {
  code: string
  text: string
}

type Empresa = {
  cnpj: string
  nome: string
  fantasia: string
  email: string
  telefone: string
  situacao: string
  bairro: string
  municipio: string
  uf: string
  atividade_principal: Atividade | null
  atividades_secundarias: Atividade[]
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [cnpj, setCnpj] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [expandedActivities, setExpandedActivities] = useState<{ [key: number]: boolean }>({})

  const handleCadastrar = async () => {
    if (cnpj.length !== 14) {
      alert('CNPJ inválido')
      return
    }
  
    setLoading(true)
    try {
      const response = await fetch(`/api/cnpj?cnpj=${cnpj}`)
      const data = await response.json()
  
      if (data.error) {
        throw new Error(data.error)
      }
  
      const novaEmpresa: Empresa = {
        cnpj: data.cnpj || '',
        nome: data.nome || 'Nome não disponível',
        fantasia: data.fantasia || 'Fantasia não disponível',
        email: data.email || 'Email não disponível',
        telefone: data.telefone || 'Telefone não disponível',
        situacao: data.situacao || 'Situação não disponível',
        bairro: data.bairro || 'Bairro não disponível',
        municipio: data.municipio || 'Município não disponível',
        uf: data.uf || 'UF não disponível',
        // Handle atividade_principal as an array and take the first item
        atividade_principal: Array.isArray(data.atividade_principal) && data.atividade_principal.length > 0
          ? {
              code: data.atividade_principal[0].code || 'N/A',
              text: data.atividade_principal[0].text || 'Atividade não disponível'
            }
          : null,
        atividades_secundarias: Array.isArray(data.atividades_secundarias)
          ? data.atividades_secundarias.map((ativ: any) => ({
              code: ativ.code || 'N/A',
              text: ativ.text || 'Atividade não disponível'
            }))
          : []
      }
  
      setEmpresas([...empresas, novaEmpresa])
      setCnpj('')
      setOpenDialog(false)
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error)
      alert('Erro ao buscar dados da empresa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const toggleActivities = (index: number) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas Cadastradas</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                  value={cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')}
                  onChange={(e) => setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14))}
                  placeholder="Digite o CNPJ"
                  maxLength={18}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCadastrar}
                disabled={loading || cnpj.length !== 14}
              > 
                {loading ? 'Buscando...' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {empresas.map((empresa, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-2">
            <h2 className="text-xl font-semibold">{empresa.nome}</h2>
            <p className="text-gray-600">{empresa.fantasia}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">CNPJ</p>
                <p>{empresa.cnpj}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Atividade Principal</p>
                <p>
                  {empresa.atividade_principal 
                    ? `${empresa.atividade_principal.code} - ${empresa.atividade_principal.text}`
                    : 'Atividade principal não disponível'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Atividades Secundárias</p>
                {empresa.atividades_secundarias.length > 0 ? (
                  <>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => toggleActivities(index)}
                    >
                      {expandedActivities[index] ? 'Ocultar' : 'Mostrar'} atividades secundárias
                    </Button>
                    {expandedActivities[index] && (
                      <ul className="list-disc list-inside mt-2">
                        {empresa.atividades_secundarias.map((atividade, idx) => (
                          <li key={idx}>{`${atividade.code} - ${atividade.text}`}</li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <p>Nenhuma atividade secundária</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Localização</p>
                <p>{empresa.bairro}, {empresa.municipio} - {empresa.uf}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}