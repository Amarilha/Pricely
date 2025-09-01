"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth,createUserWithEmailAndPassword, updateProfile,FirebaseError,setDoc,doc, db } from "@/app/src/config/firebaseConfig.js"
import { authGoogle } from "@/app/src/services/auth.js"

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validação
    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. Atualiza o perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: name
      })

      // 3. Salva informações adicionais no Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        name: name,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: "user", // Você pode adicionar roles diferentes (admin, user, etc.)
        status: "active"
      })

      console.log("Usuário cadastrado com sucesso:", userCredential.user)
      
      // Redirecionar para o dashboard após o cadastro
      window.location.href = "/dashboard/calculadora"

    } catch (error) {
      let errorMessage = "Falha no cadastro"
      
      if (error instanceof Error && 'code' in error) {
        const authError = error as { code: string }
        switch (authError.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este email já está em uso"
            break
          case "auth/invalid-email":
            errorMessage = "Email inválido"
            break
          case "auth/weak-password":
            errorMessage = "A senha deve ter pelo menos 6 caracteres"
            break
          case "auth/operation-not-allowed":
            errorMessage = "Operação não permitida"
            break
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente novamente mais tarde"
            break
          default:
            errorMessage = "Ocorreu um erro durante o cadastro"
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = "Ocorreu um erro desconhecido"
      }
      setError(errorMessage)
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" placeholder="Digite seu nome completo" required />
          </div>

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
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Crie uma senha" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirme sua senha" 
              required 
            />
            <p className="text-xs text-muted-foreground">
              A senha deve ter pelo menos 6 caracteres.
            </p>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <div className="grid  gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={async () => {
              try {
                setIsLoading(true);
                setError(null);
                console.log("Iniciando login com Google...");
                
                // Faz o login com Google
                const result = await authGoogle();
                
                if (result?.user) {
                  // Salva os dados do usuário no Firestore
                  await setDoc(doc(db, "users", result.user.uid), {
                    email: result.user.email,
                    name: result.user.displayName || "Usuário Google",
                    photoURL: result.user.photoURL || null,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    role: "user",
                    status: "active",
                    provider: "google"
                  });
                  
                  // Redireciona para o dashboard
                  window.location.href = "/dashboard/calculadora"
                  console.log("fim login com Google...");
                }
              } catch (error: any) {
                let errorMessage = "Falha ao fazer login com Google";
                
                if (error.code) {
                  switch (error.code) {
                    case "auth/account-exists-with-different-credential":
                      errorMessage = "Este email já está cadastrado com outro método de login";
                      break;
                    case "auth/popup-closed-by-user":
                      errorMessage = "Login cancelado pelo usuário";
                      break;
                    default:
                      errorMessage = "Ocorreu um erro durante o login com Google";
                  }
                }               
                setError(errorMessage);
                console.error("Erro no login com Google:", error);
                } finally {
                  setIsLoading(false);
                }
                }}
                disabled={isLoading}
                >
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
              {isLoading ? "Entrando..." : "Google"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col justify-center border-t p-6 gap-3">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>

        <p className="text-xs text-muted-foreground/70">
          Criando uma conta, você concorda com todos os nossos{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            termos e condições
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
};