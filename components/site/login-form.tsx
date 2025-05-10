"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail, Google } from "lucide-react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, provider } from "@/app/src/config/firebaseConfig"
import {authGoogle} from "@/app/src/services/auth.js"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login com email/senha usando Firebase Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validação manual
    if (!email || !password) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado:", userCredential.user);
      window.location.href = "/dashboard";
    } catch (error) {
      let errorMessage = "Falha no login";
      
      if (error instanceof Error) {
        switch (error.code) {  // Note: Aqui usamos error.code em vez de error.message
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/user-not-found":
            errorMessage = "Usuário não cadastrado";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente mais tarde";
            break;
        }
      }
      
      setError(errorMessage);
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="Digite seu e-mail" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="Digite sua senha" required />
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
          <span className="bg-background px-2 text-xs text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button 
              id="googleLogin" 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                try {
                  console.log("Initiating Google login...");
                  await authGoogle();
                  window.location.href = "/dashboard";
                } catch (error) {
                  console.error("Login error:", error);
                  // You can show a user-friendly error message here
                }
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Google
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
