"use client"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="bg-background  w-full">
      <div>
        {/* Logo, Descrição, Links Sociais */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full">
          {/* Seção Esquerda: Logo, Descrição*/}
          <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
            <div className="flex gap-3 items-stretch justify-center">
              <img 
                src="/nexprice-logo-branco-texto-lateral.png" 
                className="h-6 w-auto" 
                alt="Logo NexPrice"
              />
            </div>
            <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">
              precificar sem esforço
            </p>
          </div>
          
          {/* Seção direita: Links Sociais */}
          <div className="flex gap-4 p-4 md:p-8 self-end md:self-auto">
            <Link 
              href="https://www.facebook.com/profile.php?id=61577019687522" 
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.instagram.com/nexprice" 
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.linkedin.com/company/nexprice/?viewAsMember=true" 
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
        {/* Seção baixo: Termos de Uso */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nexprice. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/Termos-de-Uso" className="text-sm text-muted-foreground hover:text-primary" target="_blank"
              rel="noopener noreferrer">
              Termos de Uso
            </Link>
            <Link href="/Politica-de-Privacidade" className="text-sm text-muted-foreground hover:text-primary" target="_blank"
              rel="noopener noreferrer">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div> 
    </footer>
  )
}