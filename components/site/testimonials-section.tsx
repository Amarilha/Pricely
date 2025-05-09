import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ana Silva",
    role: "Designer Freelancer",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "A calculadora de precificação mudou completamente a forma como cobro pelos meus projetos. Agora tenho confiança de que estou cobrando o valor justo pelo meu trabalho.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "Desenvolvedor Web",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Os relatórios detalhados me ajudam a entender onde estou gastando mais tempo e como posso otimizar meus processos. Minha produtividade aumentou significativamente.",
    rating: 5,
  },
  {
    name: "Mariana Costa",
    role: "Agência de Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "O consultor IA da Valluo é incrível! Ele me dá insights valiosos sobre como melhorar meus projetos e aumentar minha lucratividade. É como ter um consultor de negócios 24/7.",
    rating: 4,
  },
]

export function TestimonialsSection() {
  return (
    <div className="bg-background dark:bg-background/30">
      <div className="container py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
          <p className="text-xl text-primary-foreground max-w-2xl mx-auto">
            Milhares de profissionais e agências já transformaram seus negócios com a Valluo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-background rounded-full px-4 py-2 shadow-sm">
            <span className="text-primary font-medium">4.9</span>
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <span className="text-muted-foreground">de 500+ avaliações</span>
          </div>
        </div>
      </div>
    </div>
  )
}
