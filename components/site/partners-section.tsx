import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const partners = [
  { name: "Empresa ABC", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Startup XYZ", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Consultoria 123", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Agência DEF", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Tech Solutions", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Design Studio", logo: "/placeholder.svg?height=40&width=120" },
]

export function PartnersSection() {
  return (
    <div className="container py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Parceiros de Confiança</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empresas que confiam na Nexprice para impulsionar seus negócios.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center mb-12">
        {partners.map((partner, index) => (
          <div key={index} className="grayscale hover:grayscale-0 transition-all">
            <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="h-10 max-w-[120px]" />
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/parceiros">
          <Button variant="outline" className="group">
            Conheça todos os nossos parceiros
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
