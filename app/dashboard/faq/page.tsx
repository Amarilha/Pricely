import type { Metadata } from "next"
import { FAQSection } from "@/components/site/faq-section"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Nexprice",
  description: "Encontre respostas para as dúvidas mais comuns sobre a plataforma Nexprice",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Perguntas Frequentes</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre a plataforma Nexprice
            </p>
          </div>
          <FAQSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}