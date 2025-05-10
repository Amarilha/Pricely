"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Mail } from "lucide-react"
import { auth, provider, createUserWithEmailAndPassword, updateProfile,FirebaseError,setDoc,doc, db } from "@/app/src/config/firebaseConfig.js"
import { authGoogle } from "@/app/src/services/auth.js"

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
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
      window.location.href = "/dashboard"
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

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full" disabled>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
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
                  window.location.href = "/dashboard";
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
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? "Entrando..." : "Google"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
};