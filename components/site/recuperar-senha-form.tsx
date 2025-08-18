"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { auth, sendPasswordResetEmail } from "@/app/src/config/firebaseConfig.js"

export function RecuperarSenhaForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string

    if (!email) {
      setError("Por favor, insira seu e-mail.")
      setIsLoading(false)
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess("Um e-mail de redefinição de senha foi enviado para o seu endereço.")
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao tentar enviar o e-mail de redefinição de senha."
      if (error.code === "auth/user-not-found") {
        errorMessage = "Nenhum usuário encontrado com este e-mail."
      }
      setError(errorMessage)
      console.error("Erro na recuperação de senha:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
              disabled={isLoading || !!success}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || !!success}>
            {isLoading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Lembrou sua senha?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
