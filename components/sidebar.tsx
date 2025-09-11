"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calculator,
  MessageSquare,
  FolderKanban,
  BarChart3,
  Settings,
  Menu,
  HomeIcon,
  LogOut,
  ChevronDown,
  Building,
  MessageCircleQuestion,
  Wrench,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/app/src/config/firebaseConfig"
import Image from "next/image"

const menuItems = [
  {
    name: "Empresas",
    href: "/dashboard/empresas",
    icon: Building,
  },
  {
    name: "Calculadora",
    href: "/dashboard/calculadora",
    icon: Calculator,
  },
    /*{
  {
    name: "Mão de Obra",
    href: "/dashboard/mao-de-obra",
    icon: Wrench,
  },

  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
  },
    name: "Consultor IA",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    name: "Projetos",
    href: "/dashboard/projetos",
    icon: FolderKanban,
  },
  {
    name: "Relatórios",
    href: "/dashboard/relatorios",
    icon: BarChart3,
  },
  
  {
    name: "Perguntas Frequentes",
    href: "/dashboard/faq",
    icon: MessageCircleQuestion,
  },
  {
    name: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  }, */
]

export function Sidebar() {
  const pathname = usePathname()
  const { expanded, toggleSidebar } = useSidebar()
  const [userData, setUserData] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        } else {
          setUserData({
            name: user.displayName || "Usuário",
            email: user.email,
            photoURL: user.photoURL,
            role: "user"
          })
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      // Remove o cookie de sessão
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      window.location.href = "/"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <>
      {/* Sidebar para desktop */}
      <div
        className={cn(
          "h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
          "fixed top-0 left-0 z-50",
          "hidden lg:flex", // Oculto em telas pequenas, flex em telas grandes
          expanded ? "w-64" : "w-20"
        )}
      >
        {/* Cabeçalho do menu */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className={cn("flex items-center", expanded ? "gap-2" : "justify-center w-full")}>
            <div className="w-8 h-8 flex items-center justify-center">
            <img src="/nexprice-logo-branco-sem-texto.png" className="h-8 w-auto" alt="Your Logo Description"></img>
            </div>
            {expanded && <span className="font-bold text-lg text-white">Nexprice</span>}
          </div>
          <div className="flex items-center gap-2">
            {expanded && <ModeToggle />}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(expanded ? "" : "absolute top-14 left-1/2 -translate-x-1/2 h-5 w-5")}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Itens do menu */}
        <div className="flex-1 py-4 overflow-auto">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-purple-600/10 text-purple-600"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground ",
                  !expanded && "justify-center",
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href && "text-purple-600")} />
                {expanded && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer do menu */}
        <div className="p-4 border-t border-border">
          {expanded ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    {userData?.photoURL ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={userData.photoURL}
                          alt="Foto do perfil"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {userData?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">
                        {userData?.name || "Usuário"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {userData?.role === "admin" ? "Plano Pro" : "Plano Free"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href="/dashboard/perfil" className="flex w-full">
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/configuracoes" className="flex w-full">
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/planos" className="flex w-full">
                    Fazer Upgrade
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ModeToggle />
              {userData?.photoURL ? (
                <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                  <Image
                    src={userData.photoURL}
                    alt="Foto do perfil"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold">
                    {userData?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile (aparece na parte inferior) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        {/* Botão para abrir/fechar menu mobile */}
        <div className="flex justify-center p-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2"
          >
            {isMobileMenuOpen ? (
              <>
                <X className="h-4 w-4" />
                Fechar
              </>
            ) : (
              <>
                <Menu className="h-4 w-4" />
                Menu
              </>
            )}
          </Button>
        </div>

        {/* Conteúdo do menu mobile (aparece quando aberto) */}
        {isMobileMenuOpen && (
          <div className="p-4 border-t border-border">
            <nav className="grid grid-cols-2 gap-2 mb-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-purple-600/10 text-purple-600"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mb-1", pathname === item.href && "text-purple-600")} />
                  <span className="text-xs">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Perfil do usuário no mobile */}
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                {userData?.photoURL ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={userData.photoURL}
                      alt="Foto do perfil"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userData?.name || "Usuário"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userData?.role === "admin" ? "Plano Pro" : "Plano Free"}
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/dashboard/perfil" className="flex w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/configuracoes" className="flex w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/planos" className="flex w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      Fazer Upgrade
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 flex justify-center">
              <ModeToggle />
            </div>
          </div>
        )}
      </div>
    </>
  )
}