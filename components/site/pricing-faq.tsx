import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer:
      "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e o valor é ajustado proporcionalmente ao período restante da sua assinatura.",
  },
  {
    question: "Existe um período de teste?",
    answer:
      "Sim, oferecemos um período de teste de 14 dias para os planos Profissional e Empresarial. Durante esse período, você pode testar todas as funcionalidades sem compromisso.",
  },
  {
    question: "Como funciona o plano Gratuito?",
    answer:
      "O plano Gratuito é realmente gratuito para sempre, sem necessidade de cartão de crédito. Ele inclui as funcionalidades básicas para que você possa gerenciar até 3 projetos simultaneamente.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartões de crédito (Visa, Mastercard, American Express), PayPal e, para planos anuais, também aceitamos transferência bancária.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento ou contratos de longo prazo. Após o cancelamento, você terá acesso ao plano até o final do período pago.",
  },
  {
    question: "O que acontece com meus dados se eu cancelar?",
    answer:
      "Seus dados ficam disponíveis por 30 dias após o cancelamento. Após esse período, eles são arquivados e podem ser restaurados caso você reative sua conta. Após 90 dias, os dados são permanentemente excluídos.",
  },
]

export function PricingFAQ() {
  return (
    <div className="max-w-3xl mx-auto mt-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Perguntas Frequentes</h2>
        <p className="text-muted-foreground">Tire suas dúvidas sobre os planos e funcionalidades da Nexprice</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
