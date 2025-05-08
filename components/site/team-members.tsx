import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter } from "lucide-react"

const team = [
  {
    name: "Ana Silva",
    role: "CEO & Fundadora",
    bio: "Empreendedora com mais de 15 anos de experiência em tecnologia e gestão de projetos. Fundou a Valluo com a missão de ajudar freelancers e agências a crescerem de forma sustentável.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Carlos Mendes",
    role: "CTO",
    bio: "Desenvolvedor full-stack com experiência em startups de tecnologia. Lidera o desenvolvimento da plataforma Valluo com foco em performance e experiência do usuário.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Mariana Costa",
    role: "Diretora de Produto",
    bio: "Especialista em UX/UI com background em design e negócios. Responsável por garantir que a Valluo atenda às necessidades reais dos usuários.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Rafael Oliveira",
    role: "Diretor de Marketing",
    bio: "Estrategista de marketing digital com experiência em SaaS. Lidera as estratégias de aquisição e retenção de clientes da Valluo.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Juliana Santos",
    role: "Diretora de Operações",
    bio: "Especialista em processos e operações com experiência em empresas de tecnologia. Garante que a Valluo opere com eficiência e qualidade.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Pedro Almeida",
    role: "Líder de Suporte",
    bio: "Apaixonado por ajudar pessoas, lidera a equipe de suporte da Valluo com foco em resolver problemas e garantir a satisfação dos clientes.",
    avatar: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
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
              <p className="text-purple-600 font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex gap-3">
                <a href={member.social.linkedin} className="text-muted-foreground hover:text-purple-600">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={member.social.twitter} className="text-muted-foreground hover:text-purple-600">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
