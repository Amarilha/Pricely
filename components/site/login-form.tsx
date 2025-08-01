"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
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
    
    // Validação
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
      
      window.location.href = "/dashboard/calculadora"
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
      window.location.href = "/dashboard/calculadora"
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

        <div className="grid gap-4">
          <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          {isGoogleLoading ? "Entrando..." : "Entrar com o Google"}
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