"use client"

import type React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import {
  Plus,
  Trash2,
  Calculator,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  HelpCircle,
  Info,
  Building,
  Users,
  Package,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/calculadora-01/theme-toggle"
import { FinancialCharts } from "@/components/calculadora-01/financial-charts"
import { TaxCalculator } from "@/components/calculadora-01/tax-calculator"
import { BoletoGenerator } from "@/components/calculadora-01/boleto-generator"
import { PaymentMethodSelector } from "@/components/calculadora-01/payment-method-selector"
import {stateAuth} from "@/app/src/services/estadoAuth"
import {WorkHoursCalendar, DateRangeSelector} from "@/components/calculadora-01/calendario"
import OrcamentoDetalhado from "@/components/calculadora/OrcamentoDetalhado"
//import { DateRangeSelector} from "@/components/calculadora-01/DateRangeSelector";




interface ServiceItem {
  id: string
  quantidade: number
  descricao: string
  precoUnitario: number
  totalItem: number
}

interface FixedCost {
  id: string
  descricao: string
  valor: number
}

interface VariableCost {
  id: string
  categoria: string
  descricao: string
  valor: number
  unidade: string
  quantidade:number
  observacoes: string
}

interface Company {
  id_company: string
  id_user: string;
  nome: string
  cnpj: string
  endereco_rua: string
  endereco_numero: string
  endereco_cidade: string
  endereco_estado: string
  endereco_cep: string
  telefone: string
  email: string
  logoChar: string
  created_at?: string
  updated_at?: string
}

interface Client {
  id_client: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco_rua: string
  endereco_numero: string
  endereco_cidade: string
  endereco_estado: string
  endereco_cep: string
  observacoes: string
}

interface QuoteData {
  empresaSelecionada: string
  empresa: Company
  clienteSelecionado: string
  cliente: Client
  numeroOrdem: string
  data: string
  dataEntrega: string
  descricaoServico: string
  enderecoCobranca: string
  localPrestacao: {
    nome: string
    tipoDocumento: string
    documento: string
    endereco: {
      rua: string
      numero: string
      cidade: string
      estado: string
    }
  }
  horasTrabalhadasMes: number
  custosFixos: FixedCost[]
  custosVariaveis: VariableCost[]
  margemLucro: number
  impostos: number
  tempoExecucao: number
  incluirSalarios: boolean
  itens: ServiceItem[]
  formaPagamento: string
  desconto: number
  acrescimos: number
  condicoesPersonalizadas: string
}

const TooltipHelper = ({ content, children }: { content: string; children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 cursor-help">
          {children}
          <HelpCircle className="h-4 w-4 mb-4 text-gray-400" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

import { DateRangeProvider, useDateRange } from "@/components/calculadora-01/data-context";

function ServiceQuoteGeneratorContent() {
  const { dateRange } = useDateRange();
  const [empresasCadastradas, setEmpresasCadastradas] = useState<Company[]>([])
  const [clientesCadastrados, setClientesCadastrados] = useState<Client[]>([])
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false)
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formDataEmpresas, setFormDataEmpresas] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: ''
  })
  const [formDataClient, setFormDataClient] = useState<Omit<Client, 'id_client'>>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_cidade: '',
    endereco_estado: '',
    endereco_cep: '',
    observacoes: '',
  });

  const [dados, setDados] = useState<QuoteData>({
    empresaSelecionada: '',
    empresa: {
      id_company: '',
      id_user: '',
      nome: '',
      cnpj: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_cidade: '',
      endereco_estado: '',
      endereco_cep: '',
      telefone: '',
      email: '',
      logoChar: '',
    },
    clienteSelecionado: '',
    cliente: {
      id_client: '',
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_cidade: '',
      endereco_estado: '',
      endereco_cep: '',
      observacoes: '',
    },
    numeroOrdem: `OS-${Date.now().toString().slice(-6)}`,
    data: new Date().toISOString().split('T')[0],
    dataEntrega: '',
    descricaoServico: '',
    enderecoCobranca: '',
    localPrestacao: {
      nome: '',
      tipoDocumento: 'CPF',
      documento: '',
      endereco: { rua: '', numero: '', cidade: '', estado: '' },
    },
    horasTrabalhadasMes: 0,
    selectedDays: Array(7).fill(false),
    hoursPerDay: 8,
    dataInicio: '',
    dataFim: '',
    tempoExecucao: 160,
    custosFixos: [
      { id: '1', descricao: 'Aluguel/Financiamento', valor: 0 },
      { id: '2', descricao: 'Internet/Telefone', valor: 0 },
      { id: '3', descricao: 'Salários/Pró-labore', valor: 0 },
    ],
    custosVariaveis: [],
    margemLucro: 30,
    impostos: 8,
    incluirSalarios: true,
    itens: [],
    formaPagamento: '',
    desconto: 0,
    acrescimos: 0,
    condicoesPersonalizadas: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('calculadoraDados');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDados(parsed);
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculadoraDados', JSON.stringify(dados));
  }, [dados]);
  
  const [workDays, setWorkDays] = useState([true, true, true, true, true, false, false]); // Seg-Sex
  const [hoursPerDay, setHoursPerDay] = useState(8);

  useEffect(() => {
    const saved = localStorage.getItem('calculadoraDados');
    if (saved) {
      setDados(JSON.parse(saved));
    }
  }, []);
  
  // Persistir dados no localStorage
  useEffect(() => {
    localStorage.setItem('calculadoraDados', JSON.stringify(dados));
  }, [dados]);

  const [impostosDetalhados, setImpostosDetalhados] = useState({
    total: 0,
    breakdown: {
      simples: 0,
      iss: 0,
      pis: 0,
      cofins: 0,
      irpj: 0,
      csll: 0,
      total: 0,
      regime: "simples",
    },
  })

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormDataEmpresas(prev => ({
      ...prev,
      [id.replace('company-', '')]: value
    }))
  }

  //ler o BD
  const fetchEmpresas = async () => {
    try {
      const userId = await stateAuth();
      console.log("fetchEmpresas:", userId),
      setLoading(true)
      const response = await fetch('/dashboard/api/empresas',{
        headers: {
          'Authorization': `${userId}`
        }
      });
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`)
      }
      const data: Company[] = await response.json()
      setEmpresasCadastradas(data)
    } catch (err) {
      console.error('Erro ao buscar empresas:', err)
      setError('Falha ao carregar empresas.')
    } finally {
      setLoading(false)
    }
  }

  //fetchEmpresas
  useEffect(() => { 
    fetchEmpresas()
  }, [])

  //cadastro de empresas
  const handleSaveEmpresas = async () => {
    try {
      console.log("handleSaveEmpresas")
      setIsLoading(true);
      const userId = await stateAuth();
      console.log("userId retornado por stateAuth:", userId);
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const cleanedCnpj = formDataEmpresas.cnpj.replace(/\D/g, '');
      console.log("CNPJ enviado:", cleanedCnpj);
      if (cleanedCnpj.length !== 14) {
        throw new Error('CNPJ inválido: deve conter exatamente 14 dígitos');
      }

      const cleanedCep = formDataEmpresas.cep.replace(/\D/g,'');
        console.log("CEP enviado", cleanedCep)

      // Limpa e valida telefone (remove tudo que não for dígito)
      const cleanedTelefone = formDataEmpresas.phone.replace(/\D/g, '');
      console.log("Telefone enviado:", cleanedTelefone);

      if (!formDataEmpresas.name || !formDataEmpresas.email) {
        throw new Error('Campos obrigatórios (nome, email) não preenchidos');
      }

      const response = await fetch('/dashboard/api/empresas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: userId,
          nome: formDataEmpresas.name,
          cnpj: cleanedCnpj,
          endereco_rua: formDataEmpresas.street,
          endereco_numero: formDataEmpresas.number,
          endereco_bairro: formDataEmpresas.neighborhood,
          endereco_cidade: formDataEmpresas.city,
          endereco_estado: formDataEmpresas.state,
          endereco_cep: cleanedCep,
          telefone: cleanedTelefone,
          email: formDataEmpresas.email,
          logoChar: '' // Add default or dynamic logoChar if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erro retornado pelo servidor:", errorData);
        throw new Error(errorData.error || 'Falha ao salvar empresa');
      }

      const newCompany: Company = await response.json();
    setEmpresasCadastradas(prev => [...prev, newCompany]);

    // Limpar os campos do formulário
    setFormDataEmpresas({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: '',
    });
     
      setShowNewCompanyDialog(false)
    } catch (err) {
      console.error('Erro ao salvar empresa:', err);
      setError('Falha ao salvar empresa.');
    } finally {
      setIsLoading(false);
    }
  };

    // Company selection
  // --- Funções para manipulação de estado (Exemplo para seleção de empresa) ---
  const selecionarEmpresa = useCallback(
    (empresaId: string) => {
      const empresa = empresasCadastradas.find((e) => e.id_company === empresaId)
      if (empresa) {
        setDados((prev) => ({
          ...prev,
          empresaSelecionada: empresaId,
          empresa: empresa,
        }))
      }
    },
    [empresasCadastradas], // Dependência: recalcula se a lista de empresas mudar
  )

  //Cancel Empresas
  const handleCancelEmpresas = () => {
    setFormDataEmpresas({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: ''
    })
    setShowNewCompanyDialog(false)
  }

  //fetchClient
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const userId = await stateAuth();
        console.log("fetchClient:", userId),
        setLoading(true)
        const response = await fetch('/dashboard/api/client',{
          headers:{
            'Authorization': `${userId}`
          }
        });
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`)
        }
        const data: Client[] = await response.json()
        setClientesCadastrados(data)
      } catch (err) {
        console.error('Erro ao buscar clientes:', err)
        setError('Falha ao carregar clientes.')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [])

  // Nova função para salvar cliente
  const handleSaveClient = async () => {
      try {
        setIsLoading(true);
        const userId = await stateAuth();
        console.log("userId retornado por stateAuth:", userId);
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }

        // Limpa e valida CPF (remove tudo que não for dígito)
        const cleanedCpf = formDataClient.cpf.replace(/\D/g, '');
        console.log("CPF enviado:", cleanedCpf);

        const cleanedCep = formDataClient.endereco_cep.replace(/\D/g,'');
        console.log("CEP enviado", cleanedCep)
        

        if (cleanedCpf.length !== 11) {
          throw new Error('CPF inválido: deve conter exatamente 11 dígitos');
        }

        // Limpa e valida telefone (remove tudo que não for dígito)
        const cleanedTelefone = formDataClient.telefone.replace(/\D/g, '');
        console.log("Telefone enviado:", cleanedTelefone);

        if (cleanedTelefone.length < 10 || cleanedTelefone.length > 11) {
          throw new Error('Telefone inválido: deve conter 10 ou 11 dígitos (com DDD)');
        }

        const response = await fetch('/dashboard/api/client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_user: userId,
            nome: formDataClient.nome, // Assumindo que você terá um formDataClient similar ao formData para empresas
            cpf: cleanedCpf,
            telefone: cleanedTelefone,
            email: formDataClient.email,
            endereco_rua: formDataClient.endereco_rua,
            endereco_numero: formDataClient.endereco_numero,
            endereco_cidade: formDataClient.endereco_cidade,
            endereco_estado: formDataClient.endereco_estado,
            endereco_cep: cleanedCep,
            observacoes: formDataClient.observacoes // Se existir no seu formulário de cliente
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Erro retornado pelo servidor:", errorData);
          throw new Error(errorData.error || 'Falha ao salvar client');
        }
  
        const newClient: Client = await response.json()
        setClientesCadastrados(prev => [...prev, newClient])
        // Limpar o formulário do cliente após salvar (adapte conforme seu estado de formulário de cliente)
        setFormDataClient({ 
          nome: '',
          cpf: '',
          telefone: '',
          email: '',
          endereco_rua: '',
          endereco_numero: '',
          endereco_cidade: '',
          endereco_estado: '',
          endereco_cep: '',
          observacoes: '',
        })
        setShowNewClientDialog(false) // Se você tiver um modal para clientes
      } catch (err) {
        console.error('Erro ao salvar cliente:', err)
        setError('Falha ao salvar cliente.')
      }finally {
        setIsLoading(false);
      }
  };

  // Client selection
  const selecionarCliente = useCallback(
    (clienteId: string) => {
      const cliente = clientesCadastrados.find((c) => c.id_client === clienteId)
      if (cliente) {
        setDados((prev) => ({
          ...prev,
          clienteSelecionado: clienteId,
          cliente: cliente,
        }))
      }
    },
    [clientesCadastrados],
  )

  const handleCancelCliente = () => {
    setFormDataEmpresas({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: '',
    });
     
    setShowNewClientDialog(false)
  }

  const handleChangeClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Mapeamento dos IDs para os nomes no estado
    const fieldMap: Record<string, string> = {
      'client-name': 'nome',
      'client-cpf': 'cpf',
      'client-email': 'email',
      'client-phone': 'telefone',
      'client-street': 'endereco_rua',
      'client-number': 'endereco_numero',
      'client-city': 'endereco_cidade',
      'client-state': 'endereco_estado',
      'client-cep': 'endereco_cep',
      'client-notes': 'observacoes'
    };
  
    const fieldName = fieldMap[id] || id.replace('client-', '');
    
    setFormDataClient(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  // Fixed Costs Management
  const adicionarCustoFixo = useCallback(() => {
    const novoId = Date.now().toString()
    setDados((prev) => ({
      ...prev,
      custosFixos: [...prev.custosFixos, { id: novoId, descricao: "", valor: 0 }],
    }))
  }, [])

  const removerCustoFixo = useCallback((id: string) => {
    setDados((prev) => ({
      ...prev,
      custosFixos: prev.custosFixos.filter((custo) => custo.id !== id),
    }))
  }, [])

  const atualizarCustoFixo = useCallback((id: string, campo: "descricao" | "valor", valor: any) => {
    setDados((prev) => ({
      ...prev,
      custosFixos: prev.custosFixos.map((custo) => (custo.id === id ? { ...custo, [campo]: valor } : custo)),
    }))
  }, [])

  // Variable Costs Management
  const adicionarCustoVariavel = useCallback(() => {
    const novoId = Date.now().toString()
    setDados((prev) => ({
      ...prev,
      custosVariaveis: [
        ...prev.custosVariaveis,
        {
          id: novoId,
          categoria: "Material",
          descricao: "",
          valor: 0,
          quantidade: 0,
          unidade: "unidade",
          observacoes: "",
        },
      ],
    }))
  }, [])

  const removerCustoVariavel = useCallback((id: string) => {
    setDados((prev) => ({
      ...prev,
      custosVariaveis: prev.custosVariaveis.filter((custo) => custo.id !== id),
    }))
  }, [])

  const atualizarCustoVariavel = useCallback((id: string, campo: keyof VariableCost, valor: any) => {
    setDados((prev) => ({
      ...prev,
      custosVariaveis: prev.custosVariaveis.map((custo) => (custo.id === id ? { ...custo, [campo]: valor } : custo)),
    }))
  }, [])

  // Service Items Management
  const adicionarItem = useCallback(() => {
    const novoId = Date.now().toString()
    setDados((prev) => ({
      ...prev,
      itens: [...prev.itens, { id: novoId, quantidade: 1, descricao: "", precoUnitario: 0, totalItem: 0 }],
    }))
  }, [])

  const removerItem = useCallback((id: string) => {
    setDados((prev) => ({
      ...prev,
      itens: prev.itens.filter((item) => item.id !== id),
    }))
  }, [])

  const atualizarItem = useCallback((id: string, campo: keyof ServiceItem, valor: any) => {
    setDados((prev) => {
      const novosItens = prev.itens.map((item) => {
        if (item.id === id) {
          const itemAtualizado = { ...item, [campo]: valor }
          if (campo === "quantidade" || campo === "precoUnitario") {
            itemAtualizado.totalItem = itemAtualizado.quantidade * itemAtualizado.precoUnitario
          }
          return itemAtualizado
        }
        return item
      })
      return { ...prev, itens: novosItens }
    })
  }, [])

  // Financial Calculations with salary inclusion logic - Memoizadas para performance
  const calcularTotalCustosFixos = useMemo(() => {
    return dados.custosFixos.reduce((total, custo) => {
      if (
        !dados.incluirSalarios &&
        (custo.descricao.toLowerCase().includes("salário") || custo.descricao.toLowerCase().includes("pró-labore"))
      ) {
        return total
      }
      return total + (custo.valor || 0)
    }, 0)
  }, [dados.custosFixos, dados.incluirSalarios])

  const calcularTotalCustosVariaveis = useMemo(() => {
    return dados.custosVariaveis.reduce((total, custo) => total + ((custo.valor || 0)*(custo.quantidade || 0)), 0)
  }, [dados.custosVariaveis])

  const calcularCustoHora = useMemo(() => {
    const { totalHours } = dateRange;
    return totalHours > 0 ? calcularTotalCustosFixos / totalHours : 0;
  }, [calcularTotalCustosFixos, dateRange]);

  const calcularCustoOperacional = useMemo(() => {
    const custoHora = calcularCustoHora
    const custoTempo = custoHora * (dados.tempoExecucao || 0)
    const custoVariaveis = calcularTotalCustosVariaveis
    return custoTempo + custoVariaveis
  }, [calcularCustoHora, dados.tempoExecucao, calcularTotalCustosVariaveis])

  const calcularSubtotalItens = useMemo(() => {
    return dados.itens.reduce((total, item) => total + (item.totalItem || 0), 0)
  }, [dados.itens])

  const calcularSubtotalGeral = useMemo(() => {
    return calcularCustoOperacional + calcularSubtotalItens
  }, [calcularCustoOperacional, calcularSubtotalItens])

  const calcularLucro = useMemo(() => {
    const subtotal = calcularSubtotalGeral
    return subtotal * ((dados.margemLucro || 0) / 100)
  }, [calcularSubtotalGeral, dados.margemLucro])

  const calcularImpostos = useMemo(() => {
    const subtotalComLucro = calcularSubtotalGeral + calcularLucro
    return subtotalComLucro * ((dados.impostos || 0) / 100)
  }, [calcularSubtotalGeral, calcularLucro, dados.impostos])

  const calcularTotalFinal = useMemo(() => {
    const subtotal = calcularSubtotalGeral
    const lucro = calcularLucro
    const impostos = calcularImpostos
    return subtotal + lucro + impostos - (dados.desconto || 0) + (dados.acrescimos || 0)
  }, [calcularSubtotalGeral, calcularLucro, calcularImpostos, dados.desconto, dados.acrescimos])

  // Função de formatação memoizada
  const formatarMoeda = useCallback((valor: number) => {
    if (!valor || isNaN(valor) || !isFinite(valor)) return "R$ 0,00"

    try {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      })
    } catch (error) {
      return `R$ ${valor.toFixed(2).replace(".", ",")}`
    }
  }, [])

  const formatarData = useCallback((data: string) => {
    if (!data) return ""
    try {
      return new Date(data).toLocaleDateString("pt-BR")
    } catch (error) {
      return data
    }
  }, [])

  // Handler para mudança de impostos com validação
  const handleTaxChange = useCallback((totalTax: number, breakdown: any) => {
    // Validação dos valores recebidos
    if (typeof totalTax === "number" && isFinite(totalTax) && breakdown && typeof breakdown === "object") {
      setImpostosDetalhados({
        total: totalTax,
        breakdown: {
          simples: breakdown.simples || 0,
          iss: breakdown.iss || 0,
          pis: breakdown.pis || 0,
          cofins: breakdown.cofins || 0,
          irpj: breakdown.irpj || 0,
          csll: breakdown.csll || 0,
          total: breakdown.total || 0,
          regime: breakdown.regime || "simples",
        },
      })
    }
  }, [])

  // Enhanced PDF generation function
  const gerarPDF = useCallback(() => {
    const conteudoOrcamento = document.getElementById("service-quote-pdf")
    if (!conteudoOrcamento) {
      alert("Erro: Conteúdo do orçamento não encontrado")
      return
    }

    // Create optimized PDF content
  const pdfContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orçamento - ${dados.numeroOrdem}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          line-height: 1.4;
          color: #000;
          background: white !important;
          padding: 20px;
        }
        
        .pdf-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 1px solid #d1d5db;
          margin-bottom: 16px;
        }
        
        .company-info {
          display: flex;
          align-items: center;
        }
        
        .company-logo {
          background-color: #9333ea !important;
          color: white !important;
          font-weight: bold;
          font-size: 24px;
          width: 80px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          margin-right: 16px;
        }
        
        .company-details h2 {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .company-details p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        
        .order-info {
          text-align: right;
        }
        
        .order-info h1 {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .order-details {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 8px;
          background: #f9fafb;
        }
        
        .order-details p {
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
        }
        
        .info-card {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .info-card-header {
          background-color: #9333ea !important;
          color: white !important;
          padding: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .info-card-content {
          padding: 12px;
          font-size: 14px;
          color: #374151;
        }
        
        .info-card-content p {
          margin-bottom: 4px;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse !important;
          margin: 24px 0;
        }
        
        .items-table th,
        .items-table td {
          border: 1px solid #d1d5db !important;
          padding: 8px !important;
          text-align: left;
        }
        
        .items-table th {
          background-color: #9333ea !important;
          color: white !important;
          font-weight: 600;
          font-size: 14px;
        }
        
        .items-table td {
          font-size: 14px;
          color: #374151;
        }
        
        .items-table .text-right {
          text-align: right;
        }
        
        .totals-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
          align-items: start;
        }
        
        .payment-info {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          height: fit-content;
        }
        
        .totals-breakdown {
          space-y: 8px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-radius: 4px;
        }
        
        .total-row.subtotal {
          background-color: #f3f4f6;
        }
        
        .total-row.final {
          background-color: #e5e7eb;
          font-weight: bold;
          font-size: 18px;
        }
        
        .total-row .label {
          font-weight: 600;
          color: #6b7280;
        }
        
        .total-row .value {
          font-weight: 600;
        }
        
        .value.positive {
          color: #16a34a;
        }
        
        .value.negative {
          color: #dc2626;
        }
        
        .value.final {
          color: #16a34a;
          font-size: 18px;
        }
        
        .signatures {
          margin-top: 32px;
          padding-top: 16px;
        }
        
        .signatures-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 32px;
        }
        
        .signature-line {
          text-align: center;
          border-top: 1px solid #9ca3af;
          padding-top: 8px;
          font-weight: 600;
        }
        
        .footer-brand {
          text-align: center;
          margin-top: 32px;
        }
        
        .footer-brand p {
          background-color: #9333ea !important;
          color: white !important;
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
        }
        
        .variable-costs-detail {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .controls {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          border-top: 2px solid #e5e7eb;
        }
        
        .btn {
          background: #9333ea;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin: 0 8px;
          font-family: Arial, sans-serif;
        }
        
        .btn:hover {
          background: #7c3aed;
        }
        
        .btn-secondary {
          background: #6b7280;
        }
        
        .btn-secondary:hover {
          background: #4b5563;
        }
        
        @media print {
          .controls {
            display: none !important;
          }
          
          body {
            padding: 0 !important;
          }
          
          .pdf-container {
            max-width: none !important;
          }
        }
        
        @page {
          size: A4;
          margin: 0.5in;
        }
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <!-- Header -->
        <div class="pdf-header">
          <div class="company-info">
            <div class="company-logo">
              ${dados.empresa.logoChar || "XX"}
            </div>
            <div class="company-details">
              <h2>${dados.empresa.nome || "Company Name"}</h2>
              <p>CNPJ ${dados.empresa.cnpj || "00.000.000/0000-00"}</p>
              <p>${dados.empresa.endereco_rua || "Street"}, ${dados.empresa.endereco_numero || "Number"}</p>
              <p>${dados.empresa.endereco_cidade || "City"}, ${dados.empresa.endereco_estado || "State"}</p>
              <p>Telefone ${dados.empresa.telefone || "(00) 0000-0000"}</p>
            </div>
          </div>
          <div class="order-info">
            <h1>Orçamentos</h1>
            <div class="order-details">
              <p><strong>Ordem nº:</strong> ${dados.numeroOrdem}</p>
              <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
            </div>
          </div>
        </div>

        <!-- Client and Billing Information -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-header">Cliente</div>
            <div class="info-card-content">
              <p><strong>Nome:</strong> ${dados.cliente.nome || "Client Name"}</p>
              <p><strong>CPF:</strong> ${dados.cliente.cpf || "000.000.000-00"}</p>
              <p><strong>Endereço:</strong> ${dados.cliente.endereco_rua || "Street"}, ${
                dados.cliente.endereco_numero || "Number"
              } - ${dados.cliente.endereco_cidade || "City"}, ${dados.cliente.endereco_estado || "State"}</p>
              <p><strong>Telefone:</strong> ${dados.cliente.telefone || "(00) 0000-0000"}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-header">Endereço de cobrança</div>
            <div class="info-card-content">
              <p>${dados.enderecoCobranca || "Billing address"}</p>
            </div>
          </div>
        </div>

        <!-- Service Description and Location -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-header">Descrição do serviço</div>
            <div class="info-card-content">
              <p>${dados.descricaoServico || "Service description"}</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-header">Local de prestação</div>
            <div class="info-card-content">
              <p><strong>Nome:</strong> ${dados.localPrestacao.nome || "Service Location"}</p>
              <p><strong>${dados.localPrestacao.tipoDocumento}:</strong> ${
                dados.localPrestacao.documento || "000.000.000-00"
              }</p>
              <p><strong>Endereço:</strong> ${dados.localPrestacao.endereco.rua || "Street"}, ${
                dados.localPrestacao.endereco.numero || "Number"
              } - ${dados.localPrestacao.endereco.cidade || "City"}, ${
                dados.localPrestacao.endereco.estado || "State"
              }</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Quantidade</th>
              <th>Produto utilizado ou Serviço Prestado</th>
              <th class="text-right">Preço Unitário</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${dados.itens
              .map(
                (item) => `
              <tr>
                <td>${item.quantidade}</td>
                <td>${item.descricao}</td>
                <td class="text-right">${formatarMoeda(item.precoUnitario)}</td>
                <td class="text-right">${formatarMoeda(item.totalItem)}</td>
              </tr>
            `,
              )
              .join("")}
            ${
              calcularCustoOperacional > 0
                ? `
              <tr>
                <td>1</td>
                <td>
                  Custo Operacional (${dados.tempoExecucao}h)
                  ${!dados.incluirSalarios ? '<div class="variable-costs-detail">*Salários não incluídos</div>' : ""}
                  ${
                    dados.custosVariaveis.length > 0
                      ? `<div class="variable-costs-detail">Inclui: ${dados.custosVariaveis
                          .map((c) => `${c.categoria} (${formatarMoeda(c.valor)})`)
                          .join(", ")}</div>`
                      : ""
                  }
                </td>
                <td class="text-right">${formatarMoeda(calcularCustoOperacional)}</td>
                <td class="text-right">${formatarMoeda(calcularCustoOperacional)}</td>
              </tr>
            `
                : ""
            }
            ${Array.from({
              length: Math.max(0, 4 - dados.itens.length - (calcularCustoOperacional > 0 ? 1 : 0)),
            })
              .map(
                () => `
              <tr style="height: 32px;">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <!-- Payment and Totals -->
        <div class="totals-section">
          <div class="payment-info">
            <div class="info-card-header">Forma de pagamento</div>
            <div class="info-card-content">
              <p>${dados.formaPagamento || "Payment method"}</p>
            </div>
          </div>

          <div class="totals-breakdown">
            <div class="total-row subtotal">
              <span class="label">Subtotal</span>
              <span class="value">${formatarMoeda(calcularSubtotalGeral)}</span>
            </div>
            <div class="total-row">
              <span class="label">Lucro (${dados.margemLucro}%)</span>
              <span class="value positive">+${formatarMoeda(calcularLucro)}</span>
            </div>
            <div class="total-row">
              <span class="label">Impostos (${dados.impostos}%)</span>
              <span class="value negative">+${formatarMoeda(calcularImpostos)}</span>
            </div>
            ${
              dados.desconto > 0
                ? `
              <div class="total-row">
                <span class="label">Desconto</span>
                <span class="value negative">-${formatarMoeda(dados.desconto)}</span>
              </div>
            `
                : ""
            }
            ${
              dados.acrescimos > 0
                ? `
              <div class="total-row">
                <span class="label">Acréscimos</span>
                <span class="value positive">+${formatarMoeda(dados.acrescimos)}</span>
              </div>
            `
                : ""
            }
            <div class="total-row final">
              <span class="label">TOTAL</span>
              <span class="value final">${formatarMoeda(calcularTotalFinal)}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="signatures">
          <p style="text-align: center; font-size: 14px; color: #6b7280; margin-bottom: 32px;">
            Confirmo que o serviço foi prestado de acordo com o combinado.
          </p>
          <div class="signatures-grid">
            <div class="signature-line">
              <p>Assinatura do Cliente</p>
            </div>
            <div class="signature-line">
              <p>Data de entrega do serviço: ${formatarData(dados.dataEntrega)}</p>
            </div>
            <div class="signature-line" style="margin-top: 32px;">
              <p>Assinatura do Técnico</p>
            </div>
            <div class="footer-brand" style="margin-top: 32px;">
              <p>nexprice.com.br</p>
            </div>
          </div>
        </div>

        <!-- Controls (hidden in print) -->
        <div class="controls">
          <button class="btn" onclick="window.print()">
            🖨️ Imprimir / Salvar como PDF
          </button>
          <button class="btn btn-secondary" onclick="window.close()">
            ✖️ Fechar
          </button>
        </div>
      </div>

      <script>
        // Auto-focus for better UX
        window.onload = function() {
          document.body.focus();
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
          if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
          }
          if (e.key === 'Escape') {
            window.close();
          }
        });
      </script>
    </body>
    </html>
    `

    // Open new window with PDF content
    const pdfWindow = window.open("", "_blank", "width=900,height=700,scrollbars=yes,resizable=yes")
    if (pdfWindow) {
      pdfWindow.document.write(pdfContent)
      pdfWindow.document.close()
      pdfWindow.focus()
    } else {
      alert("Por favor, permita pop-ups para gerar o PDF")
    }
  }, [
    dados,
    calcularCustoOperacional,
    calcularSubtotalGeral,
    calcularLucro,
    calcularImpostos,
    calcularTotalFinal,
    formatarMoeda,
    formatarData,
  ])

  const handleSaveOrcamento = async () => {
    if (!dados.empresa.id_company || !dados.cliente.id_client) {
      setError("Por favor, selecione uma empresa e um cliente antes de salvar.");
      // Adicionar um toast aqui seria uma boa melhoria
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        ...dados,
        totalFinal: calcularTotalFinal,
      };

      const response = await fetch('/api/dashboard/orcamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar o orçamento.');
      }

      const savedOrcamento = await response.json();
      console.log('Orçamento salvo com sucesso:', savedOrcamento);
      // Adicionar um toast de sucesso aqui

    } catch (err: any) {
      console.error('Erro ao salvar orçamento:', err);
      setError(err.message || 'Ocorreu um erro desconhecido.');
      // Adicionar um toast de erro aqui
    } finally {
      setIsSaving(false);
    }
  };

  // Enhanced print function
  const imprimirOrcamento = useCallback(() => {
    const conteudoOrcamento = document.getElementById("service-quote-pdf")
    if (!conteudoOrcamento) {
      alert("Erro: Conteúdo do orçamento não encontrado")
      return
    }

    // Create print-optimized content
    const printContent = conteudoOrcamento.innerHTML
    const printWindow = window.open("", "_blank", "width=800,height=600")

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Impressão - ${dados.numeroOrdem}</title>
          <meta charset="UTF-8">
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              font-family: Arial, Helvetica, sans-serif !important; 
              margin: 0; 
              padding: 20px; 
              background: white !important;
            }
            .bg-purple-600 { background-color: #9333ea !important; color: white !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            .bg-gray-200 { background-color: #e5e7eb !important; }
            .text-purple-600 { color: #9333ea !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-red-600 { color: #dc2626 !important; }
            table { border-collapse: collapse !important; width: 100% !important; }
            th, td { border: 1px solid #d1d5db !important; padding: 8px !important; }
            th { background-color: #9333ea !important; color: white !important; }
            @page { size: A4; margin: 0.5in; }
            @media print {
              body { -webkit-print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    } else {
      alert("Por favor, permita pop-ups para imprimir")
    }
  }, [dados.numeroOrdem])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className=" mb-6 text-center">
        {/* titulo */}
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-purple-600" />
              Gerador Profissional de Orçamentos
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
              Crie orçamentos precisos com cálculo inteligente de custos e exportação profissional em PDF
        </p>
        <div className="flex justify-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Smart Pricing
              </Badge>
              <Badge variant="outline" className="text-sm">
                <DollarSign className="h-4 w-4 mr-1" />
                Profit Optimization
              </Badge>
              <Badge variant="outline" className="text-sm">
                <FileText className="h-4 w-4 mr-1" />
                Professional PDF
              </Badge>
              <ThemeToggle />
        </div>

        {/* bory */}
        <Tabs defaultValue="setup" className="grid grid-cols-3 gap-2 space-y-6" style={{ gridTemplateColumns: "20% 60% 20%"}}>
            {/* Cost Analysis */}
            <div className="grid grid-rows-1 mt-6 md:grid-rows-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TooltipHelper content="Custo total para executar este serviço (fixos + variáveis)">
                    <p className="text-sm text-gray-600">Custo Operacional</p>
                  </TooltipHelper>
                  <p className="text-xl font-bold text-blue-600">{formatarMoeda(calcularCustoOperacional)}</p>
                </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TooltipHelper content="Valor do lucro baseado na margem definida">
                      <p className="text-sm text-gray-600">Lucro ({dados.margemLucro}%)</p>
                    </TooltipHelper>
                    <p className="text-xl font-bold text-green-600">{formatarMoeda(calcularLucro)}</p>
                  </CardContent>
                </Card>
                <Card>
                <CardContent className="p-4 text-center">
                  <TooltipHelper content="Valor dos impostos sobre o serviço">
                      <p className="text-sm text-gray-600">Impostos ({dados.impostos}%)</p>
                  </TooltipHelper>
                    <p className="text-xl font-bold text-red-600">{formatarMoeda(calcularImpostos)}</p>
                </CardContent>
              </Card>
              <Card>
                          <CardContent className="p-4 text-center">
                            <TooltipHelper content="Preço base antes de descontos e acréscimos">
                              <p className="text-sm text-gray-600">Preço Base</p>
                            </TooltipHelper>
                            <p className="text-xl font-bold text-purple-600">
                              {formatarMoeda(calcularSubtotalGeral + calcularLucro + calcularImpostos)}
                            </p>
                </CardContent>
              </Card>
            </div>
            
            {/* tudo */}
            <Tabs defaultValue="setup" className="col-start-2 grid-2 mt-2 space-y-6">
                  <TabsList className="grid w-90% grid-cols-5">
                    <TabsTrigger value="setup">🏢 Informações</TabsTrigger>
                    <TabsTrigger value="costs">💰 Custos</TabsTrigger>
                    <TabsTrigger value="service">🔧 Serviço</TabsTrigger>
                    {/*<TabsTrigger value="taxes">📊 Impostos</TabsTrigger>*/}
                    <TabsTrigger value="analytics">📈 Análises</TabsTrigger>
                    {/*<TabsTrigger value="boletos">💳 Boletos</TabsTrigger>*/}
                    <TabsTrigger value="quote">📋 Orçamento</TabsTrigger>
                  </TabsList>

                  <TabsContent value="setup" className="space-y-6">
                    {/* Company Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Informações da Empresa
                          </div>
                          <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Empresa
                              </Button>
                            </DialogTrigger>
                            {/* cadastro do empresa */}
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-name" className="text-right">
                                    Nome da Empresa
                                  </Label>
                                  <Input
                                    id="company-name"
                                    value={formDataEmpresas.name}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-cnpj" className="text-right">
                                    CNPJ
                                  </Label>
                                  <Input
                                    id="company-cnpj"
                                    value={formDataEmpresas.cnpj}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, ''); // Remove não dígitos
                                      if (value.length > 14) value = value.slice(0, 14); // Limita a 14 dígitos
                                      // Aplica máscara apenas para exibição
                                      let formattedValue = value;
                                      if (value.length > 2) formattedValue = value.replace(/^(\d{2})(\d)/, '$1.$2');
                                      if (value.length > 5) formattedValue = formattedValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                      if (value.length > 8) formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                      if (value.length > 12) formattedValue = formattedValue.replace(/(\d{4})(\d)/, '$1-$2');
                                      setFormDataEmpresas(prev => ({ ...prev, cnpj: formattedValue }));
                                    }}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-email" className="text-right">Email</Label>
                                  <Input
                                    id="company-email"
                                    type="email"
                                    value={formDataEmpresas.email}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-phone" className="text-right">
                                    Telefone
                                  </Label>
                                  <Input
                                    id="company-phone"
                                    type="tel"
                                    value={formDataEmpresas.phone}
                                    onChange={(e) => {
                                      handleChange(e);
                                      
                                      // Remove todos os caracteres não numéricos e sinais negativos
                                      let value = e.target.value.replace(/\D/g, '').replace(/^-/, '');

                                      // Limita a 11 dígitos
                                      if (value.length > 11) {
                                        value = value.substring(0, 11);
                                      }

                                      // Aplica a máscara de telefone
                                      if (value.length <= 10) {
                                        // Formato para telefone fixo: (XX) XXXX-XXXX
                                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                                      } else if (value.length === 11) {
                                        // Formato para celular: (XX) 9XXXX-XXXX
                                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                                      }

                                      setFormDataEmpresas(prev => ({ ...prev, phone: value }));
                                    }}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-street" className="text-right">
                                    Rua
                                  </Label>
                                  <Input
                                    id="company-street"
                                    value={formDataEmpresas.street}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-number" className="text-right">
                                    Número
                                  </Label>
                                  <Input
                                    id="company-number"
                                    value={formDataEmpresas.number}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-neighborhood" className="text-right">
                                    Bairro
                                  </Label>
                                  <Input
                                    id="company-neighborhood"
                                    value={formDataEmpresas.neighborhood}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-city" className="text-right">
                                    Cidade
                                  </Label>
                                  <Input
                                    id="company-city"
                                    value={formDataEmpresas.city}
                                    onChange={handleChange}
                                    className="col-span-3"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="company-state" className="text-right">
                                    Estado
                                  </Label>
                                  <Select
                                    value={formDataEmpresas.state}
                                    onValueChange={(value) => {
                                      handleChange({
                                        target: {
                                          id: 'company-state',
                                          value: value
                                        }
                                      } as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Selecione um estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO',
                                          'MA','MT','MS','MG','PA','PB','PR','PE','PI',
                                          'RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((sigla) => (
                                          <SelectItem key={sigla} value={sigla}>
                                            {sigla}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="company-cep" className="text-right">CEP</Label>
                                <Input
                                  id="company-cep"
                                  value={formDataEmpresas.cep}
                                  onChange={(e) => {
                                    handleChange(e);
                                    let value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                                    setFormDataEmpresas(prev => ({ ...prev, cep: value }));
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={handleCancelEmpresas}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleSaveEmpresas} disabled={isLoading}>
                                  {isLoading ? 'Salvando...' : 'Salvar Empresa'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div>
                          <TooltipHelper content="Selecione uma empresa cadastrada ou adicione uma nova">
                            <Label>Selecionar Empresa</Label>
                          </TooltipHelper>
                          <Select value={dados.empresaSelecionada} onValueChange={selecionarEmpresa}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha uma empresa cadastrada..." />
                            </SelectTrigger>
                            <SelectContent>
                              {empresasCadastradas.map((empresa) => (
                                <SelectItem key={empresa.id_company} value={empresa.id_company}>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-purple-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded">
                                      {empresa.logoChar}
                                    </div>
                                    <div>
                                      <div className="font-medium">{empresa.nome}</div>
                                      <div className="text-xs text-gray-500">{empresa.cnpj}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {dados.empresaSelecionada && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold text-center mb-2">Detalhes da Empresa Selecionada:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="text-left">
                                <p>
                                  <strong>Nome:</strong> {dados.empresa.nome}
                                </p>
                                <p>
                                  <strong>CNPJ:</strong> {dados.empresa.cnpj}
                                </p>
                                <p>
                                  <strong>Telefone:</strong> {dados.empresa.telefone}
                                </p>
                                <p>
                                  <strong>Email:</strong> {dados.empresa.email}
                                </p>
                              </div>
                              <div className="text-left" >
                                <p>
                                  <strong>Endereço:</strong> {dados.empresa.endereco_rua}, {dados.empresa.endereco_numero}
                                </p>
                                <p>
                                  <strong>Cidade:</strong> {dados.empresa.endereco_cidade}, {dados.empresa.endereco_estado}
                                </p>
                                <p>CEP: {dados.empresa.endereco_cep}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>



                    {/* Client Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Informações do Cliente
                          </div>
                          <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Cliente
                              </Button>
                            </DialogTrigger>
                            {/* cadastro do cliente */}
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-name" className="text-right">
                                    Nome Completo
                                  </Label>
                                  <Input
                                    id="client-name"
                                    type="text"
                                    value={formDataClient.nome}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-cpf" className="text-right">
                                    CPF
                                  </Label>
                                  <Input
                                    id="client-cpf"
                                    value={formDataClient.cpf}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length > 11) value = value.slice(0, 11);
                                      let formattedValue = value;
                                      if (value.length > 3) formattedValue = value.replace(/^(\d{3})(\d)/, '$1.$2');
                                      if (value.length > 6) formattedValue = formattedValue.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                                      if (value.length > 9) formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, '.$1-$2');
                                      handleChangeClient({ 
                                        target: { 
                                          id: 'client-cpf', 
                                          value: formattedValue 
                                        } 
                                      } as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                    className="col-span-3"
                                    placeholder="000.000.000-00"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-email" className="text-right">Email</Label>
                                  <Input
                                    id="client-email"
                                    type="email"
                                    value={formDataClient.email}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-phone" className="text-right">
                                    Telefone
                                  </Label>
                                  <Input
                                    id="client-phone"
                                    type="tel"
                                    value={formDataClient.telefone}
                                    onChange={(e) => {
                                      // Remove tudo que não for dígito e evita números negativos
                                      let value = e.target.value.replace(/\D/g, '').replace(/^-/, '');

                                      // Limita a 11 dígitos
                                      if (value.length > 11) {
                                        value = value.substring(0, 11);
                                      }

                                      // Aplica a máscara de telefone (XX) XXXXX-XXXX
                                      let formattedValue = value;
                                      if (value.length > 0) {
                                        formattedValue = `(${value.substring(0, 2)}`;
                                      }
                                      if (value.length > 2) {
                                        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}`;
                                      }
                                      if (value.length > 7) {
                                        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
                                      }

                                      setFormDataClient(prev => ({ ...prev, telefone: formattedValue }));
                                    }}
                                    className="col-span-3"
                                    placeholder="(00) 00000-0000"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-street" className="text-right">
                                    Rua
                                  </Label>
                                  <Input
                                    id="client-street"
                                    value={formDataClient.endereco_rua}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-number" className="text-right">
                                    Número
                                  </Label>
                                  <Input
                                    id="client-number"
                                    value={formDataClient.endereco_numero}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-city" className="text-right">
                                    Cidade
                                  </Label>
                                  <Input
                                    id="client-city"
                                    value={formDataClient.endereco_cidade}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-state" className="text-right">
                                    Estado
                                  </Label>
                                  <Select
                                    value={formDataClient.endereco_estado}
                                    onValueChange={(value) => {
                                      handleChangeClient({
                                        target: {
                                          id: 'client-state',
                                          value: value
                                        }
                                      } as React.ChangeEvent<HTMLInputElement>);
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Selecione um estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO',
                                          'MA','MT','MS','MG','PA','PB','PR','PE','PI',
                                          'RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((sigla) => (
                                          <SelectItem key={sigla} value={sigla}>
                                            {sigla}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-cep" className="text-right">CEP</Label>
                                  <Input
                                    id="client-cep"
                                    value={formDataClient.endereco_cep}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                                      setFormDataClient(prev => ({ ...prev, endereco_cep: value }));
                                    }}
                                    className="col-span-3"
                                    placeholder="00000-000"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="client-notes" className="text-right">
                                    Observações
                                  </Label>
                                  <Input
                                    id="client-notes"
                                    value={formDataClient.observacoes}
                                    onChange={handleChangeClient}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={handleCancelCliente}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleSaveClient} disabled={isLoading}>
                                  {isLoading ? 'Salvando...' : 'Salvar Cliente'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <TooltipHelper content="Selecione um cliente cadastrado ou adicione um novo">
                            <Label>Selecionar Cliente</Label>
                          </TooltipHelper>
                          <Select value={dados.clienteSelecionado} onValueChange={selecionarCliente}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha um cliente cadastrado..." />
                            </SelectTrigger>
                            <SelectContent>
                              {clientesCadastrados.map((cliente) => (
                                <SelectItem key={cliente.id_client} value={cliente.id_client}>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">{cliente.nome}</div>
                                    <div className="text-xs text-gray-500">
                                     <strong>CNPJ:</strong>{cliente.cpf} • <strong>Telefone:</strong>{cliente.telefone}
                                    </div>
                                    {cliente.observacoes && <div className="text-xs text-blue-600">{cliente.observacoes}</div>}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {dados.clienteSelecionado && (
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Detalhes do Cliente Selecionado:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="text-left" >
                                <p>
                                  <strong>Nome:</strong> {dados.cliente.nome}
                                </p>
                                <p>
                                  <strong>CPF:</strong> {dados.cliente.cpf}
                                </p>
                                <p>
                                  <strong>Telefone:</strong> {dados.cliente.telefone}
                                </p>
                                <p>
                                  <strong>Email:</strong> {dados.cliente.email}
                                </p>
                              </div>
                              <div className="text-left" >
                                <p>
                                  <strong>Endereço:</strong> {dados.cliente.endereco_rua}, {dados.cliente.endereco_numero}                            
                                </p>
                                <p>
                                  <strong>Cidade:</strong>{dados.cliente.endereco_cidade}, {dados.cliente.endereco_estado}
                                </p>
                                <p>CEP: {dados.cliente.endereco_cep}</p>
                                {dados.cliente.observacoes && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
                                    <strong>Observações:</strong> {dados.cliente.observacoes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Business Configuration */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Configuração do Negócio</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                          <div>
                            <TooltipHelper content="Percentual de lucro que você deseja obter sobre os custos. Recomendado: 25% ou mais">
                              <Label htmlFor="margem-lucro">Margem de Lucro (%)</Label>
                            </TooltipHelper>
                            <Input
                              id="margem-lucro"
                              type="number"
                              value={dados.margemLucro}
                              onChange={(e) => setDados((prev) => ({ ...prev, margemLucro: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <TooltipHelper content="Percentual de impostos que incidem sobre o serviço (Simples Nacional, ISS, etc.)">
                              <Label htmlFor="impostos">Impostos (%)</Label>
                            </TooltipHelper>
                            <Input
                              id="impostos"
                              type="number"
                              step="0.1"
                              value={dados.impostos}
                              onChange={(e) => setDados((prev) => ({ ...prev, impostos: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* custo */}
                    
                  <TabsContent value="costs" className="space-y-6">
                      {/* Salary Inclusion Option */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Configuração de Custos</span>
                            <div className="flex items-center space-x-2">
                              <TooltipHelper content="Ative esta opção se você quer incluir salários e pró-labore no cálculo dos custos. Desative para serviços que não envolvem custos de pessoal.">
                                <Label htmlFor="incluir-salarios" className="text-sm font-normal">
                                  Incluir Salários/Pró-labore
                                </Label>
                              </TooltipHelper>
                              <Switch
                                id="incluir-salarios"
                                checked={dados.incluirSalarios}
                                onCheckedChange={(checked) => setDados((prev) => ({ ...prev, incluirSalarios: checked }))}
                              />
                            </div>
                          </CardTitle>
                        </CardHeader>
                        {!dados.incluirSalarios && (
                          <CardContent>
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                Salários e pró-labore foram <strong>excluídos</strong> do cálculo de custos. Ideal para serviços
                                que não envolvem custos de pessoal.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        )}
                      </Card>

                      {/* Fixed Costs */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <TooltipHelper content="Gastos que você tem todo mês, independente de quantos serviços fizer (aluguel, energia, internet, etc.)">
                              <span>Custos Fixos Mensais</span>
                            </TooltipHelper>
                            <Button onClick={adicionarCustoFixo} size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Custo
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="space-y-3">
                          {dados.custosFixos.map((custo) => {
                            const isSalario =
                              custo.descricao.toLowerCase().includes("salário") ||
                              custo.descricao.toLowerCase().includes("pró-labore");
                            const isExcluded = !dados.incluirSalarios && isSalario;

                            return (
                              <div key={custo.id} className={`flex gap-3 items-center ${isExcluded ? "opacity-50" : ""}`}>
                                <div className="flex-1">
                                  <Input
                                    placeholder="Descrição do custo"
                                    value={custo.descricao}
                                    onChange={(e) => atualizarCustoFixo(custo.id, "descricao", e.target.value)}
                                    disabled={isExcluded}
                                  />
                                </div>
                                <div className="w-32">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0" // Impede valores negativos via controle do navegador
                                    placeholder="R$ 0,00"
                                    value={custo.valor}
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      if (value >= 0) { // Validação para garantir que não seja negativo
                                        atualizarCustoFixo(custo.id, "valor", value);
                                      }
                                    }}
                                    disabled={isExcluded}
                                  />
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => removerCustoFixo(custo.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {isExcluded && (
                                  <Badge variant="secondary" className="text-xs">
                                    Excluído
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                          <div className="flex justify-between items-center pt-3 border-t">
                            <span className="font-semibold">Total Custos Fixos:</span>
                            <span className="font-bold text-lg text-red-600">{formatarMoeda(calcularTotalCustosFixos)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Custo por Hora:</span>
                            <span className="text-sm font-semibold text-blue-600">{formatarMoeda(calcularCustoHora)}</span>
                          </div>
                        </div>
                        </CardContent>
                      </Card>

                      {/* Enhanced Variable Costs */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <TooltipHelper content="Gastos que variam conforme cada serviço (materiais, combustível, peças, etc.)">
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                <span>Custos Variáveis por Serviço</span>
                              </div>
                            </TooltipHelper>
                            <Button onClick={adicionarCustoVariavel} size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Custo
                            </Button>
                          </CardTitle>
                        </CardHeader>

                        {/*Carda de custo */}
                        <CardContent>
                          <div className="space-y-4">
                            {dados.custosVariaveis.map((custo) => (
                              <div key={custo.id} className="p-4 border rounded-lg bg-muted">
                                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-cols-[10%_45%_auto_auto_5%] gap-4">
                                  
                                  {/* lista de cadegoria */}
                                  <div>
                                    <TooltipHelper content="Tipo de custo variável">
                                      <Label className="text-xs">Categoria</Label>
                                    </TooltipHelper>
                                    <Select
                                      value={custo.categoria}
                                      onValueChange={(value) => atualizarCustoVariavel(custo.id, "categoria", value)}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Material">📦 Material</SelectItem>
                                        <SelectItem value="Transporte">🚗 Transporte</SelectItem>
                                        <SelectItem value="Ferramenta">🔧 Ferramentas</SelectItem>
                                        <SelectItem value="Terceirizado">👥 Terceirizado</SelectItem>
                                        <SelectItem value="Equipamento">⚙️ Equipamento</SelectItem>
                                        <SelectItem value="Outros">📋 Outros</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* descriçao */}
                                  <div className="md:col-span-2">
                                    <TooltipHelper content="Descrição detalhada do custo">
                                      <Label className="text-xs">Descrição</Label>
                                    </TooltipHelper>
                                    <Input
                                      className="h-8"
                                      placeholder="ex: Parafusos M6, Gasolina, etc."
                                      value={custo.descricao}
                                      onChange={(e) => atualizarCustoVariavel(custo.id, "descricao", e.target.value)}
                                    />
                                  </div>
                                  
                                  {/* valores QT e unidade */}
                                  <div className="grid grid-cols-1 md:grid-cols-[auto_auto_25%] gap-2">
                                    <div>
                                      <TooltipHelper content="Valor unitário ou total do custo">
                                        <Label className="text-xs">Valor (R$)</Label>
                                      </TooltipHelper>
                                      <Input
                                        className="h-8"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0,00"
                                        value={custo.valor}
                                        onChange={(e) => {
                                          const value = Number(e.target.value);
                                          if (value >= 0) {
                                            atualizarCustoVariavel(custo.id, "valor", value);
                                          }
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <TooltipHelper content="Quantidade total">
                                        <Label className="text-xs">QT</Label>
                                      </TooltipHelper>
                                      <Input
                                        className="h-8"
                                        type="number"
                                        step="1"
                                        min="0"
                                        placeholder="0,00"
                                        value={custo.quantidade}
                                        onChange={(e) => {
                                          const value = Number(e.target.value);
                                          if (value >= 0) {
                                            atualizarCustoVariavel(custo.id, "quantidade", value);
                                          }
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <TooltipHelper content="Unidade de medida (kg, litros, unidades, etc.)">
                                        <Label className="text-xs">Unidade</Label>
                                      </TooltipHelper>
                                      <Select
                                        value={custo.unidade}
                                        onValueChange={(value) => atualizarCustoVariavel(custo.id, "unidade", value)}
                                      >
                                        <SelectTrigger className="h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="unidade">un</SelectItem>
                                          <SelectItem value="kg">kg</SelectItem>
                                          <SelectItem value="litros">L</SelectItem>
                                          <SelectItem value="metros">m</SelectItem>
                                          <SelectItem value="horas">h</SelectItem>
                                          <SelectItem value="dias">dias</SelectItem>
                                          <SelectItem value="pacote">pacote</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  {/* botão de lixo */}
                                  <div className="flex items-end w-10">
                                    <Button variant="destructive" size="sm" onClick={() => removerCustoVariavel(custo.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                </div>

                                 {/* observaçâo */}
                                 <div className="grid grid-cols-1 md:grid-cols-[80%_auto] gap-2">
                                    <div className="mt-2">
                                  <TooltipHelper content="Observações adicionais sobre este custo">
                                    <Label className="text-xs">Observações</Label>
                                  </TooltipHelper>
                                  <Input
                                    className="h-8 text-xs"
                                    placeholder="Observações adicionais sobre este custo..."
                                    value={custo.observacoes}
                                    onChange={(e) => atualizarCustoVariavel(custo.id, "observacoes", e.target.value)}
                                  />
                                    </div>
                                    <div className="mt-2">
                                    <TooltipHelper content="Valor todal desse material">
                                      <Label className="text-xs">Valor do material</Label>
                                    </TooltipHelper>
                                    <p className="text-xl h-8 text-left font-bold text-blue-600">{formatarMoeda((custo.valor || 0)*(custo.quantidade || 0))}</p>
                                    </div>
                                 </div>
                                

                              </div>
                            ))}

                            {dados.custosVariaveis.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum custo variável adicionado ainda</p>
                                <p className="text-sm">
                                  Clique em "Adicionar Custo" para incluir materiais, transporte, ferramentas, etc.
                                </p>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t">
                              <span className="font-semibold">Total Custos Variáveis:</span>
                              <span className="font-bold text-lg text-orange-600">
                                {formatarMoeda(calcularTotalCustosVariaveis)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                  </TabsContent>
                    
                  <TabsContent value="service" className="space-y-6">
                    {/* Service Configuration */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Configuração do Serviço</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 
                          <div>
                            <TooltipHelper content="Número único para identificar este orçamento">
                              <Label htmlFor="numero-ordem">Número da Orçamento</Label>
                            </TooltipHelper>
                            <Input
                              id="numero-ordem"
                              value={dados.numeroOrdem}
                              onChange={(e) => setDados((prev) => ({ ...prev, numeroOrdem: e.target.value }))}
                            />
                          </div>
                            */}
                          <div>
                            <TooltipHelper content="Data de criação do orçamento">
                              <Label htmlFor="data">Data</Label>
                            </TooltipHelper>
                            <Input
                              id="data"
                              type="date"
                              value={dados.data}
                              onChange={(e) => setDados((prev) => ({ ...prev, data: e.target.value }))}
                            />
                          </div>
                           {/*Tempo de Execução */}
                           <div>
                              <TooltipHelper content="Selecione o período de execução do projeto">
                                <Label>Período de Execução</Label>
                              </TooltipHelper>
                              <DateRangeSelector 
                                workDays={[true, true, true, true, true, false, false]}
                                hoursPerDay={8}
                              />
                            </div>
                        </div>
                        <div>
                          <TooltipHelper content="Descrição detalhada do que será feito no serviço">
                            <Label htmlFor="descricao-servico">Descrição do Serviço</Label>
                          </TooltipHelper>
                          <Textarea
                            id="descricao-servico"
                            value={dados.descricaoServico}
                            onChange={(e) => setDados((prev) => ({ ...prev, descricaoServico: e.target.value }))}
                            placeholder="Descrição detalhada do serviço a ser prestado..."
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment and Adjustments */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <TooltipHelper content="Como o cliente vai pagar pelo serviço (à vista, parcelado, etc.)">
                              Forma de Pagamento
                            </TooltipHelper>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PaymentMethodSelector
                            value={dados.formaPagamento}
                            onChange={(value) => setDados((prev) => ({ ...prev, formaPagamento: value }))}
                            customTerms={dados.condicoesPersonalizadas || ""}
                            onCustomTermsChange={(value) => setDados((prev) => ({ ...prev, condicoesPersonalizadas: value }))}
                          />
                        </CardContent>
                      </Card>
                      {/* 
                      <Card>
                        <CardHeader>
                          <CardTitle>Ajustes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <TooltipHelper content="Valor de desconto a ser aplicado no total final">
                              <Label htmlFor="desconto">Desconto</Label>
                            </TooltipHelper>
                            <Input
                              id="desconto"
                              type="number"
                              step="0.01"
                              value={dados.desconto}
                              onChange={(e) => setDados((prev) => ({ ...prev, desconto: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <TooltipHelper content="Valores extras a serem adicionados (urgência, complexidade, etc.)">
                              <Label htmlFor="acrescimos">Acréscimos</Label>
                            </TooltipHelper>
                            <Input
                              id="acrescimos"
                              type="number"
                              step="0.01"
                              value={dados.acrescimos}
                              onChange={(e) => setDados((prev) => ({ ...prev, acrescimos: Number(e.target.value) }))}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      */}
                    </div>
                  </TabsContent>

                  <TabsContent value="taxes" className="space-y-6">
                    <TaxCalculator receitaBruta={calcularTotalFinal} onTaxChange={handleTaxChange} />
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-6">
                    <FinancialCharts
                      custosFixos={calcularTotalCustosFixos}
                      custosVariaveis={calcularTotalCustosVariaveis}
                      margemLucro={dados.margemLucro}
                      receitaLiquida={calcularTotalFinal}
                      impostos={impostosDetalhados.total}
                    />
                  </TabsContent>
{/* boletos 
                  <TabsContent value="boletos" className="space-y-6">
                    <BoletoGenerator
                      valorTotal={calcularTotalFinal}
                      clienteNome={dados.cliente.nome}
                      clienteCpf={dados.cliente.cpf}
                      clienteEndereco={`${dados.cliente.endereco_rua}, ${dados.cliente.endereco_numero} - ${dados.cliente.endereco_cidade}, ${dados.cliente.endereco_estado}`}
                      empresaNome={dados.empresa.nome}
                      empresaCnpj={dados.empresa.cnpj}
                      numeroOrdem={dados.numeroOrdem}
                    />
                  </TabsContent>
*/}
                  <TabsContent value="quote">
                    <OrcamentoDetalhado
                      dados={dados}
                      calcularCustoOperacional={calcularCustoOperacional}
                      calcularSubtotalGeral={calcularSubtotalGeral}
                      calcularLucro={calcularLucro}
                      calcularImpostos={calcularImpostos}
                      calcularTotalFinal={calcularTotalFinal}
                      formatarMoeda={formatarMoeda}
                      formatarData={formatarData}
                      gerarPDF={gerarPDF}
                      imprimirOrcamento={imprimirOrcamento}
                      handleSaveOrcamento={handleSaveOrcamento}
                      custosFixos={dados.custosFixos}
                    />
                    {/* Financial Summary */}
                    <Alert className="mt-6">
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <strong>Custo Operacional:</strong>
                            <br />
                            {formatarMoeda(calcularCustoOperacional)}
                            {!dados.incluirSalarios && <div className="text-xs text-gray-500">*Salários excluídos</div>}
                          </div>
                          <div>
                            <strong>Lucro Líquido:</strong>
                            <br />
                            <span className="text-green-600">{formatarMoeda(calcularLucro)}</span>
                          </div>
                          <div>
                            <strong>Margem de Lucro:</strong>
                            <br />
                            {dados.margemLucro}%
                          </div>
                          <div>
                            <strong>Preço Final:</strong>
                            <br />
                            <span className="text-purple-600 font-bold">{formatarMoeda(calcularTotalFinal)}</span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
            </Tabs>

            {/* relatorio */}
            <div className=" col-start-3 top-20 w-80 h-[calc(100vh-6rem)] overflow-y-auto ">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Relatório de Custos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Fixed Costs Section */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Custos Fixos Mensais</h3>
                        {dados.custosFixos.length === 0 ? (
                          <p className="text-sm text-gray-500">Nenhum custo fixo adicionado.</p>
                        ) : (
                          <ul className="space-y-2">
                            {dados.custosFixos.map((custo) => {
                              const isSalario =
                                custo.descricao.toLowerCase().includes("salário") ||
                                custo.descricao.toLowerCase().includes("pró-labore");
                              const isExcluded = !dados.incluirSalarios && isSalario;

                              return (
                                <li
                                  key={custo.id}
                                  className={`text-sm flex justify-between ${isExcluded ? "opacity-50" : ""}`}
                                >
                                  <span>{custo.descricao}</span>
                                  <span className="flex items-center gap-2">
                                    {formatarMoeda(custo.valor)}
                                    {isExcluded && <Badge variant="secondary" className="text-xs">Excluído</Badge>}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        <div className="mt-3 pt-2 border-t">
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Total:</span>
                            <span className="text-red-600">{formatarMoeda(calcularTotalCustosFixos)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Variable Costs Section */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Custos Variáveis por Serviço</h3>
                        {dados.custosVariaveis.length === 0 ? (
                          <p className="text-sm text-gray-500">Nenhum custo variável adicionado.</p>
                        ) : (
                          <ul className="space-y-2">
                            {dados.custosVariaveis.map((custo) => (
                              <li key={custo.id} className="text-sm">
                                <div className="flex justify-between">
                                  <span>{custo.descricao} ({custo.categoria})</span>
                                  <span>{formatarMoeda((custo.valor || 0)*(custo.quantidade || 0))}</span>
                                </div>
                                {custo.observacoes && (
                                  <p className="text-xs text-gray-500 italic">{custo.observacoes}</p>
                                )}
                                <p className="text-xs text-gray-600">{custo.unidade}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-3 pt-2 border-t">
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Total:</span>
                            <span className="text-orange-600">{formatarMoeda(calcularTotalCustosVariaveis)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            </div>

        </Tabs> 
      </div>   
    </div>

  )
}

export default function ServiceQuoteGenerator() {
  return (
    <DateRangeProvider>
      <ServiceQuoteGeneratorContent />
    </DateRangeProvider>
  );
}
