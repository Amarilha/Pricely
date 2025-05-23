"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail } from "lucide-react"

import { auth, signInWithEmailAndPassword } from "@/app/src/config/firebaseConfig.js"
import { authGoogle } from "@/app/src/services/auth.js"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Preencha todos os campos")
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Cria o cookie de sessão
      const idToken = await userCredential.user.getIdToken()
      document.cookie = `session=${idToken}; path=/; max-age=3600; secure; samesite=strict`
      
      window.location.href = "/dashboard"
    } catch (error: any) { // Usando any temporariamente para acessar a propriedade code
      let errorMessage = "Falha no login"
      
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Email inválido"
            break
          case "auth/user-not-found":
            errorMessage = "Usuário não cadastrado"
            break
          case "auth/wrong-password":
            errorMessage = "Senha incorreta"
            break
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente mais tarde"
            break
          default:
            errorMessage = "Erro desconhecido durante o login"
        }
      }
      
      setError(errorMessage)
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)
    
    try {
      await authGoogle()
      window.location.href = "/dashboard"
    } catch (error: any) {
      let errorMessage = "Falha no login com Google"
      
      if (error.code) {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            errorMessage = "Este email já está cadastrado com outro método"
            break
          case "auth/popup-closed-by-user":
            errorMessage = "Login cancelado pelo usuário"
            break
          default:
            errorMessage = "Erro ao fazer login com Google"
        }
      }
      setError(errorMessage)
      console.error("Erro no login com Google:", error)
    } finally {
      setIsGoogleLoading(false)
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Digite seu e-mail" 
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/recuperar-senha" className="text-xs text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Digite sua senha" 
              required 
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Lembrar de mim
            </Label>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full" disabled>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isGoogleLoading ? "Entrando..." : "Google"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}