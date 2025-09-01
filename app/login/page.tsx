import type { Metadata } from "next"
import { LoginForm } from "@/components/site/login-form"
import Header from "@/components/site/header"
import { FooterSection } from "@/components/site/footer-section"


export const metadata: Metadata = {
  title: "Login | Nexprice",
  description: "Acesse sua conta na plataforma Nexprice",
  icons:{
    icon:'/nexprice-logo-branco-sem-texto.png',
     },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Acesse sua conta</h1>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar a plataforma Nexprice</p>
          </div>
          <LoginForm />
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
