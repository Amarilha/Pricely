import type { Metadata } from "next"
import { RegistrationForm } from "@/components/site/registration-form"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Cadastro | Valluo",
  description: "Crie sua conta na plataforma Valluo e comece a gerenciar seus projetos",
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
            <p className="text-muted-foreground">Preencha os dados abaixo para começar a usar a plataforma Valluo</p>
          </div>
          <RegistrationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
