import type { Metadata } from "next"
import { RecuperarSenhaForm } from "@/components/site/recuperar-senha-form"
import Header from "@/components/site/header"
import { FooterSection } from "@/components/site/footer-section"

export const metadata: Metadata = {
  title: "Recuperar Senha | Nexprice",
  description: "Recupere o acesso à sua conta Nexprice",
  icons:{
    icon:'/nexprice-logo-branco-sem-texto.png',
     },
}

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-md mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recuperar sua senha</h1>
            <p className="text-muted-foreground">
              Digite seu e-mail abaixo para receber um link de redefinição de senha.
            </p>
          </div>
          <RecuperarSenhaForm />
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
