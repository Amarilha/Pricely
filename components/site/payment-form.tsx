"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/abacadepay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, number, expiry, cvv }),
      })

      if (!response.ok) {
        throw new Error("Falha no pagamento")
      }

      alert("Pagamento realizado com sucesso!")
    } catch (error) {
      console.error(error)
      alert("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome no Cartão</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome impresso no cartão"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Número do Cartão</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Validade</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/AA"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="000"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? "Processando..." : "Pagar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
