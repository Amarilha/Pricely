import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados das perguntas frequentes organizados por categorias
const faqCategories = [
  {
    id: "geral",
    name: "Geral",
    faqs: [
      {
        question: "O que é a Nexprice?",
        answer: "A Nexprice é uma plataforma completa para gestão de projetos e precificação, desenvolvida especialmente para freelancers e agências. Nossa solução ajuda profissionais a gerenciar seus projetos de forma eficiente e precificar seus serviços adequadamente."
      },
      {
        question: "Como a Nexprice pode ajudar meu negócio?",
        answer: "A Nexprice oferece ferramentas para gestão de projetos, precificação de serviços, comunicação com clientes, geração de relatórios e muito mais. Nossa plataforma ajuda a otimizar processos, economizar tempo e aumentar a lucratividade do seu negócio."
      },
      {
        question: "A plataforma é adequada para qualquer tipo de negócio?",
        answer: "A Nexprice foi desenvolvida pensando nas necessidades específicas de freelancers e agências de diversos segmentos, como design, desenvolvimento web, marketing digital, consultoria e outros serviços baseados em projetos."
      },
    ]
  },
  {
    id: "planos",
    name: "Planos e Preços",
    faqs: [
      {
        question: "Posso mudar de plano a qualquer momento?",
        answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e o valor é ajustado proporcionalmente ao período restante da sua assinatura."
      },
      {
        question: "Existe um período de teste?",
        answer: "Sim, oferecemos um período de teste de 14 dias para os planos Profissional e Empresarial. Durante esse período, você pode testar todas as funcionalidades sem compromisso."
      },
      {
        question: "Como funciona o plano Gratuito?",
        answer: "O plano Gratuito é realmente gratuito para sempre, sem necessidade de cartão de crédito. Ele inclui as funcionalidades básicas para que você possa gerenciar até 3 projetos simultaneamente."
      },
    ]
  },
  {
    id: "funcionalidades",
    name: "Funcionalidades",
    faqs: [
      {
        question: "Como funciona a calculadora de preços?",
        answer: "Nossa calculadora de preços considera diversos fatores como tempo estimado, complexidade do projeto, custos fixos e variáveis, margem de lucro desejada e outros parâmetros personalizáveis para sugerir um preço justo e competitivo para seus serviços."
      },
      {
        question: "É possível gerar relatórios personalizados?",
        answer: "Sim, a Nexprice permite gerar relatórios detalhados e personalizados sobre seus projetos, finanças, tempo investido, rentabilidade e outros indicadores importantes para o seu negócio."
      },
      {
        question: "A plataforma oferece integração com outras ferramentas?",
        answer: "Sim, a Nexprice se integra com diversas ferramentas populares de gestão, contabilidade, comunicação e produtividade para criar um ecossistema completo para o seu negócio."
      },
    ]
  },
  {
    id: "suporte",
    name: "Suporte e Conta",
    faqs: [
      {
        question: "Como posso obter suporte técnico?",
        answer: "Oferecemos suporte técnico por chat, email e, para planos empresariais, também por telefone. Nossa equipe está disponível em horário comercial para ajudar com qualquer dúvida ou problema."
      },
      {
        question: "O que acontece com meus dados se eu cancelar?",
        answer: "Seus dados ficam disponíveis por 30 dias após o cancelamento. Após esse período, eles são arquivados e podem ser restaurados caso você reative sua conta. Após 90 dias, os dados são permanentemente excluídos."
      },
      {
        question: "Como posso alterar as informações da minha conta?",
        answer: "Você pode alterar as informações da sua conta a qualquer momento através da seção 'Configurações' no painel de controle. Lá você pode atualizar seus dados pessoais, informações de faturamento e preferências de notificação."
      },
    ]
  },
]

export function FAQSection() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
    
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="flex justify-center mb-8 flex-wrap">
          {faqCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {faqCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Accordion type="single" collapsible className="w-full">
              {category.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}