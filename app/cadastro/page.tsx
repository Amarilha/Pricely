import type { Metadata } from "next"
import { RegistrationForm } from "@/components/site/registration-form"
import Header from "@/components/site/header"
import { FooterSection } from "@/components/site/footer-section"


export const metadata: Metadata = {
  title: "Cadastro | Nexprice",
  description: "Crie sua conta na plataforma Nexprice e comece a gerenciar seus projetos",
  icons:{
    icon:'/nexprice-logo-branco-sem-texto.png',
     },
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
            <p className="text-muted-foreground">Preencha os dados abaixo para começar a usar a plataforma Nexprice</p>
          </div>
          <RegistrationForm />
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
