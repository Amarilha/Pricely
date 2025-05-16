"use client"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { AdsBanner } from "@/components/ads-banner"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/app/src/config/firebaseConfig"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  name?: string
  email?: string | null
  photoURL?: string | null
  role?: string
  plan?: string
  provider?: string
  notifications?: {
    emailMarketing?: boolean
    emailUpdates?: boolean
    emailSecurity?: boolean
    appUpdates?: boolean
    appReminders?: boolean
  }
}

const userPlan = "free"

export default function ConfiguracoesPage() {

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData({
            name: user.displayName || userDoc.data().name || "Usuário",
            email: user.email,
            photoURL: user.photoURL || userDoc.data().photoURL,
            role: userDoc.data().role || "user",
            plan: userDoc.data().plan || "free",
            provider: userDoc.data().provider || "email",
            notifications: {
              emailMarketing: userDoc.data()?.notifications?.emailMarketing ?? true,
              emailUpdates: userDoc.data()?.notifications?.emailUpdates ?? true,
              emailSecurity: userDoc.data()?.notifications?.emailSecurity ?? true,
              appUpdates: userDoc.data()?.notifications?.appUpdates ?? true,
              appReminders: userDoc.data()?.notifications?.appReminders ?? true,
            }
          })
        } else {
          const isGoogleUser = user.providerData.some(
            (provider) => provider.providerId === 'google.com'
          )
          
          setUserData({
            name: user.displayName || "Usuário",
            email: user.email,
            photoURL: user.photoURL,
            role: "user",
            plan: "free",
            provider: isGoogleUser ? "google" : "email",
            notifications: {
              emailMarketing: true,
              emailUpdates: true,
              emailSecurity: true,
              appUpdates: true,
              appReminders: true,
            }
          })
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser || !userData) return

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: userData.name,
        email: userData.email,
        photoURL: userData.photoURL
      })
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotifications = async () => {
    if (!auth.currentUser || !userData?.notifications) return

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        notifications: userData.notifications
      })
      toast({
        title: "Sucesso",
        description: "Preferências de notificação atualizadas!",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as notificações.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return <div className="p-6">Carregando...</div>
  }

  const isGoogleUser = userData.provider === "google"

  return (
    <div className="flex flex-col gap-6 p-6">

       {userPlan === "free" && <AdsBanner />}

      <PageHeader title="Configurações" description="Gerencie as configurações da sua conta e preferências." />

      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
        </TabsList>

        <TabsContent value="conta">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                {isGoogleUser 
                  ? "Gerencie as informações da sua conta do Google." 
                  : "Gerencie as informações da sua conta e preferências de segurança."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Perfil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Overlay de manutenção */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="text-[80px] font-bold text-gray-400 opacity-50 rotate-[-30deg]">
          EM MANUTENÇÃO
        </div>
      </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={isGoogleUser}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email || ''}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={isGoogleUser}
                      />
                    </div>
                  </div>
                </div>
                {/*
                {!isGoogleUser && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Segurança</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={loading || isGoogleUser}
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
                */}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure como e quando deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">Receba novidades, dicas e ofertas especiais.</p>
                    </div>
                    <Switch id="email-marketing" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-updates">Atualizações de Projetos</Label>
                      <p className="text-sm text-muted-foreground">
                        Seja notificado sobre atualizações em seus projetos.
                      </p>
                    </div>
                    <Switch id="email-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-security">Segurança</Label>
                      <p className="text-sm text-muted-foreground">Receba alertas sobre atividades suspeitas.</p>
                    </div>
                    <Switch id="email-security" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Aplicativo</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-updates">Atualizações de Projetos</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações no aplicativo sobre seus projetos.
                      </p>
                    </div>
                    <Switch id="app-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-reminders">Lembretes</Label>
                      <p className="text-sm text-muted-foreground">Receba lembretes sobre tarefas e prazos.</p>
                    </div>
                    <Switch id="app-reminders" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">Salvar Preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a aparência da plataforma conforme sua preferência.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600">
                    <div className="h-20 bg-white rounded-md mb-2 flex items-center justify-center">
                      <span className="text-black">Claro</span>
                    </div>
                    <p className="text-sm text-center">Tema Claro</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600">
                    <div className="h-20 bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                      <span className="text-white">Escuro</span>
                    </div>
                    <p className="text-sm text-center">Tema Escuro</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded-md mb-2 flex items-center justify-center">
                      <span className="text-gray-800">Sistema</span>
                    </div>
                    <p className="text-sm text-center">Seguir Sistema</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Densidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600">
                    <div className="h-20 flex flex-col justify-around p-2 bg-background rounded-md mb-2">
                      <div className="h-2 w-full bg-muted rounded"></div>
                      <div className="h-2 w-full bg-muted rounded"></div>
                      <div className="h-2 w-full bg-muted rounded"></div>
                    </div>
                    <p className="text-sm text-center">Compacto</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600 border-purple-600">
                    <div className="h-20 flex flex-col justify-around p-2 bg-background rounded-md mb-2">
                      <div className="h-3 w-full bg-muted rounded"></div>
                      <div className="h-3 w-full bg-muted rounded"></div>
                      <div className="h-3 w-full bg-muted rounded"></div>
                    </div>
                    <p className="text-sm text-center">Normal</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-600">
                    <div className="h-20 flex flex-col justify-around p-2 bg-background rounded-md mb-2">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-full bg-muted rounded"></div>
                    </div>
                    <p className="text-sm text-center">Confortável</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">Salvar Preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plano">
          <Card>
            <CardHeader>
              <CardTitle>Seu Plano</CardTitle>
              <CardDescription>Gerencie seu plano atual e veja opções de upgrade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Plano Atual</h3>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold">Plano Free</h4>
                      <p className="text-sm text-muted-foreground">Plano gratuito com recursos básicos</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      Ativo
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Dashboard básico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Calculadora de precificação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Até 3 projetos ativos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-red-500"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <span className="text-muted-foreground">Sem anúncios</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Fazer Upgrade</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Planos Disponíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-6">
                    <h4 className="text-xl font-bold mb-2">Plano Profissional</h4>
                    <p className="text-2xl font-bold mb-1">
                      R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">Para freelancers em crescimento</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Dashboard completo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Projetos ilimitados</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Sem anúncios</span>
                      </div>
                    </div>
                    <Button className="w-full">Assinar Agora</Button>
                  </div>
                  <div className="border rounded-lg p-6">
                    <h4 className="text-xl font-bold mb-2">Plano Empresarial</h4>
                    <p className="text-2xl font-bold mb-1">
                      R$ 99<span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">Para agências e equipes</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Tudo do Profissional</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Múltiplos usuários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>API de integração</span>
                      </div>
                    </div>
                    <Button className="w-full">Fale com Vendas</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
