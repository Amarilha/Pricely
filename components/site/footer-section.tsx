"use client"

import { Twitter, Github, Linkedin } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      {/* Seção Esquerda: Logo, Descrição, Links Sociais */}
      <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
        <div className="flex gap-3 items-stretch justify-center">
          <img src="/nexprice-logo-branco-texto-lateral.png" className="h-6 w-auto" alt="Logo NexPrice"></img>
        </div>
        <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">Programação sem esforço</p>
        <div className="flex justify-start items-start gap-3">
          <a href="#" aria-label="Twitter" className="w-4 h-4 flex items-center justify-center">
            <Twitter className="w-full h-full text-muted-foreground" />
          </a>
          <a href="#" aria-label="GitHub" className="w-4 h-4 flex items-center justify-center">
            <Github className="w-full h-full text-muted-foreground" />
          </a>
          <a href="#" aria-label="LinkedIn" className="w-4 h-4 flex items-center justify-center">
            <Linkedin className="w-full h-full text-muted-foreground" />
          </a>
        </div>
      </div>
      {/* Seção Direita: Produto, Empresa, Recursos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Produto</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Funcionalidades
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Preços
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Integrações
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Visualizações em tempo real
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Programação multi-agente
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Empresa</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Sobre nós
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Nossa equipe
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Carreiras
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Marca
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Contato
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Recursos</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Termos de uso
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Referência da API
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Documentação
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Comunidade
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}