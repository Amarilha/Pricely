"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/app/src/config/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function DataConsentDialog() {
  const [open, setOpen] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Verificar se o usuário já deu consentimento
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (!userData.dataConsent) {
            setOpen(true)
          }
        } else {
          // Novo usuário, mostrar diálogo de consentimento
          setOpen(true)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const handleConsent = async () => {
    if (!consentGiven) {
      toast({
        title: "Consentimento necessário",
        description: "Por favor, marque a caixa para aceitar a coleta de dados.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const user = auth.currentUser
      if (user) {
        // Atualizar o documento do usuário com o consentimento
        await setDoc(
          doc(db, "users", user.uid),
          { dataConsent: true, dataConsentDate: new Date() },
          { merge: true }
        )

        toast({
          title: "Consentimento registrado",
          description: "Obrigado por aceitar nossa política de coleta de dados.",
        })

        setOpen(false)
      }
    } catch (error) {
      console.error("Erro ao salvar consentimento:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar seu consentimento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Consentimento para Coleta de Dados</DialogTitle>
          <DialogDescription>
            Para melhorar sua experiência na plataforma Nexprice, gostaríamos de coletar alguns dados sobre como você utiliza nossos serviços.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="dataConsent" 
              checked={consentGiven} 
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
            />
            <label
              htmlFor="dataConsent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eu concordo com a coleta e processamento dos meus dados de acordo com a{" "}
              <a href="/termos-de-uso" className="text-primary underline" target="_blank">
                Política de Privacidade
              </a>{" "}
              da Nexprice.
            </label>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            <p>Os dados coletados incluem:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Informações de uso da plataforma</li>
              <li>Preferências e configurações</li>
              <li>Dados de interação com as funcionalidades</li>
            </ul>
            <p className="mt-2">
              Você pode revogar este consentimento a qualquer momento nas configurações da sua conta.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Mais tarde
          </Button>
          <Button onClick={handleConsent} disabled={loading}>
            {loading ? "Processando..." : "Aceitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}