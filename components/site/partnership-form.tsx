"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PartnershipForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando um atraso de processamento
    setTimeout(() => {
      setIsLoading(false)
      alert("Formulário enviado com sucesso! Entraremos em contato em breve.")
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicite uma Parceria</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para iniciar o processo de parceria com a Valluo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Digite seu nome completo" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" placeholder="Nome da sua empresa" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail profissional</Label>
              <Input id="email" type="email" placeholder="Digite seu e-mail" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(00) 00000-0000" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-type">Tipo de parceria</Label>
            <Select>
              <SelectTrigger id="partner-type">
                <SelectValue placeholder="Selecione o tipo de parceria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reseller">Revenda</SelectItem>
                <SelectItem value="agency">Agência</SelectItem>
                <SelectItem value="consultant">Consultoria</SelectItem>
                <SelectItem value="technology">Tecnologia</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Por que deseja ser um parceiro Valluo?</Label>
            <Textarea
              id="message"
              placeholder="Conte-nos sobre sua empresa e como pretende trabalhar com a Valluo"
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
