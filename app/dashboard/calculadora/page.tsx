"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  observacoes: string
}

interface Company {
  id: string
  nome: string
  cnpj: string
  endereco: {
    rua: string
    numero: string
    cidade: string
    estado: string
    cep: string
  }
  telefone: string
  email: string
  logoChar: string
}

interface Client {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco: {
    rua: string
    numero: string
    cidade: string
    estado: string
    cep: string
  }
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
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default function ServiceQuoteGenerator() {
  // Mock data for companies and clients
  const [empresasCadastradas] = useState<Company[]>([
    {
      id: "1",
      nome: "TechSolutions Ltda",
      cnpj: "12.345.678/0001-90",
      endereco: { rua: "Av. Paulista", numero: "1000", cidade: "São Paulo", estado: "SP", cep: "01310-100" },
      telefone: "(11) 99999-1111",
      email: "contato@techsolutions.com",
      logoChar: "TS",
    },
    {
      id: "2",
      nome: "Consultoria Digital ME",
      cnpj: "98.765.432/0001-10",
      endereco: { rua: "Rua das Flores", numero: "500", cidade: "Rio de Janeiro", estado: "RJ", cep: "20000-000" },
      telefone: "(21) 88888-2222",
      email: "info@consultoriadigital.com",
      logoChar: "CD",
    },
  ])

  const [clientesCadastrados] = useState<Client[]>([
    {
      id: "1",
      nome: "João Silva Santos",
      cpf: "123.456.789-00",
      telefone: "(11) 97777-3333",
      email: "joao.silva@email.com",
      endereco: { rua: "Rua A", numero: "123", cidade: "São Paulo", estado: "SP", cep: "01000-000" },
      observacoes: "Cliente preferencial - pagamento à vista",
    },
    {
      id: "2",
      nome: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      telefone: "(21) 96666-4444",
      email: "maria.costa@email.com",
      endereco: { rua: "Rua B", numero: "456", cidade: "Rio de Janeiro", estado: "RJ", cep: "20000-000" },
      observacoes: "Empresa parceira - desconto 5%",
    },
    {
      id: "3",
      nome: "Pedro Ferreira Lima",
      cpf: "456.789.123-00",
      telefone: "(11) 95555-5555",
      email: "pedro.lima@email.com",
      endereco: { rua: "Rua C", numero: "789", cidade: "São Paulo", estado: "SP", cep: "02000-000" },
      observacoes: "Novo cliente - primeira contratação",
    },
  ])

  const [dados, setDados] = useState<QuoteData>({
    empresaSelecionada: "",
    empresa: {
      id: "",
      nome: "",
      cnpj: "",
      endereco: { rua: "", numero: "", cidade: "", estado: "", cep: "" },
      telefone: "",
      email: "",
      logoChar: "",
    },
    clienteSelecionado: "",
    cliente: {
      id: "",
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      endereco: { rua: "", numero: "", cidade: "", estado: "", cep: "" },
      observacoes: "",
    },
    numeroOrdem: `OS-${Date.now().toString().slice(-6)}`,
    data: new Date().toISOString().split("T")[0],
    dataEntrega: "",
    descricaoServico: "",
    enderecoCobranca: "",
    localPrestacao: {
      nome: "",
      tipoDocumento: "CPF",
      documento: "",
      endereco: { rua: "", numero: "", cidade: "", estado: "" },
    },
    horasTrabalhadasMes: 160,
    custosFixos: [
      { id: "1", descricao: "Aluguel/Financiamento", valor: 0 },
      { id: "2", descricao: "Energia Elétrica", valor: 0 },
      { id: "3", descricao: "Internet/Telefone", valor: 0 },
      { id: "4", descricao: "Salários/Pró-labore", valor: 0 },
    ],
    custosVariaveis: [],
    margemLucro: 30,
    impostos: 8,
    tempoExecucao: 1,
    incluirSalarios: true,
    itens: [],
    formaPagamento: "",
    desconto: 0,
    acrescimos: 0,
    condicoesPersonalizadas: "",
  })

  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false)
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)

  // Estado para impostos detalhados com valores iniciais seguros
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

  // Company selection
  const selecionarEmpresa = useCallback(
    (empresaId: string) => {
      const empresa = empresasCadastradas.find((e) => e.id === empresaId)
      if (empresa) {
        setDados((prev) => ({
          ...prev,
          empresaSelecionada: empresaId,
          empresa: empresa,
        }))
      }
    },
    [empresasCadastradas],
  )

  // Client selection
  const selecionarCliente = useCallback(
    (clienteId: string) => {
      const cliente = clientesCadastrados.find((c) => c.id === clienteId)
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
    return dados.custosVariaveis.reduce((total, custo) => total + (custo.valor || 0), 0)
  }, [dados.custosVariaveis])

  const calcularCustoHora = useMemo(() => {
    return dados.horasTrabalhadasMes > 0 ? calcularTotalCustosFixos / dados.horasTrabalhadasMes : 0
  }, [calcularTotalCustosFixos, dados.horasTrabalhadasMes])

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
              <p>${dados.empresa.endereco.rua || "Street"}, ${dados.empresa.endereco.numero || "Number"}</p>
              <p>${dados.empresa.endereco.cidade || "City"}, ${dados.empresa.endereco.estado || "State"}</p>
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
              <p><strong>Endereço:</strong> ${dados.cliente.endereco.rua || "Street"}, ${
                dados.cliente.endereco.numero || "Number"
              } - ${dados.cliente.endereco.cidade || "City"}, ${dados.cliente.endereco.estado || "State"}</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
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
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="setup">🏢 Configuração</TabsTrigger>
            <TabsTrigger value="costs">💰 Custos</TabsTrigger>
            <TabsTrigger value="service">🔧 Serviço</TabsTrigger>
            <TabsTrigger value="taxes">📊 Impostos</TabsTrigger>
            <TabsTrigger value="analytics">📈 Análises</TabsTrigger>
            <TabsTrigger value="boletos">💳 Boletos</TabsTrigger>
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                      </DialogHeader>
                      <div className="text-center py-8 text-gray-500">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Formulário de cadastro de empresa seria implementado aqui</p>
                        <p className="text-sm">Isso permitiria adicionar novas empresas ao banco de dados</p>
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
                        <SelectItem key={empresa.id} value={empresa.id}>
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
                    <h4 className="font-semibold mb-2">Detalhes da Empresa Selecionada:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
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
                      <div>
                        <p>
                          <strong>Endereço:</strong>
                        </p>
                        <p>
                          {dados.empresa.endereco.rua}, {dados.empresa.endereco.numero}
                        </p>
                        <p>
                          {dados.empresa.endereco.cidade}, {dados.empresa.endereco.estado}
                        </p>
                        <p>CEP: {dados.empresa.endereco.cep}</p>
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                      </DialogHeader>
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Formulário de cadastro de cliente seria implementado aqui</p>
                        <p className="text-sm">Isso permitiria adicionar novos clientes ao banco de dados</p>
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
                        <SelectItem key={cliente.id} value={cliente.id}>
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-xs text-gray-500">
                              {cliente.cpf} • {cliente.telefone}
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
                      <div>
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
                      <div>
                        <p>
                          <strong>Endereço:</strong>
                        </p>
                        <p>
                          {dados.cliente.endereco.rua}, {dados.cliente.endereco.numero}
                        </p>
                        <p>
                          {dados.cliente.endereco.cidade}, {dados.cliente.endereco.estado}
                        </p>
                        <p>CEP: {dados.cliente.endereco.cep}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TooltipHelper content="Total de horas que você trabalha por mês. Usado para calcular o custo por hora dos gastos fixos">
                      <Label htmlFor="horas-mes">Horas Trabalhadas/Mês</Label>
                    </TooltipHelper>
                    <Input
                      id="horas-mes"
                      type="number"
                      value={dados.horasTrabalhadasMes}
                      onChange={(e) => setDados((prev) => ({ ...prev, horasTrabalhadasMes: Number(e.target.value) }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">ex: 8h/dia × 20 dias = 160h</p>
                  </div>
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
                      custo.descricao.toLowerCase().includes("pró-labore")
                    const isExcluded = !dados.incluirSalarios && isSalario

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
                            placeholder="R$ 0,00"
                            //value={custo.valor}
                            onChange={(e) => atualizarCustoFixo(custo.id, "valor", Number(e.target.value))}
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
                    )
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
              <CardContent>
                <div className="space-y-4">
                  {dados.custosVariaveis.map((custo) => (
                    <div key={custo.id} className="p-4 border rounded-lg bg-muted">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                        <div>
                          <TooltipHelper content="Valor unitário ou total do custo">
                            <Label className="text-xs">Valor (R$)</Label>
                          </TooltipHelper>
                          <Input
                            className="h-8"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            //value={custo.valor}
                            onChange={(e) => atualizarCustoVariavel(custo.id, "valor", Number(e.target.value))}
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
                        <div className="flex items-end">
                          <Button variant="destructive" size="sm" onClick={() => removerCustoVariavel(custo.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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

            {/* Cost Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </TabsContent>

          <TabsContent value="service" className="space-y-6">
            {/* Service Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div>
                    <TooltipHelper content="Quantas horas você vai levar para executar este serviço">
                      <Label htmlFor="tempo-execucao">Tempo de Execução (horas)</Label>
                    </TooltipHelper>
                    <Input
                      id="tempo-execucao"
                      type="number"
                      step="0.5"
                      value={dados.horasTrabalhadasMes}
                      //value={dados.tempoExecucao}
                      onChange={(e) => setDados((prev) => ({ ...prev, tempoExecucao: Number(e.target.value) }))}
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

            {/* Service Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <TooltipHelper content="Produtos ou serviços específicos que serão cobrados separadamente">
                    <span>Itens do Serviço</span>
                  </TooltipHelper>
                  <Button onClick={adicionarItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dados.itens.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <TooltipHelper content="Quantidade deste item/serviço">
                          <Label>Quantidade</Label>
                        </TooltipHelper>
                        <Input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => atualizarItem(item.id, "quantidade", Number(e.target.value))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TooltipHelper content="Descrição do produto ou serviço">
                          <Label>Descrição</Label>
                        </TooltipHelper>
                        <Input
                          value={item.descricao}
                          onChange={(e) => atualizarItem(item.id, "descricao", e.target.value)}
                        />
                      </div>
                      <div>
                        <TooltipHelper content="Preço unitário de cada item">
                          <Label>Preço Unitário</Label>
                        </TooltipHelper>
                        <Input
                          type="number"
                          step="0.01"
                          //value={item.precoUnitario}
                          onChange={(e) => atualizarItem(item.id, "precoUnitario", Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <TooltipHelper content="Total calculado automaticamente (quantidade × preço unitário)">
                            <Label>Total</Label>
                          </TooltipHelper>
                          <Input value={formatarMoeda(item.totalItem)} readOnly className="bg-muted" />
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removerItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment and Adjustments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <TabsContent value="boletos" className="space-y-6">
            <BoletoGenerator
              valorTotal={calcularTotalFinal}
              clienteNome={dados.cliente.nome}
              clienteCpf={dados.cliente.cpf}
              clienteEndereco={`${dados.cliente.endereco.rua}, ${dados.cliente.endereco.numero} - ${dados.cliente.endereco.cidade}, ${dados.cliente.endereco.estado}`}
              empresaNome={dados.empresa.nome}
              empresaCnpj={dados.empresa.cnpj}
              numeroOrdem={dados.numeroOrdem}
            />
          </TabsContent>

          <TabsContent value="quote">
            {/* Professional Quote Document */}
            <div id="service-quote-pdf" className="bg-white">
              <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg print:shadow-none">
                <div className="page-content">
                  {/* Header */}
                  <header className="flex justify-between items-start pb-4 border-b">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="bg-purple-600 text-white font-bold text-2xl w-20 h-10 flex items-center justify-center rounded">
                          {dados.empresa.logoChar || "XX"}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{dados.empresa.nome || "Company Name"}</h2>
                        <p className="text-sm text-gray-600">CNPJ {dados.empresa.cnpj || "00.000.000/0000-00"}</p>
                        <p className="text-sm text-gray-600">
                          {dados.empresa.endereco.rua || "Street"}, {dados.empresa.endereco.numero || "Number"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dados.empresa.endereco.cidade || "City"}, {dados.empresa.endereco.estado || "State"}
                        </p>
                        <p className="text-sm text-gray-600">Telefone {dados.empresa.telefone || "(00) 0000-0000"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-3xl font-bold text-gray-800">ORÇAMENTO</h1>
                      <div className="mt-2 border border-gray-300 rounded-md p-2 text-left">
                        <p className="text-sm">
                          <span className="font-semibold">Ordem nº:</span> {dados.numeroOrdem}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Data:</span> {formatarData(dados.data)}
                        </p>
                      </div>
                    </div>
                  </header>

                  {/* Client and Billing Information */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="border border-gray-300 rounded-md">
                      <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">Cliente</div>
                      <div className="p-3 text-sm text-gray-700">
                        <p>
                          <strong>Nome:</strong> {dados.cliente.nome || "Client Name"}
                        </p>
                        <p>
                          <strong>CPF:</strong> {dados.cliente.cpf || "000.000.000-00"}
                        </p>
                        <p>
                          <strong>Endereço:</strong> {dados.cliente.endereco.rua || "Street"},{" "}
                          {dados.cliente.endereco.numero || "Number"} - {dados.cliente.endereco.cidade || "City"},{" "}
                          {dados.cliente.endereco.estado || "State"}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {dados.cliente.telefone || "(00) 0000-0000"}
                        </p>
                      </div>
                    </div>
                    <div className="border border-gray-300 rounded-md">
                      <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">
                        Endereço de cobrança
                      </div>
                      <div className="p-3 text-sm text-gray-700">
                        <p>{dados.enderecoCobranca || "Billing address"}</p>
                      </div>
                    </div>
                  </section>

                  {/* Service Description and Location */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="border border-gray-300 rounded-md">
                      <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">
                        Descrição do serviço
                      </div>
                      <div className="p-3 text-sm text-gray-700">
                        <p>{dados.descricaoServico || "Service description"}</p>
                      </div>
                    </div>
                    <div className="border border-gray-300 rounded-md">
                      <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">Local de prestação</div>
                      <div className="p-3 text-sm text-gray-700">
                        <p>
                          <strong>Nome:</strong> {dados.localPrestacao.nome || "Service Location"}
                        </p>
                        <p>
                          <strong>{dados.localPrestacao.tipoDocumento}:</strong>{" "}
                          {dados.localPrestacao.documento || "000.000.000-00"}
                        </p>
                        <p>
                          <strong>Endereço:</strong> {dados.localPrestacao.endereco.rua || "Street"},{" "}
                          {dados.localPrestacao.endereco.numero || "Number"} -{" "}
                          {dados.localPrestacao.endereco.cidade || "City"},{" "}
                          {dados.localPrestacao.endereco.estado || "State"}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Items Table */}
                  <section className="mt-6">
                    <table className="w-full text-left border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-purple-600 text-white">
                          <th className="p-2 border border-gray-300">Quantidade</th>
                          <th className="p-2 border border-gray-300">Produto utilizado ou Serviço Prestado</th>
                          <th className="p-2 text-right border border-gray-300">Preço Unitário</th>
                          <th className="p-2 text-right border border-gray-300">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {dados.itens.map((item, index) => (
                          <tr key={index}>
                            <td className="p-2 border border-gray-300">{item.quantidade}</td>
                            <td className="p-2 border border-gray-300">{item.descricao}</td>
                            <td className="p-2 text-right border border-gray-300">
                              {formatarMoeda(item.precoUnitario)}
                            </td>
                            <td className="p-2 text-right border border-gray-300">{formatarMoeda(item.totalItem)}</td>
                          </tr>
                        ))}
                        {/* Add operational costs as items */}
                        {calcularCustoOperacional > 0 && (
                          <tr>
                            <td className="p-2 border border-gray-300">1</td>
                            <td className="p-2 border border-gray-300">
                              Custo Operacional ({dados.tempoExecucao}h)
                              {!dados.incluirSalarios && (
                                <span className="text-xs text-gray-500 block">*Salários não incluídos</span>
                              )}
                              {dados.custosVariaveis.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Inclui:{" "}
                                  {dados.custosVariaveis
                                    .map((c) => `${c.categoria} (${formatarMoeda(c.valor)})`)
                                    .join(", ")}
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-right border border-gray-300">
                              {formatarMoeda(calcularCustoOperacional)}
                            </td>
                            <td className="p-2 text-right border border-gray-300">
                              {formatarMoeda(calcularCustoOperacional)}
                            </td>
                          </tr>
                        )}
                        {/* Fill empty rows */}
                        {Array.from({
                          length: Math.max(0, 4 - dados.itens.length - (calcularCustoOperacional > 0 ? 1 : 0)),
                        }).map((_, index) => (
                          <tr key={`empty-${index}`} className="h-8">
                            <td className="p-2 border border-gray-300"></td>
                            <td className="border border-gray-300"></td>
                            <td className="border border-gray-300"></td>
                            <td className="border border-gray-300"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* Payment and Totals */}
                  <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="border border-gray-300 rounded-md h-full">
                      <div className="bg-purple-600 text-white p-2 rounded-t-md font-semibold">Forma de pagamento</div>
                      <div className="p-3 text-sm text-gray-700">
                        <p>{dados.formaPagamento || "Payment method"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                        <span className="font-semibold text-gray-600">Subtotal</span>
                        <span className="text-gray-800 font-semibold">{formatarMoeda(calcularSubtotalGeral)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2">
                        <span className="font-semibold text-gray-600">Lucro ({dados.margemLucro}%)</span>
                        <span className="text-green-600">+{formatarMoeda(calcularLucro)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2">
                        <span className="font-semibold text-gray-600">Impostos ({dados.impostos}%)</span>
                        <span className="text-red-600">+{formatarMoeda(calcularImpostos)}</span>
                      </div>
                      {dados.desconto > 0 && (
                        <div className="flex justify-between items-center p-2">
                          <span className="font-semibold text-gray-600">Desconto</span>
                          <span className="text-red-600">-{formatarMoeda(dados.desconto)}</span>
                        </div>
                      )}
                      {dados.acrescimos > 0 && (
                        <div className="flex justify-between items-center p-2">
                          <span className="font-semibold text-gray-600">Acréscimos</span>
                          <span className="text-green-600">+{formatarMoeda(dados.acrescimos)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-gray-200 p-3 rounded-md">
                        <span className="font-bold text-gray-800 text-lg">TOTAL</span>
                        <span className="text-green-600 font-bold text-lg">{formatarMoeda(calcularTotalFinal)}</span>
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <footer className="mt-8 pt-4">
                    <p className="text-center text-sm text-gray-600 mb-8">
                      Confirmo que o serviço foi prestado de acordo com o combinado.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2">
                          <p className="font-semibold">Assinatura do Cliente</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2">
                          <p className="font-semibold">Data de entrega do serviço: {formatarData(dados.dataEntrega)}</p>
                        </div>
                      </div>
                      <div className="text-center mt-8">
                        <div className="border-t border-gray-400 pt-2">
                          <p className="font-semibold">Assinatura do Técnico</p>
                        </div>
                      </div>
                      <div className="text-center mt-8 self-end">
                        <p className="bg-purple-600 text-white font-bold p-2 rounded">nexprice.com.br</p>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6 print:hidden">
              <Button onClick={gerarPDF} className="bg-purple-600 hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
              <Button onClick={imprimirOrcamento} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Imprimir Orçamento
              </Button>
            </div>

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
      </div>
    </div>
  )
}
