"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Calendar, Building } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BoletoData {
  valor: number
  vencimento: string
  sacado: {
    nome: string
    cpfCnpj: string
    endereco: string
  }
  cedente: {
    nome: string
    cnpj: string
    banco: string
    agencia: string
    conta: string
  }
  numeroDocumento: string
  instrucoes: string
  parcelas: number
}

interface BoletoGeneratorProps {
  valorTotal: number
  clienteNome: string
  clienteCpf: string
  clienteEndereco: string
  empresaNome: string
  empresaCnpj: string
  numeroOrdem: string
}

export function BoletoGenerator({
  valorTotal,
  clienteNome,
  clienteCpf,
  clienteEndereco,
  empresaNome,
  empresaCnpj,
  numeroOrdem,
}: BoletoGeneratorProps) {
  const [boletoData, setBoletoData] = useState<BoletoData>({
    valor: valorTotal,
    vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 dias
    sacado: {
      nome: clienteNome,
      cpfCnpj: clienteCpf,
      endereco: clienteEndereco,
    },
    cedente: {
      nome: empresaNome,
      cnpj: empresaCnpj,
      banco: "001",
      agencia: "1234",
      conta: "12345-6",
    },
    numeroDocumento: numeroOrdem,
    instrucoes: "Pagamento referente ao serviço.",
    parcelas: 1,
  })

  const bancos = [
    { codigo: "001", nome: "Banco do Brasil" },
    { codigo: "033", nome: "Santander" },
    { codigo: "104", nome: "Caixa Econômica" },
    { codigo: "237", nome: "Bradesco" },
    { codigo: "341", nome: "Itaú" },
    { codigo: "745", nome: "Citibank" },
    { codigo: "399", nome: "HSBC" },
    { codigo: "422", nome: "Safra" },
  ]

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const gerarCodigoBarras = () => {
    // Simulação de código de barras (em produção, usar API do banco)
    const banco = boletoData.cedente.banco
    const moeda = "9" // Real
    const dv = "1" // Dígito verificador simulado
    const vencimento = Math.floor(
      (new Date(boletoData.vencimento).getTime() - new Date("1997-10-07").getTime()) / (1000 * 60 * 60 * 24),
    )
    const valor = Math.floor(boletoData.valor * 100)
      .toString()
      .padStart(10, "0")

    return `${banco}${moeda}${dv}${vencimento.toString().padStart(4, "0")}${valor}000000000000000000000000`
  }

  const gerarLinhaDigitavel = (codigoBarras: string) => {
    // Simulação da linha digitável
    const campo1 = codigoBarras.substring(0, 4) + codigoBarras.substring(32, 37)
    const campo2 = codigoBarras.substring(37, 47)
    const campo3 = codigoBarras.substring(47, 57)
    const campo4 = codigoBarras.substring(4, 5)
    const campo5 = codigoBarras.substring(5, 19)

    return `${campo1} ${campo2} ${campo3} ${campo4} ${campo5}`
  }

  const calcularParcelas = () => {
    const valorParcela = boletoData.valor / boletoData.parcelas
    const parcelas = []

    for (let i = 0; i < boletoData.parcelas; i++) {
      const dataVencimento = new Date(boletoData.vencimento)
      dataVencimento.setMonth(dataVencimento.getMonth() + i)

      parcelas.push({
        numero: i + 1,
        valor: valorParcela,
        vencimento: dataVencimento.toISOString().split("T")[0],
        codigoBarras: gerarCodigoBarras(),
        linhaDigitavel: gerarLinhaDigitavel(gerarCodigoBarras()),
      })
    }

    return parcelas
  }

  const gerarBoleto = () => {
    const parcelas = calcularParcelas()

    parcelas.forEach((parcela, index) => {
      const boletoHTML = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Boleto Bancário - Parcela ${parcela.numero}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 12px; }
            .boleto { width: 210mm; margin: 0 auto; padding: 10mm; }
            .header { border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
            .banco-logo { font-size: 18px; font-weight: bold; float: left; }
            .codigo-banco { font-size: 18px; font-weight: bold; float: right; }
            .linha-digitavel { font-size: 14px; font-weight: bold; text-align: center; margin: 10px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
            .campo { border: 1px solid #000; padding: 5px; }
            .campo-label { font-size: 10px; font-weight: bold; }
            .campo-valor { font-size: 12px; margin-top: 2px; }
            .instrucoes { border: 1px solid #000; padding: 10px; margin: 10px 0; min-height: 80px; }
            .codigo-barras { font-family: 'Courier New', monospace; font-size: 10px; text-align: center; margin: 10px 0; }
            .recibo { border-top: 2px dashed #000; margin-top: 20px; padding-top: 10px; }
            @media print {
              body { margin: 0; }
              .boleto { width: 100%; margin: 0; padding: 5mm; }
            }
          </style>
        </head>
        <body>
          <div class="boleto">
            <!-- Cabeçalho -->
            <div class="header">
              <div class="banco-logo">${bancos.find((b) => b.codigo === boletoData.cedente.banco)?.nome || "Banco"}</div>
              <div class="codigo-banco">${boletoData.cedente.banco}-${Math.floor(Math.random() * 10)}</div>
              <div style="clear: both;"></div>
            </div>
            
            <!-- Linha Digitável -->
            <div class="linha-digitavel">${parcela.linhaDigitavel}</div>
            
            <!-- Informações do Boleto -->
            <div class="info-grid">
              <div class="campo">
                <div class="campo-label">Cedente</div>
                <div class="campo-valor">${boletoData.cedente.nome}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Agência/Código do Cedente</div>
                <div class="campo-valor">${boletoData.cedente.agencia} / ${boletoData.cedente.conta}</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="campo">
                <div class="campo-label">Data do Documento</div>
                <div class="campo-valor">${formatarData(new Date().toISOString())}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Número do Documento</div>
                <div class="campo-valor">${boletoData.numeroDocumento}-${parcela.numero}</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="campo">
                <div class="campo-label">Data de Vencimento</div>
                <div class="campo-valor">${formatarData(parcela.vencimento)}</div>
              </div>
              <div class="campo">
                <div class="campo-label">Valor do Documento</div>
                <div class="campo-valor">${formatarMoeda(parcela.valor)}</div>
              </div>
            </div>
            
            <!-- Sacado -->
            <div class="campo">
              <div class="campo-label">Sacado</div>
              <div class="campo-valor">
                ${boletoData.sacado.nome}<br>
                CPF/CNPJ: ${boletoData.sacado.cpfCnpj}<br>
                ${boletoData.sacado.endereco}
              </div>
            </div>
            
            <!-- Instruções -->
            <div class="instrucoes">
              <div class="campo-label">Instruções</div>
              <div class="campo-valor">${boletoData.instrucoes}</div>
              ${boletoData.parcelas > 1 ? `<br><strong>Parcela ${parcela.numero} de ${boletoData.parcelas}</strong>` : ""}
            </div>
            
            <!-- Código de Barras -->
            <div class="codigo-barras">${parcela.codigoBarras}</div>
            
            <!-- Recibo do Sacado -->
            <div class="recibo">
              <h3>Recibo do Sacado</h3>
              <p><strong>Cedente:</strong> ${boletoData.cedente.nome}</p>
              <p><strong>Valor:</strong> ${formatarMoeda(parcela.valor)}</p>
              <p><strong>Vencimento:</strong> ${formatarData(parcela.vencimento)}</p>
              <p><strong>Documento:</strong> ${boletoData.numeroDocumento}-${parcela.numero}</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `

      const boletoWindow = window.open("", "_blank", "width=800,height=600")
      if (boletoWindow) {
        boletoWindow.document.write(boletoHTML)
        boletoWindow.document.close()
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gerador de Boletos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor Total</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={boletoData.valor}
                onChange={(e) => setBoletoData((prev) => ({ ...prev, valor: Number(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="parcelas">Número de Parcelas</Label>
              <Select
                value={boletoData.parcelas.toString()}
                onValueChange={(value) => setBoletoData((prev) => ({ ...prev, parcelas: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x de {formatarMoeda(boletoData.valor / num)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vencimento">Data de Vencimento (1ª parcela)</Label>
              <Input
                id="vencimento"
                type="date"
                value={boletoData.vencimento}
                onChange={(e) => setBoletoData((prev) => ({ ...prev, vencimento: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="banco">Banco</Label>
              <Select
                value={boletoData.cedente.banco}
                onValueChange={(value) =>
                  setBoletoData((prev) => ({
                    ...prev,
                    cedente: { ...prev.cedente, banco: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map((banco) => (
                    <SelectItem key={banco.codigo} value={banco.codigo}>
                      {banco.codigo} - {banco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agencia">Agência</Label>
              <Input
                id="agencia"
                value={boletoData.cedente.agencia}
                onChange={(e) =>
                  setBoletoData((prev) => ({
                    ...prev,
                    cedente: { ...prev.cedente, agencia: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="conta">Conta</Label>
              <Input
                id="conta"
                value={boletoData.cedente.conta}
                onChange={(e) =>
                  setBoletoData((prev) => ({
                    ...prev,
                    cedente: { ...prev.cedente, conta: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instrucoes">Instruções</Label>
            <Textarea
              id="instrucoes"
              value={boletoData.instrucoes}
              onChange={(e) => setBoletoData((prev) => ({ ...prev, instrucoes: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview das Parcelas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visualização das Parcelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {calcularParcelas().map((parcela, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Parcela {parcela.numero}</span>
                  <p className="text-sm text-muted-foreground">Vencimento: {formatarData(parcela.vencimento)}</p>
                </div>
                <Badge variant="outline" className="text-base">
                  {formatarMoeda(parcela.valor)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Building className="h-4 w-4" />
        <AlertDescription>
          <strong>Atenção:</strong> Este é um gerador de boletos simulado para demonstração. Em produção, integre com a
          API do seu banco para gerar boletos válidos.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={gerarBoleto} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Gerar {boletoData.parcelas > 1 ? `${boletoData.parcelas} Boletos` : "Boleto"}
        </Button>
      </div>
    </div>
  )
}
