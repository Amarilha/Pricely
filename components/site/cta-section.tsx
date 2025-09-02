import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="w-full pt-20 md:pt-60 lg:pt-60 pb-10 md:pb-20 px-5 relative flex flex-col justify-center items-center overflow-visible">

<div className="relative z-10 flex flex-col justify-start items-center gap-5 max-w-4xl mx-auto p-8 bg-card rounded-xl border">
      <div className="flex flex-col justify-start items-center gap-3 text-center">
        <h2 className="text-foreground text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight break-words max-w-3xl">
          Pronto para transformar a gestão dos seus projetos?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed break-words max-w-2xl"> 
          Junte-se a milhares de profissionais que já estão economizando tempo e aumentando a lucratividade com a
          <span className="text-primary font-semibold"> Nexprice</span>.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md items-center justify-center">
        <Link href="/login">
        <button className="px-8 py-3 rounded-full bg-primary hover:opacity-90  text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Começar Agora
        </button>
        </Link>
        {/* 
        <button className="border border-border hover:bg-accent text-foreground font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Ver Demonstração
        </button>
        */}
      </div>
      
      <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-2xl">

        <div className="text-center">
          <div className="text-3xl font-bold text-primary">+85%</div>
          <div className="text-sm text-muted-foreground mt-1">Aumento de Produtividade</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">+30%</div>
          <div className="text-sm text-muted-foreground mt-1">Economia de Tempo</div>
        </div>
        
      </div>
    </div>

    </section>
  )
}


