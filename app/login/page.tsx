import type { Metadata } from "next"
import { LoginForm } from "@/components/site/login-form"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Login | Valluo",
  description: "Acesse sua conta na plataforma Valluo",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acesse sua conta</h1>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar a plataforma Valluo</p>
          </div>
          <LoginForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
