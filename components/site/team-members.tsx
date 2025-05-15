import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Instagram  } from "lucide-react"

const team = [
{
  name: "Matheus",
  role: "CEO & Fundador",
  bio: "Líder visionário e especialista em empreendedorismo e gestão de projetos. Matheus fundou a Nexprice com o propósito de ajudar freelancers e agências a crescerem de forma sustentável.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Igor Amarilha",
  role: "CTO & Fundador",
  bio: "Desenvolvedor full-stack com ampla experiência em startups de tecnologia. Igor lidera a evolução técnica da plataforma Nexprice, com foco em performance e experiência do usuário.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Hellen",
  role: "CRO & Fundadora",
  bio: "Responsável pelo crescimento da Nexprice, Hellen atua com foco em oportunidades estratégicas e expansão de mercado, sempre com uma visão orientada a resultados.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Andressa",
  role: "CMO & Fundadora",
  bio: "Especialista em marketing digital com foco em SaaS, Andressa lidera as estratégias de aquisição, engajamento e retenção de clientes da Nexprice.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Diogo",
  role: "Diretor de Operações & Fundador",
  bio: "Especialista em processos e operações, Diogo garante que todas as engrenagens da Nexprice funcionem com eficiência, qualidade e alinhamento estratégico.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Thiago",
  role: "Conselheiro de Compras & Fundador",
  bio: "Com olhar estratégico para aquisições e parcerias, Thiago atua no conselho da Nexprice com foco em decisões de compras e alinhamento de recursos.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
{
  name: "Nathalia",
  role: "Sales Manager & Fundadora",
  bio: "Com forte atuação em vendas e relacionamento, Nathalia impulsiona as estratégias comerciais da Nexprice, conectando a empresa aos seus clientes ideais.",
  avatar: "/placeholder.svg?height=300&width=300",
  social: {
    linkedin: "#",
    instagram: "#",
  },
},
]

export function TeamMembers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {team.map((member, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="object-cover w-full h-full" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex gap-3">
                <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={member.social.instagram } className="text-muted-foreground hover:text-primary">
                  <Instagram  className="h-5 w-5" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
