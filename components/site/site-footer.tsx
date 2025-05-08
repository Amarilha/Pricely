import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-bold text-lg text-purple-600">Valluo</span>
            </div>
            <p className="text-muted-foreground">
              Plataforma completa para gestão de projetos e precificação para freelancers e agências.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Calculadora
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Relatórios
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Consultor IA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/equipe" className="text-muted-foreground hover:text-purple-600">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/parceiros" className="text-muted-foreground hover:text-purple-600">
                  Parceiros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Receba dicas e novidades sobre gestão de projetos e precificação.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Seu e-mail" className="max-w-[220px]" />
              <Button className="bg-purple-600 hover:bg-purple-700">Assinar</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Valluo. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-purple-600">
              Termos de Uso
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-purple-600">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-purple-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
