"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentMethodSelectorProps {
  value: string
  onChange: (value: string) => void
  customTerms: string
  onCustomTermsChange: (value: string) => void
}

export function PaymentMethodSelector({
  value,
  onChange,
  customTerms,
  onCustomTermsChange,
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      id: "avista",
      name: "À Vista",
      icon: Banknote,
      description: "Pagamento integral no ato da prestação do serviço",
      terms: "Pagamento à vista.",
      discount: "",
      color: "green",
    },
    {
      id: "pix",
      name: "PIX",
      icon: CheckCircle,
      description: "Transferência instantânea via PIX",
      terms: "Pagamento via PIX . Chave PIX será fornecida após confirmação do serviço.",
      discount: "",
      color: "blue",
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      icon: Calendar,
      description: "Pagamento via boleto com vencimento em 30 dias",
      terms: "Pagamento via boleto bancário .",
      discount: "",
      color: "red",
    }
  ]

  const selectedMethod = paymentMethods.find((method) => method.id === value)

  const getColorClasses = (color: string) => {
    const colors = {
      green: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
      blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
      purple:
        "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200",
      orange:
        "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200",
      red: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      yellow:
        "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      indigo:
        "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
      teal: "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200",
      gray: "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div >
            <Label htmlFor="payment-method" className="m-5">Selecione a forma de pagamento</Label>
            <Select value={value} onValueChange={onChange} >
              <SelectTrigger >
                <SelectValue placeholder="Escolha uma forma de pagamento..." />
              </SelectTrigger>
              <SelectContent >
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedMethod && (
            <div className={`p-4 rounded-lg border-2 ${getColorClasses(selectedMethod.color)}`}>
              <div className="flex items-start gap-3">
                <selectedMethod.icon className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{selectedMethod.name}</h4>
                  <p className="text-sm mb-3">{selectedMethod.description}</p>

                  {selectedMethod.discount && (
                    <Badge variant="secondary" className="mb-3">
                      💰 {selectedMethod.discount}
                    </Badge>
                  )}

                  {selectedMethod.id !== "personalizado" && selectedMethod.terms && (
                    <div className="bg-background/50 p-3 rounded border">
                      <p className="text-sm font-medium mb-1">Condições:</p>
                      <p className="text-sm">{selectedMethod.terms}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {value === "personalizado" && (
            <div>
              <Label htmlFor="custom-terms">Condições Personalizadas</Label>
              <Textarea
                id="custom-terms"
                value={customTerms}
                onChange={(e) => onCustomTermsChange(e.target.value)}
                placeholder="Descreva as condições personalizadas de pagamento..."
                rows={4}
              />
            </div>
          )}

          {!value && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Selecione uma forma de pagamento para continuar com o orçamento.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedMethod && selectedMethod.id !== "personalizado" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como Funciona o Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedMethod.id === "avista" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Serviço executado conforme acordado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Pagamento integral na entrega/conclusão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Desconto aplicado automaticamente</span>
                  </div>
                </div>
              )}

              {selectedMethod.id === "pix" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Chave PIX enviada após confirmação do serviço</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Transferência instantânea via app do banco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Confirmação automática do pagamento</span>
                  </div>
                </div>
              )}

              {(selectedMethod.id === "cartao_debito" || selectedMethod.id === "cartao_credito") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Máquina de cartão levada ao local</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Pagamento processado na entrega</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Comprovante emitido na hora</span>
                  </div>
                </div>
              )}

              {selectedMethod.id === "boleto" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Boleto gerado após confirmação do serviço</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Pagamento em qualquer banco ou app</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Serviço iniciado após compensação</span>
                  </div>
                </div>
              )}

              {(selectedMethod.id === "parcelado_2x" || selectedMethod.id === "parcelado_3x") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>Primeira parcela na entrega do serviço</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Demais parcelas mensalmente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>Sem juros ou taxas adicionais</span>
                  </div>
                </div>
              )}

              {selectedMethod.id === "entrada_saldo" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span>50% de entrada para início dos trabalhos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span>Serviço executado conforme cronograma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span>50% restante na entrega/conclusão</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
